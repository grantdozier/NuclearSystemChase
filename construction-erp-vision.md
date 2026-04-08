# Chase Group Construction — Full System Vision

## The Core Insight

> "The estimate should seamlessly become the budget and drive execution."

This document captures the full vision for a vertically integrated commercial construction operating system where estimating, scope control, bid leveling, budget creation, buyout, project execution, and accounting all run natively in one platform.

---

## The Problem

### What Currently Exists (Fragmented Market)

**Accounting-Heavy ERPs**
- Procore (no native accounting)
- Viewpoint Vista
- Sage 300 / 100 Contractor
- CMiC

Strengths: Job costing, financials, compliance
Weaknesses: Clunky estimating, no real bid leveling intelligence, terrible UX

**Estimating + Takeoff Tools**
- PlanSwift
- Bluebeam
- OST (On-Screen Takeoff)
- STACK
- Togal.ai (new AI entrant)

Strengths: Quantities, takeoff
Weaknesses: Not connected to execution or accounting

**Bid Management Tools**
- BuildingConnected (Autodesk)
- SmartBid

Strengths: ITB (invitation to bid), sub outreach
Weaknesses: No deep estimating logic, no true bid leveling intelligence

### The Gap (This Is the Opportunity)

There is NO dominant system that cleanly does all of this:

> Native takeoff → estimate → scope sheets → bid leveling → award → auto buyout → execution → accounting

With:
- Real workflow intelligence
- Sub database intelligence
- Clean transitions between phases

**The key gap:** Bid leveling + scope intelligence + estimate → budget automation

That's where systems fall apart. And that's where money is won or lost.

---

## The Full Lifecycle

A project should move through these stages without re-entry of data:

```
Lead → Bid Opportunity → Estimate → Bid Leveling → Proposal → Award →
Budget → Buyout → Project Execution → Billing/Cost Control → Closeout → Warranty
```

Every stage is not a separate app. It is the **same project record evolving over time**.

---

## Platform Modules

### Module 1: Business Development / Preconstruction

Where work starts before a job exists.

**Functions:**
- Lead intake
- Opportunity tracking
- Client and architect database
- Bid invitation calendar
- RFP / ITB tracking
- Bid document intake
- Estimator assignment
- Go / no-go decision workflow
- Prequalification tracking
- Historical bid analytics

**Main Records:**
- Companies, Contacts, Opportunities
- Bid packages, Bid documents
- Qualification notes, Decision logs

**Goal:** Turn scattered email, invitations, and bid docs into a structured opportunity pipeline.

---

### Module 2: Document Intake and Plan Room

Where plans and specs come in.

**Functions:**
- Upload plans, specs, addenda, geotech, alternates
- Version control for revised drawings
- Drawing index
- Spec section parsing
- Addendum tracking
- Distribution to estimators, subs, vendors
- Link plan sheets to scope packages

**Main Records:**
- Project documents, Drawing sheets
- Spec sections, Addenda
- Plan versions, Distribution logs

**Goal:** Make the bid documents the starting data source for the entire estimate and downstream workflow.

---

### Module 3: Estimating

The cost-building engine.

**Functions:**
- Estimate setup
- Cost code structure (CSI division structure)
- Assemblies
- Labor databases
- Material databases
- Equipment pricing
- Crew production assumptions
- General conditions / Indirects
- Escalation / Contingency
- Fee / overhead / profit
- Alternates / Allowances / Unit pricing
- Estimate revisions

**Main Records:**
- Estimates, Estimate versions
- Cost items, Assemblies
- Labor rates, Material catalogs
- Equipment rates, Markups
- Alternates, Assumptions log

**Goal:** Produce a fully structured estimate, not just a summary number.

---

### Module 4: Digital Takeoff

Native takeoff — no separate tool needed.

**Functions:**
- View drawings
- Measure area, length, count, volume
- Condition overlays
- Named takeoff conditions
- Scope-based quantity extraction
- Auto-link quantities to estimate line items
- Revision comparison between plan versions
- Audit trail of quantity changes

**Main Records:**
- Takeoff sessions, Quantity items
- Drawing markups
- Linked estimate items
- Revision diffs

**Goal:** No more exporting quantities from a separate takeoff tool and re-entering them into the estimate.

---

### Module 5: Scope Sheet Builder

One of the most important modules and one of the big holes in most existing systems.

**Functions:**
- Build scope packages by trade
- List inclusions and exclusions
- Separate turnkey versus material/labor split scopes
- Clarifications
- Responsibility assignments
- Vendor notes
- Scope templates by trade
- Link scope sheets to bid packages and estimate items

**Main Records:**
- Scope packages, Scope sheet versions
- Inclusions, Exclusions
- Clarifications, Trade templates

**Goal:** Create the exact structured scope language needed for subcontractor pricing and later buyout.

---

### Module 6: Invitation to Bid and Bid Solicitation

Push work to subs and vendors.

**Functions:**
- Create bid packages
- Select qualified subs and vendors
- Send ITBs
- Attach plans/specs/addenda
- Track who opened documents
- Track who intends to bid
- Deadline reminders
- Addendum acknowledgements
- Bid submission portal
- Communication logs

**Main Records:**
- ITBs, Recipients
- Bid acknowledgements, Addendum acknowledgements
- Bid package distributions, Bid communications

**Goal:** All subcontractor outreach happens inside the system, tied to the estimate and scope packages.

---

### Module 7: Subcontractor and Vendor Management

The master trade partner database.

**Functions:**
- Company profiles
- Trade classifications
- Geographic coverage
- Contact roles
- Insurance certificates
- License tracking
- W-9 / tax docs
- Performance history
- Safety ratings
- Bid hit rate
- Award history
- Compliance expiration alerts

**Main Records:**
- Subcontractors, Vendors, Trades
- Compliance docs, Qualifications
- Performance records, Coverage maps

**Goal:** One prequalified source of truth for who you invite, award, and pay.

---

### Module 8: Bid Receipt and Bid Leveling

**This is the real differentiator.**

**Functions:**
- Receive subcontractor bids
- Parse inclusions/exclusions
- Normalize line items
- Compare bidders apples to apples
- Flag missing scope
- Flag qualifications that create downstream risk
- Compare against internal estimate target
- Show true low bidder versus stated low bidder
- Track alternates and clarifications
- Attach proposal PDFs and emails
- Level by trade package

**Main Records:**
- Bid submissions, Bid leveling sheets
- Scope comparison matrix
- Clarification logs, Risk flags
- Award recommendations

**Goal:** Replace fragile spreadsheets and stop fake low bids from poisoning the job.

**Example — Concrete Package Bid Leveling:**

| Item | Bidder A | Bidder B | Bidder C | Internal Target |
|------|----------|----------|----------|-----------------|
| Slab | Included | Included | Included | $45,000 |
| Foundation | Included | Included | Included | $32,000 |
| Rebar | Included | **EXCLUDED** | Included | $18,000 |
| Vapor Barrier | Included | **EXCLUDED** | Included | $4,000 |
| Long Lead | Standard | Standard | **Clarification** | — |
| **Stated Bid** | $95,000 | $78,000 | $97,000 | $99,000 |
| **Adjusted (Normalized)** | $95,000 | **$100,000** | $97,000 | $99,000 |

Bidder B looks cheapest but is actually the most expensive after scope normalization. That is not just a table — **that is decision software**.

---

### Module 9: Proposal and Award

Compile and submit the proposal.

**Functions:**
- Proposal generation
- Owner bid forms
- Schedule of values support
- Clarifications and exclusions
- Alternates
- Bonding information
- Submission package generation
- Revision control
- Award status tracking

**Goal:** The estimate becomes a customer-facing proposal without rebuilding the job from scratch.

---

### Module 10: Contract Conversion

The opportunity turns into a live project.

**Functions:**
- Convert awarded estimate into project
- Strip out fee and markups as needed
- Separate estimate into budget cost categories
- Establish original contract value
- Track allowances, alternates, contingency
- Assign PM, superintendent, accountant
- Create project baseline

**Goal:** **Estimate becomes budget. No re-entry.** This is the critical transition.

---

### Module 11: Budgeting and Cost Control

The estimate becomes the management tool.

**Functions:**
- Original budget / Revised budget
- Cost code breakdown
- Committed costs / Actual costs
- Forecast final cost
- Cost to complete
- Variance tracking
- Contingency management
- Monthly projection workflows

**Goal:** The PM runs the job from a live budget that originated from the estimate.

---

### Module 12: Buyout and Commitments

Lock in subcontractors and vendors.

**Functions:**
- Convert leveled bids into awards
- Generate subcontracts, POs, work orders
- Attach scope sheets and clarifications
- Compliance checks before release
- Commitment approval workflows
- Commitment change tracking

**Goal:** The system uses awarded estimate line items and bid leveling results to issue commitments fast. **20 days becomes 2.**

---

### Module 13: Submittals and Procurement Tracking

**Functions:**
- Required submittal register
- Shop drawing tracking
- Material approvals
- Long-lead item tracking
- Procurement log
- Responsible party assignments
- Due date reminders / Approval workflows

**Goal:** Tie awarded scopes directly to their execution requirements.

---

### Module 14: Project Management / Field Operations

**Functions:**
- Daily reports
- RFIs
- Submittals
- Meeting minutes
- Schedule milestones
- Site photos
- Issues and observations
- Safety incidents
- Punch lists
- Change events / Change orders
- Correspondence logs

**Goal:** The field and office operate from the same job record tied back to budget and commitments.

---

### Module 15: Accounts Payable

**Functions:**
- Vendor invoices / Sub pay applications
- Invoice coding
- 3-way match against commitment and budget
- Retainage
- Conditional and unconditional lien waivers
- Payment approval workflows
- Check / ACH processing
- Cost posting to job

**Goal:** Job costs land in the same system without external accounting software.

---

### Module 16: Accounts Receivable and Owner Billing

**Functions:**
- Owner billing / Schedule of values
- Stored materials / Progress billing
- AIA billing formats
- Change order billing
- AR aging / Cash receipt application

**Goal:** Tie owner billing directly to contract, budget, cost, and progress.

---

### Module 17: Job Cost Accounting and General Ledger

**Functions:**
- Chart of accounts / General ledger
- Journal entries / Job cost ledger
- Intercompany accounting
- Cash management / Bank reconciliation
- Period close / Audit trail
- Financial statements

**Goal:** Full back-office accounting in the same platform.

---

### Module 18: Payroll and Labor Costing

**Functions:**
- Employee records / Timecards
- Job time allocation
- Burden calculations
- Union / certified payroll handling
- Labor cost posting

**Goal:** Push labor cost directly into the project cost engine.

---

### Module 19: Compliance and Risk

**Functions:**
- Insurance expiration tracking
- License verification
- Contract compliance
- Safety documentation
- Lien waiver collection
- Bond tracking / Notice requirements
- Vendor qualification rules

**Goal:** No commitment or payment should move without compliance clearance.

---

### Module 20: Reporting and Executive Dashboards

**Functions:**
- Bid hit rate / Estimator performance
- Win/loss analysis
- Budget versus actual
- Forecasted margin fade/gain
- Buyout status
- AP exposure / AR collections
- Change order pipeline
- Sub/vendor performance
- Executive portfolio dashboards

**Goal:** Leadership sees the whole company in one place.

---

### Module 21: Closeout and Warranty

**Functions:**
- Punch lists / O&M manuals
- As-built tracking / Final inspections
- Final lien waivers / Final cost report
- Warranty log / Service tickets

**Goal:** The project is finished in the same system it started in.

---

## The Four Engines

The entire platform is really four giant engines under one roof:

### 1. Preconstruction Engine
- CRM + Plan room
- Takeoff + Estimating
- Scope sheets + Bid invitations
- Bid leveling + Proposal

### 2. Project Operations Engine
- Budget + Buyout + Commitments
- RFIs + Submittals + Daily logs
- Change management + Closeout

### 3. Financial Engine
- AP + AR + Job cost
- Forecasting + GL
- Compliance payments

### 4. Intelligence Engine
- Dashboards + Risk flags
- Margin analysis + Vendor performance
- Estimate-to-actual learning loop

---

## Key Data Backbone

Every module must be tied by a common backbone:

- **Project** — the universal container
- **Cost Code** — the financial DNA
- **Scope Package** — the work definition
- **Company/Contact** — the parties
- **Commitment** — the promise
- **Budget Line** — the target
- **Document** — the evidence
- **Workflow Event** — the audit trail

### Master Data
Companies, Contacts, Users, Roles, Trades, Cost Codes, Divisions, Templates, Documents

### Opportunity & Estimating
Opportunities, Bid Packages, Scope Packages, Drawings, Takeoff Quantities, Estimates, Bid Submissions, Bid Leveling Sheets, Proposals

### Project & Operations
Projects, Budgets, Commitments, Subcontracts, Purchase Orders, RFIs, Submittals, Change Events, Change Orders, Daily Logs, Punch Lists

### Financial
AP Invoices, Owner Billings, Cost Transactions, Forecasts, GL Entries, Payments, Retainage, Waivers

### Closeout
Final Documents, Warranty Records, Service Issues

---

## What Makes This System Better

1. **No duplicate entry** — Takeoff feeds estimate → feeds bid leveling → feeds award → feeds budget → feeds buyout → feeds commitments → feeds cost control
2. **Scope intelligence is native** — One of the biggest missing pieces in the market
3. **Bid leveling is a first-class function** — Not a spreadsheet outside the system
4. **Estimate becomes budget automatically** — Massive operational leverage
5. **Subs and vendors live inside the same operational database** — No fragmented outreach
6. **Finance is tied directly to operations** — Not bolted on later

---

## Build Order (Phased Approach)

### Stage 1 — Preconstruction (Sell First)
- Opportunity management
- Document intake
- Estimating
- Scope sheets
- ITB
- Bid receipt
- Bid leveling
- Proposal

### Stage 2 — Project Setup
- Award conversion
- Budgeting
- Buyout
- Commitments
- Submittals
- Procurement tracking

### Stage 3 — Execution & Finance
- Project execution
- Change orders
- Cost forecasting
- AP / pay apps
- Owner billing

### Stage 4 — Full Platform
- Full GL
- Payroll
- Advanced reporting
- Warranty / service

The first commercial value lives in **preconstruction and transition into buyout**.

---

## Architecture Flow

```
BUSINESS DEVELOPMENT
  Leads → Opportunities → Contacts → Bid Pipeline
        ↓
PLAN ROOM / DOCUMENT CONTROL
  Drawings → Specs → Addenda → Versioning
        ↓
PRECONSTRUCTION
  Takeoff → Estimating → Scope Sheets → ITB → Bid Receipt → Bid Leveling → Proposal
        ↓
AWARD / CONVERSION
  Contract Setup → Estimate to Budget → Project Creation
        ↓
BUYOUT
  Commitments → Subcontracts → POs → Procurement → Submittals
        ↓
PROJECT EXECUTION
  RFIs → Daily Reports → Change Orders → Meetings → Punch Lists
        ↓
FINANCIALS
  AP → AR → Job Cost → Forecasting → GL → Compliance
        ↓
CLOSEOUT / WARRANTY
  O&Ms → Final Billing → Final Cost Report → Warranty Tracking
```

---

## The Crown Jewels

If built correctly, the competitive advantages that matter most:

1. **Native takeoff-to-estimate linkage**
2. **Scope sheet engine**
3. **Bid leveling engine**
4. **Estimate-to-budget conversion**
5. **Buyout automation**
6. **Unified job cost and commitments**

That's where the operational magic is.

---

## Automation Opportunities Summary

### Immediate Impact (Can Build Now)
| Opportunity | Current Pain | Automation | Savings |
|---|---|---|---|
| Bid Leveling | Manual spreadsheets, missed scope gaps | AI-powered scope normalization and comparison | Prevents 2-5% cost overruns per job |
| Scope Sheet Generation | Manual Word docs, inconsistent templates | Template-driven, auto-populated from estimate | 20+ hours per bid package |
| Estimate → Budget | Re-enter estimate data into budget system | One-click conversion with cost code mapping | 40+ hours per project |
| Buyout Automation | Manual subcontract/PO creation | Auto-generate from leveled bids + scope sheets | 2-4 weeks → 2 days |
| Sub Compliance Tracking | Spreadsheets, expired certificates | Automated alerts, block payments on lapse | Risk elimination |
| Document Version Control | Email attachments, lost addenda | Central plan room with version tracking | Eliminates bid errors |

### Medium-Term Impact
| Opportunity | Current Pain | Automation | Savings |
|---|---|---|---|
| Change Order Detection | Surprises during execution | Scope gap flagging during bid leveling | 3-8% of project cost |
| Cost Forecasting | Monthly manual spreadsheets | Real-time committed + actual + forecast | Better margin control |
| Payment Automation | Manual invoice matching | 3-way match (commitment → invoice → budget) | 15+ hours/month |
| Risk Scoring | Gut feel on sub selection | Data-driven sub performance + bid history | Better awards |

### Long-Term Platform Value
| Opportunity | Description |
|---|---|
| Estimate-to-Actual Learning Loop | Compare estimated costs to actual outcomes to improve future bids |
| Predictive Margin Analysis | Flag jobs trending toward margin fade before it happens |
| Sub Performance Intelligence | Track which subs deliver on time, on budget, with clean closeout |
| Portfolio Dashboard | Real-time visibility across all active jobs for leadership |
