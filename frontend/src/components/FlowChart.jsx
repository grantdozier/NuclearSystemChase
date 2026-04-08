/**
 * Professional flowchart components for automation opportunity detail views.
 * Clean SVG icons, no emojis, enterprise styling.
 */

/* ─── SVG Icon Library ─────────────────────────────────────────── */
const Icons = {
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  database: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>
    </svg>
  ),
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  folder: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
    </svg>
  ),
  zap: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  clipboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  file: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  target: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  award: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
  scale: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/><polyline points="1 12 5 8 9 12"/><polyline points="15 12 19 8 23 12"/><line x1="1" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="23" y2="12"/>
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  scissors: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  mic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  cpu: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  compass: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  grid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  trendUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  minus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  x: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  building: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/>
    </svg>
  ),
  pen: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="3" x2="21" y2="7"/><path d="M3 17l4 4L21 7l-4-4L3 17z"/><line x1="15" y1="5" x2="19" y2="9"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  archive: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  ),
  thermometer: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
    </svg>
  ),
};

/* ─── Flow Node ────────────────────────────────────────────────── */
function FlowNode({ label, sub, type = 'process', color, icon }) {
  const typeClass = `flow-node flow-node-${type}`;
  const style = color ? { '--node-accent': color } : {};
  return (
    <div className={typeClass} style={style}>
      {icon && <div className="flow-node-icon">{Icons[icon] || null}</div>}
      <div className="flow-node-label">{label}</div>
      {sub && <div className="flow-node-sub">{sub}</div>}
    </div>
  );
}

function FlowArrow({ label }) {
  return (
    <div className="flow-arrow">
      <div className="flow-arrow-line" />
      <div className="flow-arrow-head" />
      {label && <div className="flow-arrow-label">{label}</div>}
    </div>
  );
}

function FlowDecision({ label }) {
  return (
    <div className="flow-decision">
      <div className="flow-decision-diamond">
        <div className="flow-decision-label">{label}</div>
      </div>
    </div>
  );
}

/* ─── Layout Components ────────────────────────────────────────── */

export function FlowVertical({ children }) {
  return <div className="flow-vertical">{children}</div>;
}

export function FlowHorizontal({ children }) {
  return <div className="flow-horizontal">{children}</div>;
}

export function FlowBranch({ children }) {
  return (
    <div className="flow-branch">
      <div className="flow-branch-connector" />
      <div className="flow-branch-paths">{children}</div>
    </div>
  );
}

export function FlowPath({ children, label, color }) {
  return (
    <div className="flow-path" style={color ? { '--path-color': color } : {}}>
      {label && <div className="flow-path-label">{label}</div>}
      <div className="flow-path-content">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PRE-BUILT FLOWS — one per opportunity, clean professional style
   ═══════════════════════════════════════════════════════════════════ */

export function StaleAlertingFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="Daily Scheduled Scan" sub="Automated background job" icon="clock" color="#6366f1" />
        <FlowArrow label="Query all projects" />
        <FlowNode type="data" label="SharePoint API" sub="Read last-modified timestamps" icon="database" color="#3b82f6" />
        <FlowArrow label="Evaluate activity thresholds" />
        <FlowDecision label="Days Since Last Activity?" />
        <FlowBranch>
          <FlowPath label="Under 30 days" color="#22c55e">
            <FlowNode type="status" label="Healthy" sub="No action needed" icon="check" color="#22c55e" />
          </FlowPath>
          <FlowPath label="30 - 90 days" color="#f59e0b">
            <FlowNode type="alert" label="Aging Warning" sub="Flagged on dashboard" icon="alert" color="#f59e0b" />
            <FlowArrow />
            <FlowNode type="action" label="PM Notification" sub="Added to weekly digest" icon="clipboard" color="#f59e0b" />
          </FlowPath>
          <FlowPath label="Over 90 days" color="#ef4444">
            <FlowNode type="alert" label="Stale — Critical" sub="Escalation triggered" icon="alert" color="#ef4444" />
            <FlowArrow />
            <FlowNode type="action" label="Email PM + Manager" sub="48-hour response required" icon="mail" color="#ef4444" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow label="Aggregate results" />
        <FlowNode type="output" label="Pipeline Health Dashboard" sub="Real-time portfolio health scores" icon="chart" color="#6366f1" />
      </FlowVertical>
    </div>
  );
}

export function FolderEnforcerFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="Project Status Change" sub="Lead / Estimating / Active / Closeout" icon="refresh" color="#6366f1" />
        <FlowArrow label="Determine required template" />
        <FlowDecision label="Current Phase?" />
        <FlowBranch>
          <FlowPath label="Lead" color="#8b5cf6">
            <FlowNode type="process" label="Lead Template" sub="Site Photos, Plans & Specs, Proposals" icon="folder" color="#8b5cf6" />
          </FlowPath>
          <FlowPath label="Estimating" color="#f59e0b">
            <FlowNode type="process" label="Estimating Template" sub="+ Subs, Excel Sheets, Bid Mgmt" icon="folder" color="#f59e0b" />
          </FlowPath>
          <FlowPath label="Active" color="#3b82f6">
            <FlowNode type="process" label="Active Template" sub="+ Permits, RFIs, Job Costs, Schedules" icon="folder" color="#3b82f6" />
          </FlowPath>
          <FlowPath label="Closeout" color="#22c55e">
            <FlowNode type="process" label="Closeout Template" sub="+ Warranty, As-Builts, Lien Waivers" icon="folder" color="#22c55e" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow label="Provision via Graph API" />
        <FlowNode type="process" label="Create Missing Folders" sub="Automated directory provisioning" icon="zap" color="#3b82f6" />
        <FlowArrow label="Nightly compliance scan" />
        <FlowNode type="action" label="Deviation Report" sub="Flag non-standard names and missing folders" icon="clipboard" color="#f59e0b" />
        <FlowArrow />
        <FlowNode type="output" label="Protocols Dashboard" sub="Folder compliance percentage per project" icon="chart" color="#22c55e" />
      </FlowVertical>
    </div>
  );
}

export function EstimatingPipelineFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="data" label="Estimating Projects" sub="All projects in Estimating status" icon="folder" color="#f59e0b" />
        <FlowArrow label="Scan folder contents" />
        <FlowHorizontal>
          <FlowNode type="check" label="Plans & Specs" sub="Required to bid" icon="file" color="#3b82f6" />
          <FlowNode type="check" label="Proposals" sub="Bid readiness" icon="file" color="#3b82f6" />
          <FlowNode type="check" label="Sub Bids" sub="Trade coverage" icon="users" color="#3b82f6" />
          <FlowNode type="check" label="Deadline" sub="Days remaining" icon="calendar" color="#3b82f6" />
        </FlowHorizontal>
        <FlowArrow label="Calculate readiness" />
        <FlowNode type="process" label="Bid Readiness Score" sub="Weighted scoring: Plans 30 | Subs 25 | Proposals 25 | Activity 20" icon="target" color="#6366f1" />
        <FlowArrow />
        <FlowDecision label="Score Threshold?" />
        <FlowBranch>
          <FlowPath label="Ready (80+)" color="#22c55e">
            <FlowNode type="status" label="Ready to Submit" sub="Move to proposal review" icon="check" color="#22c55e" />
          </FlowPath>
          <FlowPath label="Gaps Found" color="#ef4444">
            <FlowNode type="alert" label="Missing Coverage" sub="Identify uncovered trades" icon="alert" color="#ef4444" />
            <FlowArrow />
            <FlowNode type="action" label="Send ITB Requests" sub="Automated outreach to subs" icon="send" color="#f59e0b" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow />
        <FlowNode type="output" label="Estimating Pipeline Dashboard" sub="Calendar view, coverage matrix, deadline countdown" icon="chart" color="#6366f1" />
      </FlowVertical>
    </div>
  );
}

export function CSIDivisionFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="data" label="Active Project Subcontractors" sub="All CSI division folders" icon="database" color="#3b82f6" />
        <FlowArrow label="Parse each project" />
        <FlowNode type="process" label="CSI Division Parser" sub="Divisions 01 through 46" icon="search" color="#6366f1" />
        <FlowArrow label="Count documents per division" />
        <FlowHorizontal>
          <FlowNode type="status" label="Documented" sub="Division has files" icon="check" color="#22c55e" />
          <FlowNode type="alert" label="Empty" sub="Potential scope gap" icon="alert" color="#f59e0b" />
          <FlowNode type="process" label="Not Applicable" sub="Excluded from project" icon="minus" color="#9ca3af" />
        </FlowHorizontal>
        <FlowArrow label="Cross-project aggregation" />
        <FlowNode type="process" label="Coverage Matrix" sub="Projects vs. Divisions heatmap" icon="grid" color="#6366f1" />
        <FlowArrow />
        <FlowDecision label="Critical Division Empty?" />
        <FlowBranch>
          <FlowPath label="Gap Detected" color="#ef4444">
            <FlowNode type="alert" label="Scope Gap Alert" sub="PM notified of missing trade" icon="alert" color="#ef4444" />
          </FlowPath>
          <FlowPath label="Coverage OK" color="#22c55e">
            <FlowNode type="status" label="All Critical Trades Covered" sub="No action needed" icon="check" color="#22c55e" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow />
        <FlowNode type="output" label="Division Intelligence Report" sub="Historical patterns and gap predictions" icon="trendUp" color="#8b5cf6" />
      </FlowVertical>
    </div>
  );
}

export function DocumentIntelligenceFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="data" label="All Project Files" sub="Names, sizes, types, modification dates" icon="database" color="#3b82f6" />
        <FlowArrow label="Classify and aggregate" />
        <FlowHorizontal>
          <FlowNode type="process" label="Type Analysis" sub="PDF, Image, Spreadsheet, CAD" icon="file" color="#6366f1" />
          <FlowNode type="process" label="Volume Benchmarks" sub="Avg files per phase" icon="chart" color="#6366f1" />
          <FlowNode type="process" label="Activity Patterns" sub="Creation frequency" icon="trendUp" color="#6366f1" />
        </FlowHorizontal>
        <FlowArrow label="Compare to benchmarks" />
        <FlowDecision label="Anomaly Detected?" />
        <FlowBranch>
          <FlowPath label="Under-documented" color="#ef4444">
            <FlowNode type="alert" label="Risk Flag" sub="Below benchmark for project type" icon="alert" color="#ef4444" />
          </FlowPath>
          <FlowPath label="Normal" color="#22c55e">
            <FlowNode type="status" label="On Track" sub="Matches expected volume" icon="check" color="#22c55e" />
          </FlowPath>
          <FlowPath label="Over-documented" color="#f59e0b">
            <FlowNode type="alert" label="Complexity Flag" sub="May indicate scope issues" icon="alert" color="#f59e0b" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow />
        <FlowNode type="output" label="Document Intelligence Dashboard" sub="Project health scores from documentation patterns" icon="chart" color="#8b5cf6" />
      </FlowVertical>
    </div>
  );
}

export function LeadConversionFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="New Lead Created" sub="Folder appears in SharePoint" icon="folder" color="#8b5cf6" />
        <FlowArrow label="Auto-score based on contents" />
        <FlowNode type="process" label="Lead Scoring Engine" sub="Plans +30 | Photos +15 | Owner Docs +20 | Files +15 | Activity +20" icon="target" color="#6366f1" />
        <FlowArrow label="Assign score 0 - 100" />
        <FlowDecision label="Lead Score?" />
        <FlowBranch>
          <FlowPath label="80 - 100 (Hot)" color="#ef4444">
            <FlowNode type="alert" label="Hot Lead" sub="Plans, photos, and owner docs present" icon="thermometer" color="#ef4444" />
            <FlowArrow />
            <FlowNode type="action" label="Priority Review" sub="Go/No-Go within 48 hours" icon="clipboard" color="#ef4444" />
          </FlowPath>
          <FlowPath label="40 - 79 (Warm)" color="#f59e0b">
            <FlowNode type="action" label="Warm Lead" sub="Partial documentation" icon="thermometer" color="#f59e0b" />
            <FlowArrow />
            <FlowNode type="action" label="Request Missing Info" sub="Automated checklist to BD" icon="mail" color="#f59e0b" />
          </FlowPath>
          <FlowPath label="0 - 39 (Cold)" color="#9ca3af">
            <FlowNode type="process" label="Cold Lead" sub="Minimal documentation" icon="thermometer" color="#9ca3af" />
            <FlowArrow />
            <FlowNode type="action" label="Age-Out Tracking" sub="Archive if idle 60+ days" icon="archive" color="#9ca3af" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow label="Decision logged" />
        <FlowNode type="output" label="Prioritized Lead Board" sub="Scored, sorted, with action items per lead" icon="chart" color="#6366f1" />
      </FlowVertical>
    </div>
  );
}

export function BidLevelingFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="Bid Package Created" sub="Select trade and project" icon="clipboard" color="#6366f1" />
        <FlowArrow label="Load scope template" />
        <FlowNode type="process" label="Scope Template" sub="Standard line items for this trade" icon="file" color="#3b82f6" />
        <FlowArrow label="Receive sub bids" />
        <FlowHorizontal>
          <FlowNode type="data" label="Bidder A" sub="$95,000" icon="users" color="#22c55e" />
          <FlowNode type="data" label="Bidder B" sub="$78,000" icon="users" color="#ef4444" />
          <FlowNode type="data" label="Bidder C" sub="$97,000" icon="users" color="#22c55e" />
        </FlowHorizontal>
        <FlowArrow label="Parse inclusions and exclusions" />
        <FlowNode type="process" label="Scope Normalization" sub="Add back excluded items at internal estimate rates" icon="scale" color="#f59e0b" />
        <FlowArrow label="True cost comparison" />
        <FlowHorizontal>
          <FlowNode type="status" label="A: $95,000" sub="All scope included" icon="check" color="#22c55e" />
          <FlowNode type="alert" label="B: $100,000" sub="$22k excluded scope added" icon="alert" color="#ef4444" />
          <FlowNode type="status" label="C: $97,000" sub="All scope included" icon="check" color="#22c55e" />
        </FlowHorizontal>
        <FlowArrow label="Rank by true cost + risk" />
        <FlowNode type="output" label="Award Recommendation" sub="Bidder A is true low — B had $22k in hidden exclusions" icon="award" color="#22c55e" />
      </FlowVertical>
    </div>
  );
}

export function ScopeSheetFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="Select Project + Trade" sub="e.g., FPK Johnston — 03 Concrete" icon="target" color="#6366f1" />
        <FlowArrow label="Load trade template" />
        <FlowNode type="process" label="Scope Template Library" sub="Standard inclusions, exclusions, responsibilities" icon="file" color="#3b82f6" />
        <FlowArrow label="Assign responsibilities" />
        <FlowHorizontal>
          <FlowNode type="check" label="GC Provides" sub="Temp facilities, layout, cleanup" icon="building" color="#3b82f6" />
          <FlowNode type="check" label="Sub Provides" sub="Labor, materials, equipment" icon="users" color="#f59e0b" />
          <FlowNode type="check" label="Owner Provides" sub="Survey, geotech, utilities" icon="building" color="#8b5cf6" />
        </FlowHorizontal>
        <FlowArrow label="Validate against estimate" />
        <FlowDecision label="Scope Gaps Between Trades?" />
        <FlowBranch>
          <FlowPath label="Gap Found" color="#ef4444">
            <FlowNode type="alert" label="Scope Gap Warning" sub="Item not assigned to any party" icon="alert" color="#ef4444" />
            <FlowArrow />
            <FlowNode type="action" label="Resolve Before ITB" sub="Estimator assigns responsibility" icon="edit" color="#f59e0b" />
          </FlowPath>
          <FlowPath label="Complete" color="#22c55e">
            <FlowNode type="status" label="All Items Assigned" sub="No gaps detected" icon="check" color="#22c55e" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow />
        <FlowNode type="output" label="Scope Sheet PDF" sub="Attached to ITB package, feeds bid leveling" icon="file" color="#6366f1" />
      </FlowVertical>
    </div>
  );
}

export function EstimateToBudgetFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="Project Awarded" sub="Contract signed, ready to execute" icon="award" color="#22c55e" />
        <FlowArrow label="Load completed estimate" />
        <FlowNode type="data" label="Completed Estimate" sub="Line items, quantities, unit costs, markups" icon="database" color="#3b82f6" />
        <FlowArrow label="One-click conversion" />
        <FlowHorizontal>
          <FlowNode type="process" label="Strip Markups" sub="Separate OH, profit, fee" icon="scissors" color="#f59e0b" />
          <FlowNode type="process" label="Map Cost Codes" sub="Estimate to budget codes" icon="link" color="#6366f1" />
          <FlowNode type="process" label="Import Awards" sub="Committed costs from bids" icon="download" color="#3b82f6" />
        </FlowHorizontal>
        <FlowArrow label="Assemble budget" />
        <FlowNode type="process" label="Project Budget" sub="Committed | Uncommitted | Contingency | Allowances" icon="clipboard" color="#6366f1" />
        <FlowArrow />
        <FlowDecision label="Budget Approved?" />
        <FlowBranch>
          <FlowPath label="Approved" color="#22c55e">
            <FlowNode type="status" label="Baseline Locked" sub="All changes tracked as variances" icon="lock" color="#22c55e" />
          </FlowPath>
          <FlowPath label="Adjustments" color="#f59e0b">
            <FlowNode type="action" label="PM Review" sub="Adjust allocations, add contingency" icon="edit" color="#f59e0b" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow />
        <FlowNode type="output" label="Live Job Cost Tracking" sub="Budget vs. actual, updated with every invoice" icon="trendUp" color="#6366f1" />
      </FlowVertical>
    </div>
  );
}

export function BuyoutFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="Budget Approved + Bids Awarded" sub="From bid leveling and budget conversion" icon="clipboard" color="#6366f1" />
        <FlowArrow label="For each awarded subcontractor" />
        <FlowHorizontal>
          <FlowNode type="data" label="Awarded Bid" sub="Price, scope, bidder" icon="file" color="#3b82f6" />
          <FlowNode type="data" label="Scope Sheet" sub="Inclusions, exclusions" icon="file" color="#3b82f6" />
          <FlowNode type="data" label="Contract Template" sub="Standard terms" icon="file" color="#3b82f6" />
        </FlowHorizontal>
        <FlowArrow label="Auto-generate" />
        <FlowNode type="process" label="Subcontract Generator" sub="Pre-fill: sub info, price, scope, schedule, insurance" icon="zap" color="#6366f1" />
        <FlowArrow label="Compliance gateway" />
        <FlowDecision label="Sub Compliant?" />
        <FlowBranch>
          <FlowPath label="Compliant" color="#22c55e">
            <FlowNode type="status" label="Insurance, W-9, License" sub="All documents current" icon="shield" color="#22c55e" />
            <FlowArrow />
            <FlowNode type="action" label="Route for Signature" sub="Digital approval workflow" icon="pen" color="#22c55e" />
          </FlowPath>
          <FlowPath label="Non-Compliant" color="#ef4444">
            <FlowNode type="alert" label="Compliance Hold" sub="Missing or expired documents" icon="x" color="#ef4444" />
            <FlowArrow />
            <FlowNode type="action" label="Auto-Request Docs" sub="Email sub with requirements" icon="mail" color="#ef4444" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow />
        <FlowNode type="output" label="Commitment Log" sub="All subcontracts and POs tracked against budget" icon="chart" color="#6366f1" />
      </FlowVertical>
    </div>
  );
}

export function RFITrackingFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="Question Arises on Site" sub="PM, superintendent, or subcontractor" icon="compass" color="#f59e0b" />
        <FlowArrow label="Submit RFI" />
        <FlowNode type="process" label="RFI Form" sub="Auto-numbered, drawing ref, responsible party, deadline" icon="file" color="#6366f1" />
        <FlowArrow label="Auto-route" />
        <FlowDecision label="Route To?" />
        <FlowBranch>
          <FlowPath label="Architect" color="#3b82f6">
            <FlowNode type="action" label="Design Review" sub="Drawing clarification" icon="compass" color="#3b82f6" />
          </FlowPath>
          <FlowPath label="Engineer" color="#8b5cf6">
            <FlowNode type="action" label="Technical Review" sub="Structural / MEP question" icon="settings" color="#8b5cf6" />
          </FlowPath>
          <FlowPath label="Owner" color="#f59e0b">
            <FlowNode type="action" label="Owner Decision" sub="Selection or approval" icon="building" color="#f59e0b" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow label="Track response" />
        <FlowDecision label="Response Received?" />
        <FlowBranch>
          <FlowPath label="On Time" color="#22c55e">
            <FlowNode type="status" label="RFI Closed" sub="Filed to SharePoint" icon="check" color="#22c55e" />
          </FlowPath>
          <FlowPath label="Overdue" color="#ef4444">
            <FlowNode type="alert" label="Escalation" sub="Auto-reminder at 3d, 1d, overdue" icon="alert" color="#ef4444" />
          </FlowPath>
        </FlowBranch>
        <FlowArrow label="If cost impact" />
        <FlowNode type="output" label="Change Order Linkage" sub="RFI tied to change event and budget variance" icon="link" color="#6366f1" />
      </FlowVertical>
    </div>
  );
}

export function MeetingMinutesFlow() {
  return (
    <div className="flow-container">
      <FlowVertical>
        <FlowNode type="trigger" label="Weekly Project Meeting" sub="On-site or virtual" icon="calendar" color="#6366f1" />
        <FlowArrow label="Record audio" />
        <FlowNode type="process" label="Audio Capture" sub="Phone or laptop — noise filtering" icon="mic" color="#3b82f6" />
        <FlowArrow label="Process with AI" />
        <FlowNode type="process" label="AI Transcription" sub="Speech-to-text with speaker ID" icon="cpu" color="#6366f1" />
        <FlowArrow label="Extract structured data" />
        <FlowHorizontal>
          <FlowNode type="check" label="Decisions Made" sub="Who decided what" icon="check" color="#22c55e" />
          <FlowNode type="check" label="Action Items" sub="Owner + deadline" icon="clipboard" color="#f59e0b" />
          <FlowNode type="check" label="RFI Triggers" sub="Questions needing RFI" icon="alert" color="#ef4444" />
        </FlowHorizontal>
        <FlowArrow label="Generate document" />
        <FlowNode type="process" label="Formatted Minutes" sub="Date, attendees, topics, decisions, action items" icon="file" color="#6366f1" />
        <FlowArrow />
        <FlowHorizontal>
          <FlowNode type="output" label="SharePoint Filing" sub="Auto-save to Meetings folder" icon="folder" color="#3b82f6" />
          <FlowNode type="output" label="Action Tracker" sub="Dashboard with overdue alerts" icon="chart" color="#f59e0b" />
          <FlowNode type="output" label="RFI Auto-Draft" sub="Create RFI from discussion" icon="file" color="#ef4444" />
        </FlowHorizontal>
      </FlowVertical>
    </div>
  );
}

/* ─── Flow Map ─────────────────────────────────────────────────── */
export const FLOW_MAP = {
  'stale-project-alerting': StaleAlertingFlow,
  'folder-structure-enforcer': FolderEnforcerFlow,
  'estimating-pipeline-tracker': EstimatingPipelineFlow,
  'sub-division-coverage': CSIDivisionFlow,
  'document-size-intelligence': DocumentIntelligenceFlow,
  'lead-conversion-pipeline': LeadConversionFlow,
  'bid-leveling': BidLevelingFlow,
  'scope-sheet-builder': ScopeSheetFlow,
  'estimate-to-budget': EstimateToBudgetFlow,
  'buyout-automation': BuyoutFlow,
  'rfi-tracking': RFITrackingFlow,
  'meeting-minutes-ai': MeetingMinutesFlow,
};
