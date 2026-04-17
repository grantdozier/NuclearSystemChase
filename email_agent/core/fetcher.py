"""Idempotent daily email fetcher — tracks seen IDs to avoid double-processing."""
from __future__ import annotations

import json
import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from .graph_client import GraphClient
from .settings import Settings

log = logging.getLogger(__name__)

STATE_FILE = Path(__file__).parent.parent / "config" / "fetch_state.json"


def _load_state() -> dict[str, Any]:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {"seen_ids": [], "last_run": None}


def _save_state(state: dict[str, Any]) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2, default=str))


def fetch_new_emails(client: GraphClient, settings: Settings) -> list[dict[str, Any]]:
    state = _load_state()
    seen: set[str] = set(state.get("seen_ids", []))

    since = datetime.now(timezone.utc) - timedelta(days=1)
    if state.get("last_run"):
        try:
            since = datetime.fromisoformat(state["last_run"]).astimezone(timezone.utc)
        except ValueError:
            pass

    inbox = client.get_messages(settings.mailbox, since)
    sent = client.get_sent_messages(settings.mailbox, since)
    all_msgs = inbox + sent

    new_msgs = [m for m in all_msgs if m["id"] not in seen]
    log.info("%d new messages (skipped %d already seen)", len(new_msgs), len(all_msgs) - len(new_msgs))

    new_ids = [m["id"] for m in new_msgs]
    state["seen_ids"] = list(seen | set(new_ids))
    state["last_run"] = datetime.now(timezone.utc).isoformat()
    _save_state(state)

    return new_msgs
