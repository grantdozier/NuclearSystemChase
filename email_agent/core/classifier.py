"""Classify emails to projects using alias matching + keyword signals."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

from .settings import ProjectConfig, Settings


@dataclass
class ClassifiedEmail:
    raw: dict[str, Any]
    message_id: str
    subject: str
    sender: str
    received: str
    body_preview: str
    body_html: str
    has_attachments: bool
    project: ProjectConfig | None
    is_priority: bool = False
    is_budget: bool = False
    is_schedule: bool = False
    tags: list[str] = field(default_factory=list)


def _text_blob(msg: dict[str, Any]) -> str:
    subject = msg.get("subject", "")
    preview = msg.get("bodyPreview", "")
    sender = msg.get("from", {}).get("emailAddress", {}).get("address", "")
    to_addrs = " ".join(
        r.get("emailAddress", {}).get("address", "")
        for r in msg.get("toRecipients", [])
    )
    return f"{subject} {preview} {sender} {to_addrs}".lower()


def _match_project(blob: str, projects: list[ProjectConfig]) -> ProjectConfig | None:
    for proj in projects:
        for alias in proj.aliases:
            if alias in blob:
                return proj
        for kw in proj.keywords:
            if kw.lower() in blob:
                return proj
    return None


def classify(messages: list[dict[str, Any]], settings: Settings) -> list[ClassifiedEmail]:
    results: list[ClassifiedEmail] = []
    for msg in messages:
        blob = _text_blob(msg)
        project = _match_project(blob, settings.projects)

        is_priority = any(s in blob for s in settings.priority_signals)
        is_budget = any(s in blob for s in settings.budget_signals)
        is_schedule = any(s in blob for s in settings.schedule_signals)

        tags: list[str] = []
        if is_priority:
            tags.append("priority")
        if is_budget:
            tags.append("budget")
        if is_schedule:
            tags.append("schedule")
        if project is None:
            tags.append("unmatched")

        results.append(
            ClassifiedEmail(
                raw=msg,
                message_id=msg.get("id", ""),
                subject=msg.get("subject", "(no subject)"),
                sender=msg.get("from", {}).get("emailAddress", {}).get("address", ""),
                received=msg.get("receivedDateTime", ""),
                body_preview=msg.get("bodyPreview", ""),
                body_html=msg.get("body", {}).get("content", ""),
                has_attachments=msg.get("hasAttachments", False),
                project=project,
                is_priority=is_priority,
                is_budget=is_budget,
                is_schedule=is_schedule,
                tags=tags,
            )
        )
    return results
