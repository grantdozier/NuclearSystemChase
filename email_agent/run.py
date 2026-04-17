"""CLI entry point: python -m email_agent.run [serve|once|dry-run]"""
from __future__ import annotations

import logging
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s — %(message)s")


def main() -> None:
    cmd = sys.argv[1] if len(sys.argv) > 1 else "serve"

    if cmd == "serve":
        import uvicorn
        from .core.settings import load
        settings = load()
        uvicorn.run(
            "email_agent.app:app",
            host=settings.dashboard_host,
            port=settings.dashboard_port,
            log_level="info",
        )

    elif cmd == "once":
        from .core.pipeline import run
        result = run()
        print(f"Done — fetched={result.fetched} classified={result.classified} unmatched={result.unmatched}")
        if result.error:
            print(f"Error: {result.error}")
            sys.exit(1)

    elif cmd == "dry-run":
        from .core.pipeline import run
        result = run(dry_run=True)
        print(f"Dry-run — fetched={result.fetched} (no writes)")
        if result.error:
            print(f"Error: {result.error}")
            sys.exit(1)

    else:
        print(f"Unknown command: {cmd}")
        print("Usage: python -m email_agent.run [serve|once|dry-run]")
        sys.exit(1)


if __name__ == "__main__":
    main()
