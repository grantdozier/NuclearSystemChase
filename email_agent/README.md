# Email Agent — Chase Group CC

Pulls M365 mail daily, classifies it by project, summarizes each email with Claude (rule-based fallback), and regenerates `PROJECTS/<slug>/CLAUDE.md` so every future Claude session opens with fresh project context.

---

## Quick Start

1. **Copy credentials**
   ```
   copy email_agent\config\.env.example email_agent\config\.env
   ```
   Edit `.env` and fill in your Azure AD + Anthropic values.

2. **Launch**
   Double-click `email_agent\scripts\start_email_agent.bat`
   — or run the unified launcher: `email_agent\scripts\start.bat` (starts backend, frontend, and Email Agent together).

3. **Dashboard** opens at http://127.0.0.1:8765
   Click **Run Now** to do an immediate pull, or wait for 6:00 AM.

4. **(Optional) Windows Task Scheduler fail-safe**
   ```powershell
   powershell -ExecutionPolicy Bypass -File email_agent\scripts\register_windows_task.ps1
   ```

---

## How It Works

```
Graph API ──► fetcher.py ──► classifier.py ──► summarizer.py ──► repo_writer.py
                (idempotent)   (alias+signal)   (Claude/rules)    (PROJECTS/ + CLAUDE.md)
```

| Stage | File | What it does |
|---|---|---|
| Auth | `core/graph_client.py` | MSAL client-credentials, token caching |
| Fetch | `core/fetcher.py` | Pulls inbox + sent, skips already-seen IDs |
| Classify | `core/classifier.py` | Matches project aliases; tags priority/budget/schedule |
| Summarize | `core/summarizer.py` | Claude API, falls back to rule extraction |
| Write | `core/repo_writer.py` | Writes per-email `.md` files + regenerates `CLAUDE.md` |
| Orchestrate | `core/pipeline.py` | Runs all stages, returns `RunResult` |
| Serve | `app.py` | FastAPI dashboard + APScheduler (6 AM daily) |

---

## Adding a Project

Edit `email_agent/config/settings.yaml` under `projects:`:

```yaml
- name: "My New Project"
  slug: "my-new-project"
  aliases:
    - "my new project"
    - "mnp"
  keywords:
    - "My New Project"
```

The `slug` becomes the folder name under `PROJECTS/`.

---

## Credentials Reference

| Variable | Where to find it |
|---|---|
| `AZURE_TENANT_ID` | Azure AD > Overview |
| `AZURE_CLIENT_ID` | App Registration > Overview |
| `AZURE_CLIENT_SECRET` | App Registration > Certificates & Secrets |
| `ANTHROPIC_API_KEY` | console.anthropic.com |

The Azure app needs **Mail.Read** and **Mail.ReadBasic.All** application permissions on Microsoft Graph.

---

## CLI Commands

```bash
python -m email_agent.run serve     # start dashboard + scheduler (default)
python -m email_agent.run once      # one-shot run, then exit
python -m email_agent.run dry-run   # fetch only, no writes
```
