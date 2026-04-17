"""FastAPI dashboard + APScheduler for the Email Agent."""
from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

log = logging.getLogger(__name__)

WEB_DIR = Path(__file__).parent / "web"
HISTORY_FILE = Path(__file__).parent / "config" / "run_history.json"

app = FastAPI(title="Email Agent", docs_url=None, redoc_url=None)
app.mount("/static", StaticFiles(directory=str(WEB_DIR)), name="static")

_history: list[dict] = []
_last_run: dict | None = None
_scheduler_running = False


def _load_history() -> None:
    global _history
    if HISTORY_FILE.exists():
        try:
            _history = json.loads(HISTORY_FILE.read_text())
        except Exception:
            _history = []


def _save_history() -> None:
    HISTORY_FILE.write_text(json.dumps(_history[-100:], indent=2, default=str))


def _run_pipeline() -> dict:
    global _last_run
    from .core.pipeline import run
    result = run()
    d = result.to_dict()
    _history.insert(0, d)
    _last_run = d
    _save_history()
    log.info("Pipeline complete: fetched=%d classified=%d", result.fetched, result.classified)
    return d


@app.on_event("startup")
async def startup() -> None:
    global _scheduler_running
    _load_history()
    if _history:
        global _last_run
        _last_run = _history[0]

    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        from .core.settings import load
        settings = load()
        scheduler = BackgroundScheduler(timezone=settings.timezone)
        cron_parts = settings.cron.split()
        scheduler.add_job(
            _run_pipeline,
            "cron",
            minute=cron_parts[0],
            hour=cron_parts[1],
            day=cron_parts[2],
            month=cron_parts[3],
            day_of_week=cron_parts[4],
        )
        scheduler.start()
        _scheduler_running = True
        log.info("Scheduler armed: %s %s", settings.cron, settings.timezone)
    except Exception as exc:
        log.warning("Scheduler failed to start: %s", exc)


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(str(WEB_DIR / "dashboard.html"))


@app.get("/api/status")
async def status() -> JSONResponse:
    return JSONResponse({"scheduler_running": _scheduler_running, "last_run": _last_run})


@app.get("/api/history")
async def history() -> JSONResponse:
    return JSONResponse(_history)


@app.post("/api/run")
async def run_now() -> JSONResponse:
    try:
        result = _run_pipeline()
        return JSONResponse(result)
    except Exception as exc:
        log.exception("Manual run failed")
        return JSONResponse({"error": str(exc)}, status_code=500)
