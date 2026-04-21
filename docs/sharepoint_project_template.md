# SharePoint Project Folder Template

**Site:** CGC Operations Team
**Root:** `C:\Users\ChaseLandry\Chase Construction Group\CGC Operations Team - Documents\<Project Name>\`

Every active construction project under CGC Operations Team is expected to conform to the tree below. The agents (Email, PM, Operator) rely on this structure to locate documents, match emails to projects, and compute status via `SharePointService.DetermineProjectStatus()`.

## Canonical tree

```
<Project>/
├── 00_Contract/          # Owner contract, AIA docs, executed agreements, insurance certs
├── 01_Drawings/          # Current plans + superseded sets (keep baseline + most recent set)
├── 02_Specs/             # Project manual, divisions 01-33
├── 03_Permits/           # Building, MEP, fire-marshal, CO, utility permits
├── 04_Estimate/          # Original estimate, bid package, leveled bids (export from Precon Suite)
├── 05_Budget/            # 7-column workbook: original, approved, pending, revised, committed, actual, forecast
├── 06_Schedule/          # Baseline schedule, current schedule, 3-week look-aheads, TIAs
├── 07_Daily_Reports/     # Superintendent daily logs; YYYY-MM-DD.xlsx or .pdf per day
├── 08_Photos/            # Site photos, drone, progress; YYYY-MM-DD subfolders
├── 09_Meetings/          # OAC minutes, coordination notes; subfolder per meeting
├── 10_Submittals/        # Submittal log + individual submittal packages by CSI division
├── 11_RFIs/              # RFI log + individual RFIs with responses
├── 12_Change_Orders/     # CO log, pricing backup, signed COs; separate CO#-named subfolders
├── 13_Pay_Apps/          # Monthly AIA G702/G703, lien waivers, backup
├── 14_Closeout/          # Punch list, O&M manuals, warranties, consent of surety, final lien waivers
└── _agent/               # Written by agents: YYYY-MM-DD.md daily reviews, weekly rollups. Do not edit by hand.
```

## Rules

1. **No work inside `_agent/`** — it is overwritten by the PM and Email agents. Any human notes go into the appropriate numbered folder.
2. **Baseline documents are never overwritten.** A superseded schedule or drawing gets moved to an `archive/` subfolder inside its parent, not deleted.
3. **Filenames carry dates in ISO form (`YYYY-MM-DD`)** so agents can sort and detect freshness. Example: `fpk_budget_2026-04-21.xlsx`.
4. **Photos go under `08_Photos/YYYY-MM-DD/`** — never dumped into the project root.
5. **Every email that gets matched to a project writes a pointer into `_agent/email-digest.md`**, but the raw email body does NOT go here (privacy + bulk). Raw bodies stay in the NuclearSystemChase backing store.

## Migration of existing projects

Current projects (FPK, 800 E. Farrel, Caddy Shack, Gifted Daycare, Smash, Woodhouse, 110 Production) are non-conforming — their root is mostly raw photos. A one-time migration pass will:

1. Move loose photos into `08_Photos/<date>/` based on file timestamps.
2. Create empty numbered folders for the categories so agents can write into them.
3. **Not move any file Chase might reference by its current path** without an explicit move-log. Migration log goes to `_agent/migration-<date>.md` per project.

Migration is scheduled for Phase 1 (after the Email Agent is multi-mailbox), not Phase 0.

## Why this layout

- **Numeric prefixes** so the folder order in Explorer matches the logical order of a project lifecycle (contract → drawings → permits → ... → closeout).
- **CSI-adjacent but not CSI-strict** — Chase's PM Training CSI Divisions Guide lives in the knowledge base; this tree is for PM workflow, not spec organization.
- **`_agent/` prefix** with underscore so it sorts to the top and is visually distinct from human-owned folders.
