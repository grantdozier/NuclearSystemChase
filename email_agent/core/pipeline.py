"""Orchestrate the full email-agent pipeline."""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import TYPE_CHECKING

from .classifier import ClassifiedEmail, classify
from .fetcher import fetch_new_emails
from .graph_client import GraphClient
from .repo_writer import write_results
from .settings import Settings, load
from .summarizer import summarize_batch

if TYPE_CHECKING:
    pass

log = logging.getLogger(__name__)


@dataclass
class RunResult:
    started_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    finished_at: datetime | None = None
    fetched: int = 0
    classified: int = 0
    unmatched: int = 0
    written: dict[str, list[Path]] = field(default_factory=dict)
    error: str | None = None

    @property
    def duration_seconds(self) -> float | None:
        if self.finished_at:
            return (self.finished_at - self.started_at).total_seconds()
        return None

    def to_dict(self) -> dict:
        return {
            "started_at": self.started_at.isoformat(),
            "finished_at": self.finished_at.isoformat() if self.finished_at else None,
            "duration_seconds": self.duration_seconds,
            "fetched": self.fetched,
            "classified": self.classified,
            "unmatched": self.unmatched,
            "written": {k: [str(p) for p in v] for k, v in self.written.items()},
            "error": self.error,
        }


def run(dry_run: bool = False) -> RunResult:
    result = RunResult()
    try:
        settings = load()
        client = GraphClient(
            tenant_id=settings.tenant_id,
            client_id=settings.client_id,
            client_secret=settings.client_secret,
            scopes=settings.scopes,
        )

        messages = fetch_new_emails(client, settings)
        result.fetched = len(messages)

        if dry_run:
            log.info("Dry-run: fetched %d messages, skipping classification/write", len(messages))
            result.finished_at = datetime.now(timezone.utc)
            return result

        classified: list[ClassifiedEmail] = classify(messages, settings)
        result.classified = sum(1 for e in classified if e.project is not None)
        result.unmatched = sum(1 for e in classified if e.project is None)

        summaries = summarize_batch(classified, settings)
        result.written = write_results(classified, summaries, settings)

    except Exception as exc:
        log.exception("Pipeline failed")
        result.error = str(exc)

    result.finished_at = datetime.now(timezone.utc)
    return result
