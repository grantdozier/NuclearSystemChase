"""Load settings from config/settings.yaml + environment variables."""
from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml

CONFIG_PATH = Path(__file__).parent.parent / "config" / "settings.yaml"
ENV_PATH = Path(__file__).parent.parent / "config" / ".env"


def _load_env(path: Path) -> None:
    if not path.exists():
        return
    with path.open() as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())


def _interpolate(value: Any) -> Any:
    if isinstance(value, str):
        return re.sub(
            r"\$\{([^}]+)\}",
            lambda m: os.environ.get(m.group(1), m.group(0)),
            value,
        )
    if isinstance(value, dict):
        return {k: _interpolate(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_interpolate(i) for i in value]
    return value


@dataclass
class ProjectConfig:
    name: str
    slug: str
    aliases: list[str] = field(default_factory=list)
    keywords: list[str] = field(default_factory=list)


@dataclass
class Settings:
    tenant_id: str
    client_id: str
    client_secret: str
    scopes: list[str]
    mailbox: str
    anthropic_api_key: str
    anthropic_model: str
    cron: str
    timezone: str
    dashboard_host: str
    dashboard_port: int
    projects_dir: str
    projects: list[ProjectConfig]
    priority_signals: list[str]
    budget_signals: list[str]
    schedule_signals: list[str]


def load() -> Settings:
    _load_env(ENV_PATH)
    with CONFIG_PATH.open() as f:
        raw = _interpolate(yaml.safe_load(f))

    projects = [
        ProjectConfig(
            name=p["name"],
            slug=p["slug"],
            aliases=[a.lower() for a in p.get("aliases", [])],
            keywords=p.get("keywords", []),
        )
        for p in raw.get("projects", [])
    ]

    clf = raw.get("classifier", {})
    return Settings(
        tenant_id=raw["azure"]["tenant_id"],
        client_id=raw["azure"]["client_id"],
        client_secret=raw["azure"]["client_secret"],
        scopes=raw["azure"]["scopes"],
        mailbox=raw["mailbox"],
        anthropic_api_key=raw["anthropic"]["api_key"],
        anthropic_model=raw["anthropic"]["model"],
        cron=raw["scheduler"]["cron"],
        timezone=raw["scheduler"]["timezone"],
        dashboard_host=raw["dashboard"]["host"],
        dashboard_port=int(raw["dashboard"]["port"]),
        projects_dir=raw["repo"]["projects_dir"],
        projects=projects,
        priority_signals=[s.lower() for s in clf.get("priority_signals", [])],
        budget_signals=[s.lower() for s in clf.get("budget_signals", [])],
        schedule_signals=[s.lower() for s in clf.get("schedule_signals", [])],
    )
