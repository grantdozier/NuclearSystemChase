"""Summarize emails with Claude; fall back to rule-based extraction if unavailable."""
from __future__ import annotations

import logging
import re
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .classifier import ClassifiedEmail
    from .settings import Settings

log = logging.getLogger(__name__)

_CLAUDE_PROMPT = """You are a construction project manager's assistant. Summarize this email in 2-3 sentences, focusing on:
- Action items or decisions required
- Deadlines or schedule impacts
- Budget or change-order impacts
- Who needs to respond

Email subject: {subject}
From: {sender}
Body:
{body}

Reply with only the summary — no preamble, no labels."""


def _rule_based_summary(email: "ClassifiedEmail") -> str:
    lines: list[str] = []
    if email.is_priority:
        lines.append("PRIORITY — requires immediate attention.")
    if email.is_budget:
        lines.append("Budget/change-order topic detected.")
    if email.is_schedule:
        lines.append("Schedule or milestone topic detected.")
    preview = email.body_preview[:300].strip()
    if preview:
        lines.append(preview)
    return " ".join(lines) or email.body_preview[:200]


def summarize_batch(emails: list["ClassifiedEmail"], settings: "Settings") -> dict[str, str]:
    """Return {message_id: summary_text} for each email."""
    summaries: dict[str, str] = {}

    if not settings.anthropic_api_key or settings.anthropic_api_key.startswith("${"):
        log.warning("No Anthropic API key — using rule-based summarization")
        for e in emails:
            summaries[e.message_id] = _rule_based_summary(e)
        return summaries

    try:
        import anthropic  # type: ignore

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        for email in emails:
            body_text = re.sub(r"<[^>]+>", " ", email.body_html)[:3000]
            try:
                msg = client.messages.create(
                    model=settings.anthropic_model,
                    max_tokens=256,
                    messages=[
                        {
                            "role": "user",
                            "content": _CLAUDE_PROMPT.format(
                                subject=email.subject,
                                sender=email.sender,
                                body=body_text,
                            ),
                        }
                    ],
                )
                summaries[email.message_id] = msg.content[0].text.strip()
            except Exception as exc:
                log.warning("Claude summarization failed for %s: %s", email.message_id, exc)
                summaries[email.message_id] = _rule_based_summary(email)
    except ImportError:
        log.warning("anthropic package not installed — using rule-based summarization")
        for e in emails:
            summaries[e.message_id] = _rule_based_summary(e)

    return summaries
