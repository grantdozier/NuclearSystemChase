import { useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   SVG ICON SET
   ═══════════════════════════════════════════════════════════════════ */
const I = {
  layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  database: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  folder: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  target: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  chart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  alert: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>,
  dollarSign: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  clipboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  scale: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><polyline points="1 12 5 8 9 12"/><polyline points="15 12 19 8 23 12"/><line x1="1" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="23" y2="12"/></svg>,
  link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  arrowRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  trendUp: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  cpu: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  pen: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="3" x2="21" y2="7"/><path d="M3 17l4 4L21 7l-4-4L3 17z"/></svg>,
  award: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  compass: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
};

/* ═══════════════════════════════════════════════════════════════════
   REUSABLE CHART PRIMITIVES
   ═══════════════════════════════════════════════════════════════════ */

function SysNode({ label, sub, icon, color = '#6366f1', type = 'default' }) {
  return (
    <div className={`arch-node arch-node-${type}`} style={{ '--a-color': color }}>
      {icon && <div className="arch-node-icon">{I[icon]}</div>}
      <div className="arch-node-label">{label}</div>
      {sub && <div className="arch-node-sub">{sub}</div>}
    </div>
  );
}

function SysArrow({ label, direction = 'down' }) {
  return (
    <div className={`arch-arrow arch-arrow-${direction}`}>
      <div className="arch-arrow-line" />
      <div className="arch-arrow-head" />
      {label && <div className="arch-arrow-label">{label}</div>}
    </div>
  );
}

function SysDecision({ label }) {
  return (
    <div className="arch-decision">
      <div className="arch-decision-shape">
        <div className="arch-decision-text">{label}</div>
      </div>
    </div>
  );
}

function SysBranch({ children }) {
  return (
    <div className="arch-branch">
      <div className="arch-branch-bar" />
      <div className="arch-branch-paths">{children}</div>
    </div>
  );
}

function SysPath({ children, label, color }) {
  return (
    <div className="arch-path" style={color ? { '--p-color': color } : {}}>
      <div className="arch-path-stem" />
      {label && <div className="arch-path-label">{label}</div>}
      <div className="arch-path-body">{children}</div>
    </div>
  );
}

function SysRow({ children }) {
  return <div className="arch-row">{children}</div>;
}

function SysCol({ children }) {
  return <div className="arch-col">{children}</div>;
}

/* ═══════════════════════════════════════════════════════════════════
   MICRO-SYSTEM DEFINITIONS
   ═══════════════════════════════════════════════════════════════════ */

const MICRO_SYSTEMS = [
  {
    id: 'data-layer',
    title: 'Data Ingestion Layer',
    desc: 'SharePoint Graph API connection, folder scanning, file metadata extraction, and real-time sync.',
    color: '#3b82f6',
    icon: 'database',
    standalone: true,
    chart: () => (
      <SysCol>
        <SysNode label="SharePoint Graph API" sub="Microsoft 365 tenant connection" icon="database" color="#3b82f6" type="source" />
        <SysArrow label="REST / batch queries" />
        <SysRow>
          <SysNode label="Site Discovery" sub="Enumerate all sites and drives" icon="search" color="#3b82f6" />
          <SysNode label="Folder Walker" sub="Recursive directory traversal" icon="folder" color="#3b82f6" />
          <SysNode label="File Metadata" sub="Names, sizes, dates, types" icon="file" color="#3b82f6" />
        </SysRow>
        <SysArrow label="Normalize and cache" />
        <SysNode label="Project Data Store" sub="Structured project records with subfolder trees" icon="layers" color="#3b82f6" type="output" />
        <SysArrow label="Feeds all downstream systems" />
        <SysRow>
          <SysNode label="Status Engine" sub="" icon="refresh" color="#6366f1" type="consumer" />
          <SysNode label="Health Scoring" sub="" icon="chart" color="#22c55e" type="consumer" />
          <SysNode label="Alerting" sub="" icon="alert" color="#ef4444" type="consumer" />
          <SysNode label="Dashboards" sub="" icon="grid" color="#8b5cf6" type="consumer" />
        </SysRow>
      </SysCol>
    ),
  },
  {
    id: 'status-engine',
    title: 'Project Status Engine',
    desc: 'Automatic lifecycle phase and sub-status detection from folder location and content analysis.',
    color: '#6366f1',
    icon: 'refresh',
    standalone: true,
    chart: () => (
      <SysCol>
        <SysNode label="Project Record" sub="Folder location + contents" icon="folder" color="#6366f1" type="source" />
        <SysArrow label="Determine lifecycle phase" />
        <SysDecision label="Which top-level folder?" />
        <SysBranch>
          <SysPath label="Business Dev" color="#8b5cf6">
            <SysNode label="Lead" icon="target" color="#8b5cf6" />
            <SysArrow />
            <SysDecision label="Content?" />
            <SysBranch>
              <SysPath label="LOI present" color="#22c55e">
                <SysNode label="Warm Lead" icon="check" color="#22c55e" />
              </SysPath>
              <SysPath label="Empty" color="#9ca3af">
                <SysNode label="Abandoned" icon="alert" color="#9ca3af" />
              </SysPath>
            </SysBranch>
          </SysPath>
          <SysPath label="Estimating" color="#f59e0b">
            <SysNode label="Bidding" icon="scale" color="#f59e0b" />
            <SysArrow />
            <SysDecision label="Proposals?" />
            <SysBranch>
              <SysPath label="Has files" color="#22c55e">
                <SysNode label="Bid Submitted" icon="check" color="#22c55e" />
              </SysPath>
              <SysPath label="Empty" color="#ef4444">
                <SysNode label="In Progress" icon="clock" color="#f59e0b" />
              </SysPath>
            </SysBranch>
          </SysPath>
          <SysPath label="Projects" color="#3b82f6">
            <SysNode label="Active" icon="home" color="#3b82f6" />
            <SysArrow />
            <SysDecision label="Activity signals?" />
            <SysBranch>
              <SysPath label="Job costs + reports" color="#22c55e">
                <SysNode label="Construction" icon="check" color="#22c55e" />
              </SysPath>
              <SysPath label="90+ days idle" color="#ef4444">
                <SysNode label="Complete / Hold" icon="clock" color="#9ca3af" />
              </SysPath>
            </SysBranch>
          </SysPath>
        </SysBranch>
        <SysArrow label="Output" />
        <SysNode label="Computed Status" sub="Phase + sub-status + confidence" icon="check" color="#6366f1" type="output" />
      </SysCol>
    ),
  },
  {
    id: 'health-scoring',
    title: 'Project Health Scoring',
    desc: 'Content completeness analysis, recency scoring, and document gap detection for every project.',
    color: '#22c55e',
    icon: 'chart',
    standalone: true,
    chart: () => (
      <SysCol>
        <SysNode label="Active Project" sub="Subfolder tree with file counts" icon="folder" color="#22c55e" type="source" />
        <SysArrow label="Score three dimensions" />
        <SysRow>
          <SysCol>
            <SysNode label="Recency Score" sub="Last modified date" icon="clock" color="#f59e0b" />
            <SysArrow />
            <SysBranch>
              <SysPath label="< 7d" color="#22c55e"><SysNode label="Hot" color="#22c55e" /></SysPath>
              <SysPath label="8-30d" color="#f59e0b"><SysNode label="Warm" color="#f59e0b" /></SysPath>
              <SysPath label="31-90d" color="#ef4444"><SysNode label="Cool" color="#ef4444" /></SysPath>
              <SysPath label="90d+" color="#9ca3af"><SysNode label="Cold" color="#9ca3af" /></SysPath>
            </SysBranch>
          </SysCol>
          <SysCol>
            <SysNode label="Completeness" sub="Weighted folder check" icon="clipboard" color="#3b82f6" />
            <SysArrow />
            <SysRow>
              <SysNode label="Plans" sub="Required" color="#3b82f6" />
              <SysNode label="Permits" sub="Required" color="#3b82f6" />
              <SysNode label="Contracts" sub="Required" color="#3b82f6" />
              <SysNode label="Schedules" sub="High" color="#6366f1" />
            </SysRow>
          </SysCol>
          <SysCol>
            <SysNode label="Gap Detection" sub="Missing critical docs" icon="alert" color="#ef4444" />
            <SysArrow />
            <SysRow>
              <SysNode label="No costs" sub="Financial risk" color="#ef4444" />
              <SysNode label="No reports" sub="No client comms" color="#f59e0b" />
              <SysNode label="No schedule" sub="No timeline" color="#f59e0b" />
            </SysRow>
          </SysCol>
        </SysRow>
        <SysArrow label="Combine into composite" />
        <SysNode label="Health Score 0-100" sub="Feeds dashboards, alerts, and prioritization" icon="trendUp" color="#22c55e" type="output" />
      </SysCol>
    ),
  },
  {
    id: 'preconstruction',
    title: 'Preconstruction Pipeline',
    desc: 'Lead scoring, estimating readiness, bid leveling, scope sheet generation, and award tracking.',
    color: '#f59e0b',
    icon: 'target',
    standalone: true,
    chart: () => (
      <SysCol>
        <SysNode label="New Lead" sub="Folder appears in Business Dev" icon="target" color="#8b5cf6" type="source" />
        <SysArrow label="Auto-score" />
        <SysNode label="Lead Scoring Engine" sub="Plans +30 | Photos +15 | Owner docs +20 | Activity +20" icon="target" color="#8b5cf6" />
        <SysArrow label="Decision: Pursue?" />
        <SysDecision label="Go / No-Go" />
        <SysBranch>
          <SysPath label="Pursue" color="#22c55e">
            <SysNode label="Move to Estimating" sub="Create estimating folder structure" icon="folder" color="#f59e0b" />
            <SysArrow />
            <SysRow>
              <SysNode label="Scope Sheets" sub="Trade-by-trade templates" icon="clipboard" color="#f59e0b" />
              <SysNode label="ITB Packages" sub="Invitation to Bid" icon="mail" color="#f59e0b" />
            </SysRow>
            <SysArrow label="Collect bids" />
            <SysNode label="Bid Leveling" sub="Normalize exclusions, true cost comparison" icon="scale" color="#f59e0b" />
            <SysArrow label="Submit proposal" />
            <SysNode label="Proposal Submitted" sub="Track in Proposals/ folder" icon="file" color="#f59e0b" />
            <SysArrow />
            <SysDecision label="Awarded?" />
            <SysBranch>
              <SysPath label="Yes" color="#22c55e">
                <SysNode label="Estimate to Budget" sub="One-click conversion" icon="zap" color="#22c55e" type="output" />
              </SysPath>
              <SysPath label="No" color="#9ca3af">
                <SysNode label="Archive" sub="Historical data" icon="folder" color="#9ca3af" />
              </SysPath>
            </SysBranch>
          </SysPath>
          <SysPath label="Pass" color="#9ca3af">
            <SysNode label="Archive Lead" sub="Age-out tracking" icon="clock" color="#9ca3af" />
          </SysPath>
        </SysBranch>
      </SysCol>
    ),
  },
  {
    id: 'execution',
    title: 'Execution & Project Controls',
    desc: 'Budget tracking, buyout automation, RFI management, change orders, and field operations.',
    color: '#3b82f6',
    icon: 'home',
    standalone: true,
    chart: () => (
      <SysCol>
        <SysNode label="Project Awarded" sub="Budget created from estimate" icon="award" color="#22c55e" type="source" />
        <SysArrow label="Parallel workstreams" />
        <SysRow>
          <SysCol>
            <SysNode label="Buyout" sub="Subcontract generation" icon="users" color="#3b82f6" />
            <SysArrow />
            <SysNode label="Compliance Gate" sub="Insurance, W-9, License" icon="shield" color="#3b82f6" />
            <SysArrow />
            <SysNode label="Commitment Log" sub="All POs and contracts" icon="clipboard" color="#3b82f6" />
          </SysCol>
          <SysCol>
            <SysNode label="RFI Tracking" sub="Auto-numbered, routed" icon="compass" color="#f59e0b" />
            <SysArrow />
            <SysNode label="Response Tracking" sub="Escalation at 3d, 1d" icon="clock" color="#f59e0b" />
            <SysArrow />
            <SysNode label="Change Events" sub="RFI to CO linkage" icon="link" color="#f59e0b" />
          </SysCol>
          <SysCol>
            <SysNode label="Job Cost Tracking" sub="Budget vs. actual" icon="dollarSign" color="#22c55e" />
            <SysArrow />
            <SysNode label="Invoice Processing" sub="Pay apps, lien waivers" icon="file" color="#22c55e" />
            <SysArrow />
            <SysNode label="Cost Reports" sub="PM and owner reporting" icon="chart" color="#22c55e" />
          </SysCol>
        </SysRow>
        <SysArrow label="Feeds" />
        <SysNode label="Project Controls Dashboard" sub="Real-time budget, schedule, RFI, and field status" icon="grid" color="#3b82f6" type="output" />
      </SysCol>
    ),
  },
  {
    id: 'document-intel',
    title: 'Document Intelligence',
    desc: 'File classification, volume benchmarking, anomaly detection, and CSI division coverage analysis.',
    color: '#8b5cf6',
    icon: 'search',
    standalone: true,
    chart: () => (
      <SysCol>
        <SysNode label="File Metadata Store" sub="All project files with types, sizes, dates" icon="database" color="#8b5cf6" type="source" />
        <SysArrow label="Classify and analyze" />
        <SysRow>
          <SysNode label="Type Analysis" sub="PDF, Image, XLS, CAD, MPP" icon="file" color="#8b5cf6" />
          <SysNode label="Volume Benchmarks" sub="Expected vs. actual per phase" icon="chart" color="#8b5cf6" />
          <SysNode label="CSI Mapper" sub="Trade coverage by division" icon="grid" color="#8b5cf6" />
        </SysRow>
        <SysArrow label="Compare across portfolio" />
        <SysDecision label="Anomaly?" />
        <SysBranch>
          <SysPath label="Under-documented" color="#ef4444">
            <SysNode label="Risk Alert" sub="Below benchmark" icon="alert" color="#ef4444" />
          </SysPath>
          <SysPath label="Normal" color="#22c55e">
            <SysNode label="On Track" sub="Matches expected" icon="check" color="#22c55e" />
          </SysPath>
          <SysPath label="Over-documented" color="#f59e0b">
            <SysNode label="Complexity Flag" sub="Possible scope creep" icon="alert" color="#f59e0b" />
          </SysPath>
        </SysBranch>
        <SysArrow />
        <SysNode label="Document Intelligence Dashboard" sub="Portfolio-wide patterns and project-level insights" icon="trendUp" color="#8b5cf6" type="output" />
      </SysCol>
    ),
  },
  {
    id: 'alerting',
    title: 'Alerting & Notifications',
    desc: 'Stale project detection, deadline tracking, compliance expiration, and escalation workflows.',
    color: '#ef4444',
    icon: 'alert',
    standalone: true,
    chart: () => (
      <SysCol>
        <SysRow>
          <SysNode label="Scheduled Scans" sub="Daily at 6 AM" icon="clock" color="#6366f1" type="source" />
          <SysNode label="Event Triggers" sub="Status changes, deadlines" icon="zap" color="#6366f1" type="source" />
        </SysRow>
        <SysArrow label="Evaluate alert rules" />
        <SysRow>
          <SysNode label="Stale Detection" sub="90+ days no activity" icon="clock" color="#ef4444" />
          <SysNode label="Compliance Expiry" sub="Insurance, license dates" icon="shield" color="#ef4444" />
          <SysNode label="Deadline Watch" sub="Bid due dates" icon="alert" color="#f59e0b" />
          <SysNode label="Gap Alerts" sub="Missing critical folders" icon="folder" color="#f59e0b" />
        </SysRow>
        <SysArrow label="Route by severity" />
        <SysDecision label="Severity?" />
        <SysBranch>
          <SysPath label="Critical" color="#ef4444">
            <SysNode label="Email + Dashboard" sub="48hr response required" icon="mail" color="#ef4444" />
          </SysPath>
          <SysPath label="Warning" color="#f59e0b">
            <SysNode label="Dashboard Flag" sub="Weekly digest" icon="chart" color="#f59e0b" />
          </SysPath>
          <SysPath label="Info" color="#3b82f6">
            <SysNode label="Log Only" sub="Audit trail" icon="clipboard" color="#3b82f6" />
          </SysPath>
        </SysBranch>
        <SysArrow />
        <SysNode label="Alert History + Audit Log" sub="Complete notification trail" icon="clipboard" color="#ef4444" type="output" />
      </SysCol>
    ),
  },
  {
    id: 'folder-mgmt',
    title: 'Folder Structure Management',
    desc: 'Template enforcement, auto-provisioning, naming compliance, and deviation reporting.',
    color: '#059669',
    icon: 'folder',
    standalone: true,
    chart: () => (
      <SysCol>
        <SysNode label="Project Template" sub="00-XXX master structure" icon="folder" color="#059669" type="source" />
        <SysArrow label="Phase-specific templates" />
        <SysRow>
          <SysNode label="Lead" sub="Photos, Plans, Proposals" icon="folder" color="#8b5cf6" />
          <SysNode label="Estimating" sub="+ Subs, Bid Mgmt, Sheets" icon="folder" color="#f59e0b" />
          <SysNode label="Active" sub="+ Permits, RFIs, Costs" icon="folder" color="#3b82f6" />
          <SysNode label="Closeout" sub="+ Warranty, As-Builts" icon="folder" color="#22c55e" />
        </SysRow>
        <SysArrow label="On status change" />
        <SysNode label="Graph API Provisioning" sub="Create missing folders automatically" icon="zap" color="#059669" />
        <SysArrow label="Nightly scan" />
        <SysNode label="Compliance Scanner" sub="Detect non-standard names, missing required folders" icon="search" color="#059669" />
        <SysArrow />
        <SysNode label="Deviation Report" sub="Per-project compliance % and action items" icon="clipboard" color="#059669" type="output" />
      </SysCol>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MASTER ARCHITECTURE DIAGRAM
   ═══════════════════════════════════════════════════════════════════ */

function MasterArchitecture() {
  return (
    <div className="arch-master">
      {/* Layer 1: Data Source */}
      <div className="arch-layer" data-layer="source">
        <div className="arch-layer-label">Data Source</div>
        <div className="arch-layer-content">
          <SysNode label="SharePoint / Graph API" sub="Chase Group Microsoft 365 tenant" icon="database" color="#3b82f6" type="source" />
        </div>
      </div>

      <div className="arch-layer-connector">
        <div className="arch-lc-line" />
        <div className="arch-lc-label">REST API / Delta Sync</div>
      </div>

      {/* Layer 2: Ingestion */}
      <div className="arch-layer" data-layer="ingestion">
        <div className="arch-layer-label">Ingestion & Normalization</div>
        <div className="arch-layer-content">
          <SysRow>
            <SysNode label="Site Discovery" sub="Enumerate drives" icon="search" color="#3b82f6" />
            <SysNode label="Folder Walker" sub="Recursive traversal" icon="folder" color="#3b82f6" />
            <SysNode label="File Metadata" sub="Sizes, types, dates" icon="file" color="#3b82f6" />
            <SysNode label="Link Resolver" sub="Cross-phase .lnk files" icon="link" color="#3b82f6" />
          </SysRow>
        </div>
      </div>

      <div className="arch-layer-connector">
        <div className="arch-lc-line" />
        <div className="arch-lc-label">Structured Project Records</div>
      </div>

      {/* Layer 3: Core Engines */}
      <div className="arch-layer arch-layer-wide" data-layer="engines">
        <div className="arch-layer-label">Core Processing Engines</div>
        <div className="arch-layer-content">
          <SysRow>
            <SysNode label="Status Engine" sub="Lifecycle phase + sub-status" icon="refresh" color="#6366f1" />
            <SysNode label="Health Scoring" sub="Recency + completeness + gaps" icon="chart" color="#22c55e" />
            <SysNode label="Document Intelligence" sub="Classification + benchmarks" icon="search" color="#8b5cf6" />
            <SysNode label="Folder Enforcer" sub="Template compliance" icon="folder" color="#059669" />
          </SysRow>
        </div>
      </div>

      <div className="arch-layer-connector">
        <div className="arch-lc-line" />
        <div className="arch-lc-label">Enriched Project Data</div>
      </div>

      {/* Layer 4: Business Logic */}
      <div className="arch-layer arch-layer-wide" data-layer="business">
        <div className="arch-layer-label">Business Logic Layer</div>
        <div className="arch-layer-content">
          <SysRow>
            <SysNode label="Lead Scoring" sub="Priority queue" icon="target" color="#8b5cf6" />
            <SysNode label="Estimating Pipeline" sub="Bid readiness + coverage" icon="scale" color="#f59e0b" />
            <SysNode label="Bid Leveling" sub="Scope normalization" icon="scale" color="#f59e0b" />
            <SysNode label="Budget Conversion" sub="Estimate to budget" icon="dollarSign" color="#22c55e" />
            <SysNode label="Buyout Automation" sub="Contract generation" icon="pen" color="#3b82f6" />
          </SysRow>
        </div>
      </div>

      <div className="arch-layer-connector">
        <div className="arch-lc-line" />
      </div>

      {/* Layer 5: Execution */}
      <div className="arch-layer" data-layer="execution">
        <div className="arch-layer-label">Execution & Controls</div>
        <div className="arch-layer-content">
          <SysRow>
            <SysNode label="RFI Tracking" sub="Auto-numbered, routed" icon="compass" color="#f59e0b" />
            <SysNode label="Change Orders" sub="RFI to CO linkage" icon="link" color="#f59e0b" />
            <SysNode label="Job Cost Tracking" sub="Budget vs. actual" icon="dollarSign" color="#22c55e" />
            <SysNode label="Field Ops" sub="Photo correlation" icon="home" color="#3b82f6" />
          </SysRow>
        </div>
      </div>

      <div className="arch-layer-connector">
        <div className="arch-lc-line" />
      </div>

      {/* Layer 6: Alerting + Output */}
      <div className="arch-layer" data-layer="output">
        <div className="arch-layer-label">Alerting & Presentation</div>
        <div className="arch-layer-content">
          <SysRow>
            <SysNode label="Stale Alerts" sub="Activity monitoring" icon="alert" color="#ef4444" />
            <SysNode label="Compliance Alerts" sub="Expiration tracking" icon="shield" color="#ef4444" />
            <SysNode label="Operations Dashboard" sub="Portfolio overview" icon="grid" color="#6366f1" type="output" />
            <SysNode label="Project Detail" sub="Individual project view" icon="home" color="#6366f1" type="output" />
            <SysNode label="Reports" sub="Scheduled + on-demand" icon="chart" color="#6366f1" type="output" />
          </SysRow>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MICRO-SYSTEM CARD + EXPANDED VIEW
   ═══════════════════════════════════════════════════════════════════ */

function MicroSystemCard({ system, isActive, onToggle }) {
  return (
    <div className={`arch-micro-card ${isActive ? 'arch-micro-card-active' : ''}`} style={{ '--mc-color': system.color }}>
      <button className="arch-micro-header" onClick={onToggle} type="button">
        <div className="arch-micro-icon">{I[system.icon]}</div>
        <div className="arch-micro-info">
          <div className="arch-micro-title">{system.title}</div>
          <div className="arch-micro-desc">{system.desc}</div>
        </div>
        <div className="arch-micro-badge">Standalone Module</div>
        <svg className="arch-micro-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {isActive && (
        <div className="arch-micro-body">
          <div className="arch-micro-chart">
            {system.chart()}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function AutomationArchitecture() {
  const [expandedSystem, setExpandedSystem] = useState(null);
  const [showMaster, setShowMaster] = useState(true);

  return (
    <div className="page arch-page">
      <div className="page-header">
        <h2>System Architecture</h2>
        <div className="page-header-subtitle">
          Full automation platform design with {MICRO_SYSTEMS.length} standalone subsystems
        </div>
      </div>

      {/* View Toggle */}
      <div className="arch-view-toggle">
        <button
          className={`arch-toggle-btn ${showMaster ? 'arch-toggle-active' : ''}`}
          onClick={() => setShowMaster(true)}
          type="button"
        >
          {I.layers}
          Full System
        </button>
        <button
          className={`arch-toggle-btn ${!showMaster ? 'arch-toggle-active' : ''}`}
          onClick={() => setShowMaster(false)}
          type="button"
        >
          {I.grid}
          Subsystems
        </button>
      </div>

      {showMaster ? (
        <>
          {/* Master Architecture */}
          <section className="arch-section">
            <div className="arch-section-header">
              <h3>End-to-End Platform Architecture</h3>
              <p>Six-layer system design from data source through presentation. Each layer can operate independently.</p>
            </div>
            <MasterArchitecture />
          </section>

          {/* Quick reference of all subsystems */}
          <section className="arch-section">
            <div className="arch-section-header">
              <h3>Subsystem Modules</h3>
              <p>Each block above maps to an independent module below. Click any module for its detailed flow diagram.</p>
            </div>
            <div className="arch-micro-grid">
              {MICRO_SYSTEMS.map(sys => (
                <button
                  key={sys.id}
                  className="arch-micro-pill"
                  style={{ '--mc-color': sys.color }}
                  onClick={() => { setShowMaster(false); setExpandedSystem(sys.id); }}
                  type="button"
                >
                  <div className="arch-micro-pill-icon">{I[sys.icon]}</div>
                  <span>{sys.title}</span>
                  {I.arrowRight}
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Micro-System Detail Views */
        <section className="arch-section">
          <div className="arch-section-header">
            <h3>Standalone Subsystem Modules</h3>
            <p>Each module can function independently within the Chase Group ecosystem. Expand any module to see its detailed process flow.</p>
          </div>
          <div className="arch-micro-list">
            {MICRO_SYSTEMS.map(sys => (
              <MicroSystemCard
                key={sys.id}
                system={sys}
                isActive={expandedSystem === sys.id}
                onToggle={() => setExpandedSystem(expandedSystem === sys.id ? null : sys.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
