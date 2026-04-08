# Pre-Logic Analysis — Chase Group Construction CRM

> Inferred business logic and rules based on SharePoint directory discovery (2026-03-18)
> This document represents best-guess analysis to be validated and refined by the client.

---

## 1. THE PROJECT LIFECYCLE

Chase Group operates a **three-phase pipeline** that maps directly to the top-level folder structure:

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  1. BUSINESS DEV    │ ──► │  2. ESTIMATING       │ ──► │  2. PROJECTS         │
│  (Leads & Prospects)│     │  (Bidding & Pricing) │     │  (Active Construction)│
│                     │     │                      │     │                       │
│  Named by client/   │     │  Named as YY-XXX     │     │  Same YY-XXX number  │
│  property name      │     │  Project Name        │     │  Full template struct │
└─────────────────────┘     └─────────────────────┘     └───────────────────────┘
```

**Evidence:** Shortcut .lnk files link phases together:
- `Woodhouse Spas - BusDev.lnk` (Estimating → Business Dev)
- `Palmer Parc (BD).lnk` (Project → Business Dev)
- `24-088 FPK Johnston (Estimating).lnk` (Project → Estimating)

**CRM Rule:** A project's current lifecycle phase = which top-level folder(s) it exists in.

---

## 2. PROJECT NUMBERING CONVENTION

Format: **`YY-XXX Project Name`**

| Component | Meaning | Example |
|-----------|---------|---------|
| `YY` | Year project entered estimating/construction | 24 = 2024, 25 = 2025, 26 = 2026 |
| `XXX` | Sequential project number within that year | 088, 105, 110, 115, 120, 124, 125 |
| Name | Client name, property name, or project description | FPK Johnston, Smash (Bonin Rd.), Caddy Shack |

**Special cases:**
- `25-900 MCC Estimating` — the 900-series appears reserved for internal/template use
- `25-XXX Shamsie Remodel` — XXX used when project number not yet assigned
- `00-XXX PROJECT TEMPLATE` — the 00-series is the master template

**CRM Rule:** Parse `YY-XXX` from folder name to extract project year and ID. Anything without this pattern in PROJECTS/ is a template or miscategorized.

---

## 3. PROJECT STATUS DETECTION

### 3a. Phase-Based Status (which folder it's in)

| Location | Status |
|----------|--------|
| Only in `1. BUSINESS DEVELOPMENT/` | **Lead / Prospect** |
| Only in `2. ESTIMATING/` | **Bidding** |
| In both `ESTIMATING/` and `PROJECTS/` | **Awarded / Mobilizing** |
| Only in `2. PROJECTS/` | **Active** or **Completed** |
| In `BUSINESS DEVELOPMENT/` with "(Canceled)" in name | **Canceled** |

### 3b. Activity-Based Status (what's inside the project folder)

Based on analysis of all 23 projects, here's what folder content tells us:

| Indicator | What It Means | Evidence |
|-----------|--------------|----------|
| Empty Job Costs + Empty Permits + Empty Progress Reports | **Early Stage** — just set up, not started | Lormand Rd, Ryan Martin |
| Filled Permits + Empty Job Costs + Empty Progress Reports | **Pre-Construction** — permitted but not started | - |
| Filled Job Costs + Filled Progress Reports + Active Schedules | **Active Construction** | FPK, 800 E Farrel, Caddy Shack |
| Filled Job Costs + Punch List files present | **Punch List / Closeout** | Smash (Bonin Rd.) |
| All folders filled + No schedule updates in 60+ days | **Substantially Complete** | Luquette Oil, Clipper Cove |
| Warranty Notices folder exists | **In Warranty Period** | Luquette Oil |

### 3c. Estimating Sub-Status

| Indicator | What It Means |
|-----------|--------------|
| `Proposals/` empty (0 items) | **Preparing Estimate** — still pricing |
| `Proposals/` has items | **Bid Submitted** — waiting on decision |
| `Bid Management/` folder exists | **Formal Bid Process** — tracking multiple bidders |
| `Owner Documents/` appearing in estimating folder | **Transitioning to Award** — contract docs arriving |

### 3d. Business Development Sub-Status

| Indicator | What It Means |
|-----------|--------------|
| Only site photos or single PDF | **Cold Lead** — minimal engagement |
| LOI (Letter of Intent) present | **Warm Lead** — active negotiation |
| Pitch Deck + Renders + Deal Calcs | **Hot Lead** — investment/development pursuit |
| "(Canceled by Owner)" in folder name | **Dead Lead** |
| Empty folder (0 items) | **Abandoned** — created but never pursued |
| Test fits, site plans, evaluations | **Active Prospect** — design exploration underway |

---

## 4. PROJECT HEALTH SIGNALS

### 4a. Recency Score

| Last Modified | Signal |
|---------------|--------|
| Within 7 days | **Hot** — actively being worked on |
| 8-30 days ago | **Warm** — recent activity but not daily |
| 31-90 days ago | **Cool** — may be stalled or in a waiting phase |
| 90+ days ago | **Cold** — likely complete, on hold, or abandoned |

### 4b. Content Completeness

For active projects (in `2. PROJECTS/`), score based on which standard folders have content:

| Folder | Weight | Why |
|--------|--------|-----|
| Plans & Specs | Required | Can't build without plans |
| Permits | Required | Can't start without permits |
| Owner Documents/Contract Documents | Required | No contract = no project |
| Project Schedules | High | No schedule = no timeline control |
| Job Costs/Job Cost Reports | High | No cost tracking = financial risk |
| Subcontractors (any filled divisions) | High | No subs = not mobilized |
| Progress Reports | Medium | No reports = no client communication |
| RFIs | Medium | No RFIs is unusual during active construction |
| Owner Invoices | Medium | No invoicing = not billing or very early |

### 4c. Document Gap Warnings

| Condition | Warning |
|-----------|---------|
| Active project (modified this month) with empty Job Cost Reports | **No cost tracking** |
| Active project with empty Project Schedules | **No schedule management** |
| Active project with 0 Progress Reports | **No client reporting** |
| Project with Permits but no OSHA subfolder | **Safety documentation gap** |
| Estimating project older than 90 days with empty Proposals | **Stale estimate — may need follow-up** |

---

## 5. SUBCONTRACTOR SCOPE MAPPING

Every project uses **CSI MasterFormat division numbers** for subcontractor organization. The filled divisions reveal the project's trade scope:

### Division Meaning

| Division | Trade | Common For |
|----------|-------|-----------|
| 01 - General Requirements | General conditions, cleanup | All projects |
| 02 - Existing Conditions | Demolition, site survey | Renovations |
| 03 - Concrete | Foundation, slabs, structural | Most projects |
| 04 - Masonry | Block, brick, stone | Commercial |
| 05 - Metals | Structural steel, misc metals | Larger projects |
| 06 - Wood, Plastics, Comp | Framing, casework, millwork | Most projects |
| 07 - Thermal & Moisture | Roofing, insulation, waterproofing | Most projects |
| 08 - Openings | Doors, windows, hardware | All projects |
| 09 - Finishes | Drywall, paint, flooring, tile | All projects |
| 10 - Specialties | Signage, lockers, accessories | Varies |
| 11 - Equipment | Kitchen, laundry, specialty | Restaurants, daycares |
| 12 - Furnishings | Furniture, window treatments | Varies |
| 13 - Special Construction | Clean rooms, pools, special | Specialty projects |
| 14 - Conveying Equipment | Elevators | Multi-story only |
| 21 - Fire Suppression | Sprinklers | Code-required |
| 22 - Plumbing | Plumbing | All projects |
| 23 - HVAC | Mechanical/HVAC | All projects |
| 25 - Integrated Automation | Controls, BMS | Larger projects |
| 25-28 - Electrical Systems | Electrical, low voltage | All projects |
| 27 - Communications | Data, telecom | Commercial |
| 31 - Earthwork | Grading, excavation | New construction |
| 32 - Exterior Improvements | Paving, landscaping, fencing | Most projects |
| 33 - Utilities | Water, sewer, gas | New construction |
| 46 - Water/Wastewater Equip | Specialty water systems | Caddy Shack only |

**CRM Rule:** Count of filled CSI divisions = project complexity score. More filled = larger/more complex scope.

**Typical profiles observed:**
- **Full commercial build** (FPK): 14-15 divisions filled
- **Renovation** (Smash): 15 divisions filled (higher finish scope)
- **Site/utility work** (Caddy Shack): 6-7 divisions + specialty 46
- **Early-stage** (Lormand Rd): 0 divisions filled (just the empty template)

---

## 6. REAL ESTATE DEVELOPMENT TRACK

Some projects are **dual-tracked** — they're both construction projects AND real estate development deals. These are identifiable by the presence of a large subfolder named after the property address inside the project folder.

### Development Project Indicators

| Signal | Meaning |
|--------|---------|
| `{Address}` subfolder inside project (e.g., `800 E Farrel Rd/`) | **Development deal** — not just a construction contract |
| Contents: Appraisal, Cash Sale, Evals, Offers | **Chase Group owns or is acquiring the property** |
| Contents: Fiverr, Polycam, Renders | **Marketing/investment materials being created** |
| Contents: Leasing, Tenants, LOI & Leasing | **Speculative development — leasing to tenants** |
| Contents: Pitch Deck, Investment docs | **Seeking capital partners** |

### Identified Development Projects

| Project | Dev Subfolder Size | Key Materials |
|---------|-------------------|---------------|
| 25-115 2905 Kaliste Saloom | 799.7 MB | Polycam scans (665 MB), PowerPoint (61 MB), Due Diligence, Leasing, Investment, Zoning |
| 25-116 800 E Farrel | 171 MB | 3D Models (128 MB), Appraisal, Financial Evals, LOI & Leasing (18 items) |
| 25-110 Palmer Parc | ~565 MB | DOTD Roundabout study, Traffic Impact, MP4 videos, Plat |

**CRM Rule:** If a project folder contains a subfolder >50 MB named after a street address with any of {Appraisal, Evals, Leasing, Investment, Cash Sale, Offers}, flag it as a **Development Project** in addition to a construction project.

---

## 7. OPERATIONS TEAM PHOTO CORRELATION

The CGC Operations Team site contains **field photo documentation** organized by project name (not project number). These map to active construction projects:

| Operations Folder | Matching Project | Items | Size | Recency |
|-------------------|-----------------|-------|------|---------|
| 800 E. Farrel | 25-116 800 E Farrel | 450+ items | 1.3 GB | Mar 2026 |
| Caddy Shack | 25-120 Caddy Shack | 163 items | 568 MB | Mar 2026 |
| FPK Project | 24-088 FPK Johnston | 637 items | 2.0 GB | Jan 2026 |
| Gifted Daycare | 25-105 Gifted Daycare | 38 items | 90 MB | Jan 2026 |
| Smash Project | 24-115 Smash (Bonin Rd.) | 255 items | 509 MB | Jan 2026 |
| Woodhouse | 26-124 Woodhouse Spa | 64 items | 254 MB | Mar 2026 |
| 110 Production | 25-113 110 Production Dr | 0 items | — | — |

**CRM Rule:** Cross-reference Operations Team folders with PROJECTS by fuzzy-matching project names. High photo count + recent dates = active field work. Projects in PROJECTS/ with NO matching Operations folder may not have active field work underway.

**Photo Organization Pattern:**
- `Archive/` subfolder = older consolidated photos
- `New Photos/` subfolder = active intake from field
- iOS photo naming: `IMG_XXXX.jpeg` or timestamped filenames
- Photos are the primary evidence of construction progress

---

## 8. PEOPLE AND STAKEHOLDERS

### Identified from folder names and file references:

| Name | Role/Context | Associated Projects |
|------|-------------|-------------------|
| Chase (owner) | Company principal, Chase Group founder | All projects, chase@chasegroupcc.com |
| Matthew Barrilleaux | IT Admin (matthew.admin@chasegroupcc.com) | SharePoint administration |
| Diana | Business development (texted photos) | Chemin Met. & Savoy |
| Robbie Breaux | PT tenant/client | Palmer Parc |
| Shawnee | AIA document recipient | FPK Johnston |
| MG | Temp folder recipient | Smash |
| Rotolo | Stakeholder/client | FPK Johnston |
| Dr Burbank | Client/prospect | Business Development |
| Josh Reaves | Dental client | Business Development |
| James Adduci | Client (Freeport Florida) | Business Development |
| Garcia | Daycare client | Business Development |
| Ryan Martin | Client | 25-121 project |
| Grant Landry | Chase's brother | Personal project |

**CRM Rule:** "Waiting On" status could be derived from `WaitingOn_{PersonName}` subfolder convention (not currently used but could be implemented). Currently, people are embedded in folder names and file names.

---

## 9. DOCUMENT TYPES AND THEIR SIGNIFICANCE

### Key file types found:

| Extension | Purpose | Business Significance |
|-----------|---------|----------------------|
| `.mpp` | Microsoft Project schedules | **Schedule management** — presence = active scheduling |
| `.xlsx` | Spreadsheets (budgets, estimates, cost reports) | **Financial tracking** |
| `.pdf` | Plans, permits, reports, proposals | **Formal documentation** |
| `.pptx` | Progress reports, pitch decks, presentations | **Client/investor communication** |
| `.docx` | Contracts, LOIs, scope sheets | **Legal/contractual** |
| `.dwg` | AutoCAD drawings | **Active design/engineering** |
| `.kmz` | Google Earth files | **Site evaluation** |
| `.lnk` | Windows shortcuts | **Cross-phase linking** |
| `.mp4` | Video updates | **Client progress communication** |
| `.jpeg/.jpg/.png` | Site photos | **Field documentation** |
| `.zip` | As-built packages | **Project closeout** |
| `.mpp` files with recent dates | Active schedule management | **Project is being actively managed** |

---

## 10. PROPOSED CRM STATUS ENGINE

Based on all the above analysis, here's the recommended status determination logic:

```
FOR EACH folder in the SharePoint:

1. DETERMINE LIFECYCLE PHASE
   - In "1. BUSINESS DEVELOPMENT/" → phase = LEAD
   - In "2. ESTIMATING/" → phase = ESTIMATING
   - In "2. PROJECTS/" → phase = PROJECT
   - In both ESTIMATING + PROJECTS → phase = RECENTLY_AWARDED

2. DETERMINE SUB-STATUS (for PROJECTS)
   Check folder content:

   IF has "Warranty" subfolder
     → status = WARRANTY

   IF has Punch List files (name contains "punch")
     → status = PUNCH_LIST

   IF Job Cost Reports filled AND Progress Reports filled AND Schedules updated <30 days
     → status = ACTIVE_CONSTRUCTION

   IF Permits filled BUT Job Costs empty AND Progress Reports empty
     → status = PRE_CONSTRUCTION

   IF all standard folders empty except Plans & Owner Docs
     → status = MOBILIZING

   IF last modification >90 days ago AND Job Costs filled
     → status = SUBSTANTIALLY_COMPLETE

   IF last modification >90 days ago AND most folders empty
     → status = ON_HOLD

3. DETERMINE SUB-STATUS (for ESTIMATING)
   IF Proposals/ has items → ESTIMATE_SUBMITTED
   IF Proposals/ empty AND Estimating Sheets filled → ESTIMATE_IN_PROGRESS
   IF Owner Documents appearing → TRANSITIONING_TO_AWARD
   IF last modification >90 days AND Proposals empty → STALE_ESTIMATE

4. DETERMINE SUB-STATUS (for LEADS)
   IF "(Canceled)" in folder name → DEAD_LEAD
   IF folder empty (0 items) → ABANDONED
   IF has LOI or Letter of Intent → WARM_LEAD
   IF has Pitch Deck + Renders + Deal Calcs → HOT_LEAD
   IF has only photos or single document → COLD_LEAD
   IF has test fits, site plans, evaluations → ACTIVE_PROSPECT

5. FLAG SPECIAL ATTRIBUTES
   IF large property-address subfolder with dev materials → flag DEVELOPMENT_PROJECT
   IF Operations Team has matching photo folder → flag FIELD_ACTIVE
   IF .lnk shortcut files exist → link to related lifecycle phases
   IF "Temp" or unstructured folders exist → flag NEEDS_ORGANIZATION
```

---

## 11. OPEN QUESTIONS FOR CLIENT

These are things the directory structure alone can't tell us — need Chase to confirm:

1. **What determines a project is truly "complete"?** Is there a formal closeout process, or is it just when activity stops?
2. **Are there projects that should be in the system but aren't in SharePoint yet?** (e.g., tracked in Procore, email, or elsewhere)
3. **Who are the key people whose names should trigger "Waiting On" status?** (architects, engineers, inspectors, owners)
4. **Is the 900-series number (25-900 MCC Estimating) always internal/template use?**
5. **Should the CRM track the Real Estate Development pipeline separately from construction projects?**
6. **Are there naming conventions for "on hold" or "paused" projects?** (currently not visible in the directory)
7. **How should the CRM handle the Operations Team photos — pull them in alongside project data, or keep them separate?**
8. **What does "FPK" stand for?** (appears frequently — Fat Pat's Kitchen? First Premier Kitchen?)
9. **What triggers a project to move from Estimating to Projects — a signed contract, a verbal award, or something else?**
10. **Are there any projects tracked outside this SharePoint structure** (e.g., personal OneDrive, Procore, email)?
