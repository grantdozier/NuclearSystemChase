# NuclearSystemChase - Construction CRM

This is Chase Group Construction's project management tool. It connects to SharePoint via Microsoft Graph API, pulls in all project folders, and gives you a dashboard to track everything. It also acts as an MCP server so Claude Desktop can see your project data alongside your email and calendar.

## For the user (plain English)

### First time setup
1. Double-click `setup.bat` in the root folder. It checks that everything is installed and sets up the project.
2. If it says anything is missing, install it and run setup.bat again.
3. Edit `backend\.env` and paste in your Azure client secret (Grant will give you this).

### Starting the app
You need two terminals open. In VS Code, click Terminal > New Terminal twice.

**Terminal 1 — start the backend:**
```
cd backend
dotnet run
```
You should see "Now listening on http://localhost:5000". Leave this running.

**Terminal 2 — start the frontend:**
```
cd frontend
npm run dev
```
You should see "Local: http://localhost:3879". Leave this running.

Now open http://localhost:3879 in your browser. You'll see the project dashboard.

To stop either one, click in that terminal and press Ctrl+C.

### Connecting to Claude Desktop
Claude Desktop can talk to this app and see your project data. To set it up:
1. Open the file `claude-desktop-config.example.json` in this folder
2. Copy its contents
3. Open Claude Desktop > Settings > Developer > Edit Config
4. Paste it in, but change the path to match where this folder is on your machine
5. Restart Claude Desktop

Now when you talk to Claude, it can look up your projects, check which ones are stale, search by name, etc. — on top of the email and calendar access you already have.

### Email Intelligence
Email is built directly into the app — not a separate service. It runs inside the .NET backend on the same process as SharePoint.

To enable it:
1. Add `ANTHROPIC_API_KEY=your-key` to `backend/.env` (optional — enables Claude summarization; falls back to rule-based without it)
2. Start the app normally — the email scheduler starts with the backend
3. Open http://localhost:3879/email to see the dashboard, run on demand, and view history

**Mailbox**: Derek's inbox (`derek@chasegroupcc.com`). Change in `backend/appsettings.json` → `Email.Mailbox`.
**Projects tracked**: FPK, 800 E Farrel, Trimble Sight Rollout. Add more under `Email.Projects` in appsettings.json.
**Schedule**: Runs daily at 6 AM Central automatically.

### Asking Claude Code to do things
When you open this project in VS Code with Claude Code installed, you can ask it to do things like:
- "Start up the backend and frontend servers for me"
- "Add a new MCP tool that shows me all projects missing permits"
- "Add a page to the dashboard that shows a weekly summary"
- "Change the status logic so projects with a closeout folder are marked Complete"
- "Add an email notification when a project goes stale"
- "Add a project to the Email Agent"

Claude Code can read every file in this project, understands how it all connects, and can make changes for you. Just describe what you want in plain English.

### If something breaks
- If the backend won't start: make sure `backend\.env` has the client secret, and check that port 5000 isn't already in use
- If the frontend won't start: run `cd frontend && npm install` then try again
- If Claude Desktop doesn't show project tools: check that the path in your Claude Desktop config matches where this repo lives on your machine
- If projects aren't loading: the SharePoint scan runs every 60 seconds on startup — wait a moment and refresh

---

## For Claude Code (technical reference)

Everything below is for Claude Code to understand the codebase. You don't need to read this part.

### Architecture
- **Backend**: ASP.NET Core Web API (C#) in `backend/`
- **Frontend**: React + Vite in `frontend/`
- **MCP Server**: Built into the backend, exposes project tools to Claude Desktop via stdio
- **Email Agent**: Python FastAPI service in `email_agent/` — daily M365 mail pull, project classification, Claude summarization, PROJECTS/ context regeneration
- Backend serves React build output from `wwwroot/` as static files
- Single self-contained deployment — client runs one exe, opens browser

### Key paths
- `backend/Services/GraphAuthService.cs` — OAuth2 client-credentials auth for Microsoft Graph API
- `backend/Services/SharePointService.cs` — polls SharePoint via Graph API, builds directory tree, extracts projects, determines status
- `backend/Mcp/ProjectTools.cs` — MCP tools exposed to Claude Desktop (list_projects, search_projects, get_stale_projects, etc.)
- `backend/Controllers/` — API endpoints for directory tree, projects, settings
- `backend/Models/SharePointConfig.cs` — AzureAd and SharePoint config models
- `frontend/src/services/api.js` — API client
- `frontend/src/pages/` — Dashboard, Projects, Explorer, Settings

### Running the app
- Backend: `cd backend && dotnet run` (runs on http://localhost:5000)
- Frontend: `cd frontend && npm run dev` (runs on http://localhost:3879, proxies /api to :5000)
- MCP mode: `cd backend && dotnet run -- --mcp` (stdio server for Claude Desktop)
- Build for deployment: `publish.bat` (outputs to `./dist/`)

### How to start servers for the user
When the user asks you to start, run, or spin up the app:
1. Run `cd backend && dotnet run` in a background terminal
2. Run `cd frontend && npm run dev` in a second background terminal
3. Tell them to open http://localhost:3879 in their browser
4. If either fails, read the error and fix it before retrying

### MCP Server
- Run with `dotnet run -- --mcp` to start as a stdio MCP server
- Claude Desktop config should point to this with command `dotnet` and args `["run", "--project", "<path>/backend", "--", "--mcp"]`
- Tools are defined in `backend/Mcp/ProjectTools.cs` — add new tools by adding methods with `[McpServerTool]` attribute
- The MCP server uses the same SharePointService and GraphAuthService as the web app
- To add a new tool: add a static method to ProjectTools.cs with `[McpServerTool(Name = "tool_name")]` and `[Description("...")]` attributes. The SharePointService is injected automatically as a parameter.

### Adding new features
- New API endpoints: add a controller in `backend/Controllers/`
- New frontend pages: add a component in `frontend/src/pages/`, add route in `frontend/src/App.jsx`
- New MCP tools: add methods to `backend/Mcp/ProjectTools.cs`
- New data from SharePoint: extend `SharePointService.cs` and the models in `backend/Models/`
- The frontend talks to the backend through `frontend/src/services/api.js` — add new API calls there

### Configuration
- `backend/appsettings.json` — AzureAd credentials and SharePoint site config
- `backend/.env` — put `AZURE_CLIENT_SECRET=xxx` here (gitignored, not checked in)
- Can also be set via the Settings page in the UI

### Status logic
- Project status is determined in `SharePointService.DetermineProjectStatus()` and `DetermineLeadStatus()`
- Based on folder structure: warranty folder → Complete, punch list files → PunchList, job costs + progress reports + schedules → Active, etc.

### Email Intelligence (technical)
- **No separate process** — runs inside the .NET backend as a BackgroundService
- Auth reuses `GraphAuthService` (same MSAL token as SharePoint)
- `backend/Services/EmailService.cs` — Graph fetch + classification + Anthropic summarization (claude-haiku)
- `backend/Services/EmailSchedulerService.cs` — IHostedService; daily 6 AM timer + manual trigger via `TriggerAsync()`
- `backend/Controllers/EmailController.cs` — REST API: `GET /api/email/status`, `GET /api/email/history`, `GET /api/email/emails`, `POST /api/email/run`
- `frontend/src/pages/Email.jsx` — Email dashboard at `/email` route
- Run history persisted to `backend/email_run_history.json` (auto-created, gitignored)
- Classification config: `backend/appsettings.json` → `Email` section
- Summarization: `ANTHROPIC_API_KEY` env var (from `backend/.env`); falls back to rule-based if absent
- PROJECTS/fpk/CLAUDE.md — FPK project context (seeded from handover; agent updates on each run)
