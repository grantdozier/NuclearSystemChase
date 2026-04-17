"""Write email digests and regenerate PROJECTS/<slug>/CLAUDE.md files."""
from __future__ import annotations

import logging
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .classifier import ClassifiedEmail
    from .settings import Settings

log = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).parent.parent.parent


def _slug_dir(projects_dir: str, slug: str) -> Path:
    d = REPO_ROOT / projects_dir / slug
    d.mkdir(parents=True, exist_ok=True)
    return d


def _email_filename(email: "ClassifiedEmail") -> str:
    dt = email.received[:10] if email.received else "unknown"
    safe_subject = "".join(c if c.isalnum() or c in " -_" else "_" for c in email.subject[:60]).strip()
    return f"{dt}_{safe_subject}.md"


def _write_email_file(base_dir: Path, email: "ClassifiedEmail", summary: str) -> Path:
    emails_dir = base_dir / "emails"
    emails_dir.mkdir(exist_ok=True)
    path = emails_dir / _email_filename(email)
    tags_str = ", ".join(email.tags) if email.tags else "none"
    content = f"""# {email.subject}

**From:** {email.sender}
**Received:** {email.received}
**Tags:** {tags_str}
**Has Attachments:** {"Yes" if email.has_attachments else "No"}

## Summary

{summary}

## Body Preview

{email.body_preview}
"""
    path.write_text(content, encoding="utf-8")
    return path


def _regenerate_claude_md(base_dir: Path, project_name: str, emails: list["ClassifiedEmail"], summaries: dict[str, str]) -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    priority = [e for e in emails if e.is_priority]
    budget = [e for e in emails if e.is_budget]
    schedule = [e for e in emails if e.is_schedule]

    def _bullet(e: "ClassifiedEmail") -> str:
        summary = summaries.get(e.message_id, e.body_preview[:120])
        return f"- **{e.received[:10]}** from {e.sender}: {summary}"

    sections: list[str] = [
        f"# {project_name} — Email Context\n",
        f"_Last updated by Email Agent: {now}_\n",
        "This file is auto-generated. Edit `email_agent/config/settings.yaml` to change project config.\n",
    ]

    if priority:
        sections.append("## Priority Items\n")
        sections.extend(_bullet(e) + "\n" for e in priority)

    if budget:
        sections.append("\n## Budget / Change Orders\n")
        sections.extend(_bullet(e) + "\n" for e in budget)

    if schedule:
        sections.append("\n## Schedule / Milestones\n")
        sections.extend(_bullet(e) + "\n" for e in schedule)

    other = [e for e in emails if not e.is_priority and not e.is_budget and not e.is_schedule]
    if other:
        sections.append("\n## General Correspondence\n")
        sections.extend(_bullet(e) + "\n" for e in other)

    if not emails:
        sections.append("\n_No emails processed in the last run._\n")

    path = base_dir / "CLAUDE.md"
    path.write_text("".join(sections), encoding="utf-8")
    log.info("Wrote %s", path)


def write_results(
    classified: list["ClassifiedEmail"],
    summaries: dict[str, str],
    settings: "Settings",
) -> dict[str, list[Path]]:
    by_project: dict[str, list["ClassifiedEmail"]] = defaultdict(list)
    for email in classified:
        if email.project:
            by_project[email.project.slug].append(email)

    written: dict[str, list[Path]] = {}
    for proj in settings.projects:
        emails = by_project.get(proj.slug, [])
        base = _slug_dir(settings.projects_dir, proj.slug)
        paths: list[Path] = []
        for email in emails:
            p = _write_email_file(base, email, summaries.get(email.message_id, ""))
            paths.append(p)
        _regenerate_claude_md(base, proj.name, emails, summaries)
        written[proj.slug] = paths
        log.info("Project %s: wrote %d email files", proj.slug, len(paths))

    return written
