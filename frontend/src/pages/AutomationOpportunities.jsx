import { useState, useEffect } from 'react';
import { dataService } from '../services/api';
import OpportunityDetail from '../components/OpportunityDetail';

/* ═══════════════════════════════════════════════════════════════════
   LIVE DATA ANALYSIS
   ═══════════════════════════════════════════════════════════════════ */

function findFolder(sf, name) {
  if (!sf) return null;
  if (sf[name]) return sf[name];
  const key = Object.keys(sf).find(k => k.toLowerCase().includes(name.toLowerCase()));
  return key ? sf[key] : null;
}
function hasContent(folder) { return folder && ((folder.itemCount ?? folder.fileCount ?? 0) > 0); }
function itemCount(folder) { return folder ? (folder.itemCount ?? folder.fileCount ?? 0) : 0; }

function analyzeOpportunities(projects) {
  const active = projects.filter(p => p.status === 'Active');
  const estimating = projects.filter(p => p.status === 'Estimating');
  const leads = projects.filter(p => p.status === 'Lead');
  const punchList = projects.filter(p => p.status === 'Punch List');
  const complete = projects.filter(p => p.status === 'Complete');
  const onHold = projects.filter(p => p.status === 'On Hold');
  const total = projects.length;

  let missingPermits = 0, missingSchedules = 0, missingProgressReports = 0;
  let missingOwnerDocs = 0, missingSubs = 0, missingEstimating = 0;
  let missingRFIs = 0, missingPlans = 0, missingJobCosts = 0;
  let totalSubDivisions = 0, emptySubDivisions = 0;
  let projectsWithNoRecentFiles = 0, totalRecentFiles = 0;
  let totalFileCount = 0, totalSizeBytes = 0;
  const inconsistentFolderNames = [];
  const projectsWithoutProposals = [];
  const estimatingWithoutSubBids = [];
  const activeWithoutMeetings = [];

  for (const p of projects) {
    const sf = p.subfolders || {};
    totalFileCount += p.fileCount || 0;
    totalSizeBytes += p.totalSizeBytes || 0;

    if (!hasContent(findFolder(sf, 'Permits'))) missingPermits++;
    if (!hasContent(findFolder(sf, 'Project Schedules')) && !hasContent(findFolder(sf, 'Schedule'))) missingSchedules++;
    if (!hasContent(findFolder(sf, 'Project Progress Report'))) missingProgressReports++;
    if (!hasContent(findFolder(sf, 'Owner Documents'))) missingOwnerDocs++;
    if (!hasContent(findFolder(sf, 'RFI'))) missingRFIs++;
    if (!hasContent(findFolder(sf, 'Plans'))) missingPlans++;
    if (!hasContent(findFolder(sf, 'Job Costs'))) missingJobCosts++;
    if (!hasContent(findFolder(sf, 'Estimating'))) missingEstimating++;

    const subs = findFolder(sf, 'Subcontractors');
    if (subs && subs.children) {
      const children = Object.values(subs.children);
      totalSubDivisions += children.length;
      emptySubDivisions += children.filter(c => itemCount(c) === 0).length;
    }
    if (!subs || !hasContent(subs)) missingSubs++;

    if (p.status === 'Estimating') {
      const proposals = findFolder(sf, 'Proposals');
      if (!hasContent(proposals)) projectsWithoutProposals.push(p);
      const subBids = findFolder(sf, 'Subcontractors');
      if (!hasContent(subBids)) estimatingWithoutSubBids.push(p);
    }

    if (p.status === 'Active') {
      const meetings = findFolder(sf, 'Meetings');
      if (!hasContent(meetings)) activeWithoutMeetings.push(p);
    }

    // Detect inconsistent naming
    const sfKeys = Object.keys(sf);
    if (sfKeys.some(k => k.includes('New folder') || k.includes('Temp') || /^\d/.test(k))) {
      inconsistentFolderNames.push({ project: p.name, folders: sfKeys.filter(k => k.includes('New folder') || k.includes('Temp') || /^\d/.test(k)) });
    }

    const recentFiles = p.recentFiles || [];
    totalRecentFiles += recentFiles.length;
    if (recentFiles.length === 0) projectsWithNoRecentFiles++;
  }

  const now = Date.now();
  const daysSince = (d) => Math.floor((now - new Date(d).getTime()) / (1000 * 60 * 60 * 24));
  const staleProjects = active.filter(p => daysSince(p.lastModified) > 90);
  const agingProjects = active.filter(p => { const d = daysSince(p.lastModified); return d > 30 && d <= 90; });
  const staleLeads = leads.filter(p => daysSince(p.lastModified) > 60);

  return {
    summary: { total, active: active.length, estimating: estimating.length, leads: leads.length, punchList: punchList.length, complete: complete.length, onHold: onHold.length },
    gaps: { missingPermits, missingSchedules, missingProgressReports, missingOwnerDocs, missingSubs, missingEstimating, missingRFIs, missingPlans, missingJobCosts },
    subAnalysis: { totalSubDivisions, emptySubDivisions, filledPct: totalSubDivisions > 0 ? Math.round(((totalSubDivisions - emptySubDivisions) / totalSubDivisions) * 100) : 0 },
    activity: { projectsWithNoRecentFiles, totalRecentFiles, staleCount: staleProjects.length, agingCount: agingProjects.length, staleProjects, agingProjects, staleLeads },
    estimatingInsights: { projectsWithoutProposals, estimatingWithoutSubBids },
    activeInsights: { activeWithoutMeetings },
    fileStats: { totalFileCount, totalSizeBytes },
    naming: { inconsistentFolderNames },
    projects, active, estimating, leads, punchList, complete, onHold,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   OPPORTUNITY DEFINITIONS — Each has full detail breakdown
   ═══════════════════════════════════════════════════════════════════ */

function buildOpportunities(data) {
  if (!data) return [];
  const d = data;
  return [
    // ── ORIGINAL: Derived from actual Chase Group data ──────────────
    {
      id: 'stale-project-alerting',
      title: 'Stale Project & Lead Alerting System',
      category: 'Operations Intelligence',
      impact: 'high',
      effort: 'low',
      tagline: `${d.activity.staleCount} active projects and ${d.activity.staleLeads.length} leads have gone cold`,
      summary: 'Automatically detect projects and leads with no file activity, flag them for PM review, and prevent revenue leakage from forgotten opportunities.',
      problem: 'Chase Group currently has no automated way to detect when a project or lead goes cold. PMs must manually remember to check each project. Leads sit in the pipeline with no activity, and active jobs can stall without anyone noticing until it\'s too late.',
      problemBullets: [
        `${d.activity.staleCount} active projects have had zero file changes in 90+ days`,
        `${d.activity.agingCount} active projects are aging (30-90 days without updates)`,
        `${d.activity.staleLeads.length} leads have been idle for 60+ days with no follow-up evidence`,
        `${d.activity.projectsWithNoRecentFiles} projects across all statuses have no recent file activity at all`,
      ],
      metrics: [
        { label: 'Stale Active Jobs', value: d.activity.staleCount, color: '#ef4444' },
        { label: 'Aging Active Jobs', value: d.activity.agingCount, color: '#f59e0b' },
        { label: 'Cold Leads', value: d.activity.staleLeads.length, color: '#8b5cf6' },
        { label: 'Total at Risk', value: d.activity.staleCount + d.activity.agingCount + d.activity.staleLeads.length, color: '#dc2626' },
      ],
      evidence: (live) => (
        <div>
          {d.activity.staleProjects.length > 0 && (
            <div className="opp-evidence-group">
              <strong>Stale Active Projects (90+ days no activity):</strong>
              <ul>{d.activity.staleProjects.map(p => <li key={p.id}>{p.name} — last modified {new Date(p.lastModified).toLocaleDateString()}</li>)}</ul>
            </div>
          )}
          {d.activity.staleLeads.length > 0 && (
            <div className="opp-evidence-group">
              <strong>Cold Leads (60+ days no activity):</strong>
              <ul>{d.activity.staleLeads.map(p => <li key={p.id}>{p.name} — last modified {new Date(p.lastModified).toLocaleDateString()}</li>)}</ul>
            </div>
          )}
        </div>
      ),
      solution: 'Build a daily background scan that checks last-modified dates across all projects and leads. Generate alerts when thresholds are crossed. Email weekly digest to PMs showing their stale items. Dashboard widget shows real-time health of the pipeline.',
      steps: [
        { title: 'Define Alert Thresholds', desc: 'Leads: 14/30/60 day tiers. Active: 30/60/90 days. Estimating: 7/14/30 days. Each tier gets escalating urgency.' },
        { title: 'Build Background Scanner', desc: 'Scheduled job that runs daily against SharePoint last-modified timestamps. Already have this data in the API.' },
        { title: 'Create Alert Dashboard Widget', desc: 'Color-coded project health indicators on the Operations Dashboard. Red/yellow/green based on recency.' },
        { title: 'Email Digest System', desc: 'Weekly automated email to each PM showing their stale items with direct links to SharePoint folders.' },
        { title: 'Escalation Rules', desc: 'If a project stays stale for 2 consecutive alert cycles, escalate to management dashboard.' },
      ],
      roi: [
        { label: 'Recovered Leads (est. 3/year @ $50k avg)', value: '$150,000', positive: true, note: 'Leads that would have been forgotten' },
        { label: 'Prevented Schedule Slip', value: '2-4 weeks/project', positive: true, note: 'Catching stale active jobs early' },
        { label: 'Implementation Cost', value: '~40 hours', positive: false },
      ],
      risks: [
        'Alert fatigue if thresholds are too aggressive — start conservative',
        'Some projects are legitimately on hold; need a "snooze" mechanism',
        'Requires PM buy-in to actually act on alerts',
      ],
      integrations: [
        { name: 'SharePoint API', desc: 'Already connected — use existing last-modified data from the scanning service' },
        { name: 'Email Service', desc: 'SMTP or Microsoft Graph for sending digest emails to PMs' },
        { name: 'Operations Dashboard', desc: 'Widget showing real-time pipeline health' },
      ],
    },
    {
      id: 'folder-structure-enforcer',
      title: 'Project Folder Structure Enforcer',
      category: 'Document Management',
      impact: 'high',
      effort: 'low',
      tagline: `${d.naming.inconsistentFolderNames.length} projects have non-standard folder names`,
      summary: 'Automatically enforce a standard folder template when new projects are created in SharePoint. Detect deviations and missing required folders across all projects.',
      problem: 'Chase Group\'s SharePoint projects have inconsistent folder structures. Some active projects are missing critical folders (Permits, Schedules, RFIs). Some have ad-hoc folders like "New folder" or "Temp" that create confusion. There\'s no enforcement — every PM structures their project differently.',
      problemBullets: [
        `${d.gaps.missingPermits} of ${d.summary.total} projects have no Permits folder`,
        `${d.gaps.missingSchedules} projects have no Project Schedules`,
        `${d.gaps.missingRFIs} projects have no RFI tracking`,
        `${d.gaps.missingJobCosts} projects have no Job Costs folder`,
        `${d.naming.inconsistentFolderNames.length} projects have non-standard folders (New folder, Temp, numeric-prefixed)`,
      ],
      metrics: [
        { label: 'Missing Permits', value: d.gaps.missingPermits, color: '#ef4444' },
        { label: 'Missing Schedules', value: d.gaps.missingSchedules, color: '#f59e0b' },
        { label: 'Missing RFIs', value: d.gaps.missingRFIs, color: '#f97316' },
        { label: 'Non-Standard Names', value: d.naming.inconsistentFolderNames.length, color: '#8b5cf6' },
      ],
      evidence: () => (
        <div>
          {d.naming.inconsistentFolderNames.length > 0 && (
            <div className="opp-evidence-group">
              <strong>Projects with non-standard folders:</strong>
              <ul>{d.naming.inconsistentFolderNames.map((item, i) => (
                <li key={i}><strong>{item.project}</strong>: {item.folders.join(', ')}</li>
              ))}</ul>
            </div>
          )}
        </div>
      ),
      solution: 'Define a standard project folder template by phase (Lead, Estimating, Active). When a project transitions status, automatically create missing required folders via Graph API. Run a nightly compliance scan that flags deviations.',
      steps: [
        { title: 'Define Standard Templates', desc: 'Lead template: Site Photos, Plans & Specs, Proposals. Estimating template: add Subcontractors, Estimating Excel Sheets. Active template: full CSI division structure + Permits, RFIs, Job Costs, etc.' },
        { title: 'Build Template Provisioner', desc: 'Graph API call to create folder structures when a project status changes. Trigger from the existing SharePoint scanning service.' },
        { title: 'Compliance Scanner', desc: 'Nightly scan comparing actual folders against the template. Generate deviation reports.' },
        { title: 'Dashboard Integration', desc: 'Show folder compliance percentage per project on the Protocols Dashboard.' },
        { title: 'Naming Convention Cleanup', desc: 'One-time migration to rename non-standard folders. Going forward, enforce naming rules.' },
      ],
      dataModel: {
        headers: ['Template', 'Required Folders', 'Phase'],
        rows: [
          ['Lead', 'Site Photos, Plans & Specs, Proposals', 'Business Development'],
          ['Estimating', '+ Subcontractors, Estimating Excel Sheets, Bid Management', 'Preconstruction'],
          ['Active', '+ Permits, RFIs, Job Costs, Meetings, Project Schedules, Chase Group, Owner Documents, Project Progress Reports', 'Execution'],
          ['Closeout', '+ Warranty, As-Builts, Final Lien Waivers', 'Closeout'],
        ],
      },
      roi: [
        { label: 'Time Saved on Project Setup', value: '4-8 hours/project', positive: true },
        { label: 'Prevented Missing Documentation', value: 'Risk elimination', positive: true },
        { label: 'Implementation Cost', value: '~30 hours', positive: false },
      ],
      risks: [
        'PMs may resist standardization — need management mandate',
        'Some projects genuinely need custom folders — need exception process',
        'Graph API permissions required to create folders automatically',
      ],
      integrations: [
        { name: 'Microsoft Graph API', desc: 'Create folders and enforce naming conventions programmatically' },
        { name: 'SharePoint Scanner', desc: 'Extend existing scanning service with compliance checks' },
        { name: 'Protocols Dashboard', desc: 'Surface compliance data alongside construction phase compliance' },
      ],
    },
    {
      id: 'estimating-pipeline-tracker',
      title: 'Estimating Pipeline Intelligence',
      category: 'Preconstruction',
      impact: 'critical',
      effort: 'medium',
      tagline: `${d.summary.estimating} jobs in estimating — ${d.estimatingInsights.estimatingWithoutSubBids.length} have no sub bid documents`,
      summary: 'Track the estimating pipeline with real-time visibility into which bids have proposals, sub coverage, and deadlines. Prevent bids from slipping through the cracks.',
      problem: 'Chase Group has ' + d.summary.estimating + ' projects in estimating right now, but there\'s no centralized view of bid status, deadline, sub coverage, or proposal readiness. Estimators work in isolation. Management can\'t see which bids are at risk of missing deadlines or which have incomplete sub coverage.',
      problemBullets: [
        `${d.estimatingInsights.projectsWithoutProposals.length} estimating projects have no proposal documents yet`,
        `${d.estimatingInsights.estimatingWithoutSubBids.length} estimating projects have no subcontractor bid documents`,
        'No visibility into bid deadlines or time remaining',
        'No tracking of which CSI divisions have sub coverage vs. gaps',
        'Estimators can\'t see each other\'s workload or bid calendar',
      ],
      metrics: [
        { label: 'In Estimating', value: d.summary.estimating, color: '#f59e0b' },
        { label: 'No Proposals Yet', value: d.estimatingInsights.projectsWithoutProposals.length, color: '#ef4444' },
        { label: 'No Sub Bids', value: d.estimatingInsights.estimatingWithoutSubBids.length, color: '#ef4444' },
        { label: 'Total Leads', value: d.summary.leads, color: '#8b5cf6' },
      ],
      evidence: () => (
        <div>
          {d.estimatingInsights.projectsWithoutProposals.length > 0 && (
            <div className="opp-evidence-group">
              <strong>Estimating projects without proposals:</strong>
              <ul>{d.estimatingInsights.projectsWithoutProposals.map(p => <li key={p.id}>{p.name} — {p.fileCount} files, last modified {new Date(p.lastModified).toLocaleDateString()}</li>)}</ul>
            </div>
          )}
          {d.estimatingInsights.estimatingWithoutSubBids.length > 0 && (
            <div className="opp-evidence-group">
              <strong>Estimating projects without sub bid documents:</strong>
              <ul>{d.estimatingInsights.estimatingWithoutSubBids.map(p => <li key={p.id}>{p.name}</li>)}</ul>
            </div>
          )}
        </div>
      ),
      solution: 'Build an estimating pipeline dashboard showing every bid in progress with: deadline countdown, sub coverage by CSI division, proposal status, and estimator assignment. Auto-detect bid readiness from folder contents.',
      steps: [
        { title: 'Add Bid Metadata Fields', desc: 'Bid due date, estimator assigned, bid type (lump sum / GMP / CM), owner/architect contacts. Store in project metadata.' },
        { title: 'Build Sub Coverage Matrix', desc: 'For each estimating project, show which CSI divisions have sub bids received vs. still open. Flag divisions with zero bids as the deadline approaches.' },
        { title: 'Estimating Pipeline Dashboard', desc: 'Calendar view + list view of all active bids. Sortable by deadline, estimator, coverage %. Color-coded urgency.' },
        { title: 'Auto-Detection Rules', desc: 'Detect proposal readiness from Proposals folder contents. Detect sub coverage from Subcontractors folder children.' },
        { title: 'Bid Calendar Integration', desc: 'Export bid deadlines to Outlook/Google Calendar. Send reminders at 7/3/1 day before deadline.' },
      ],
      roi: [
        { label: 'Prevented Missed Bids (est. 2/year @ $30k avg fee)', value: '$60,000', positive: true },
        { label: 'Better Sub Coverage', value: '15-25% more competitive bids', positive: true },
        { label: 'Estimator Efficiency', value: '5-10 hours/week visibility savings', positive: true },
        { label: 'Implementation Cost', value: '~80 hours', positive: false },
      ],
      risks: [
        'Bid deadlines must be manually entered until email parsing is built',
        'Sub coverage detection is heuristic — documents in a folder don\'t guarantee a usable bid',
        'Need estimator adoption for metadata entry',
      ],
      integrations: [
        { name: 'SharePoint Scanner', desc: 'Already scanning folder contents — extend to detect proposal/sub bid presence' },
        { name: 'Calendar APIs', desc: 'Push bid deadlines to Outlook/Google Calendar' },
        { name: 'Email Parsing (future)', desc: 'Parse incoming sub bids from email and auto-file' },
      ],
    },
    {
      id: 'sub-division-coverage',
      title: 'CSI Division Coverage Analyzer',
      category: 'Preconstruction / Bid Management',
      impact: 'critical',
      effort: 'medium',
      tagline: `${d.subAnalysis.emptySubDivisions} of ${d.subAnalysis.totalSubDivisions} trade folders are empty across active projects`,
      summary: 'Analyze subcontractor documentation by CSI division across all active projects to identify scope gaps, missing trade coverage, and bid leveling opportunities.',
      problem: 'Chase Group uses CSI-formatted subcontractor division folders (03-CONCRETE, 22-PLUMBING, etc.) but has no automated way to see which divisions actually have documentation versus which are empty shells. Empty trade folders mean either: (a) the scope isn\'t needed for this job, or (b) it\'s a gap that nobody noticed.',
      problemBullets: [
        `${d.subAnalysis.emptySubDivisions} trade division folders are empty (${100 - d.subAnalysis.filledPct}% of all divisions)`,
        `Only ${d.subAnalysis.filledPct}% of trade folders have any documents`,
        'No way to compare sub coverage across projects to identify patterns',
        'A common "25, 26, 27, 28 - ELECTRICAL SYSTEMS" combined folder suggests naming inconsistency even within the CSI structure',
        'Critical divisions (Concrete, Electrical, HVAC, Plumbing) may be empty on active jobs — that\'s a risk signal',
      ],
      metrics: [
        { label: 'Total Trade Folders', value: d.subAnalysis.totalSubDivisions },
        { label: 'Empty Folders', value: d.subAnalysis.emptySubDivisions, color: '#ef4444' },
        { label: 'Filled %', value: `${d.subAnalysis.filledPct}%`, color: d.subAnalysis.filledPct > 50 ? '#22c55e' : '#ef4444' },
        { label: 'Active Projects', value: d.summary.active, color: '#3b82f6' },
      ],
      evidence: () => {
        const divisionStats = {};
        for (const p of d.active) {
          const sf = p.subfolders || {};
          const subs = findFolder(sf, 'Subcontractors');
          if (subs && subs.children) {
            for (const [name, info] of Object.entries(subs.children)) {
              if (!divisionStats[name]) divisionStats[name] = { total: 0, withDocs: 0 };
              divisionStats[name].total++;
              if (itemCount(info) > 0) divisionStats[name].withDocs++;
            }
          }
        }
        const sorted = Object.entries(divisionStats).sort((a, b) => (a[1].withDocs / a[1].total) - (b[1].withDocs / b[1].total));
        return (
          <div className="opp-evidence-group">
            <strong>Division Coverage Across {d.summary.active} Active Projects:</strong>
            <div className="opp-table-wrapper">
              <table className="opp-table">
                <thead><tr><th>Division</th><th>Projects With Docs</th><th>Coverage</th></tr></thead>
                <tbody>
                  {sorted.map(([name, stats]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{stats.withDocs} / {stats.total}</td>
                      <td style={{ color: stats.withDocs === 0 ? '#ef4444' : stats.withDocs < stats.total ? '#f59e0b' : '#22c55e' }}>
                        {Math.round((stats.withDocs / stats.total) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      },
      solution: 'Build a cross-project CSI division matrix that shows document coverage at a glance. Flag critical divisions with zero coverage on active jobs. Use historical patterns to predict which divisions are likely needed for each project type.',
      steps: [
        { title: 'Build Division Matrix View', desc: 'Rows = projects, Columns = CSI divisions. Cells show document count. Color-coded green/yellow/red.' },
        { title: 'Critical Division Rules', desc: 'Define which divisions are always required (03-Concrete, 22-Plumbing, 23-HVAC, 26-Electrical). Flag when these are empty on active jobs.' },
        { title: 'Historical Pattern Analysis', desc: 'Analyze completed projects to learn which divisions typically have documents for each project type.' },
        { title: 'Scope Gap Alerts', desc: 'When a new project enters Active status, check if critical divisions are covered. Generate alerts for gaps.' },
      ],
      roi: [
        { label: 'Caught Scope Gaps (est. 2/project)', value: '$10,000-50,000/gap', positive: true, note: 'Prevented change orders from missing scope' },
        { label: 'Better Bid Leveling', value: 'Foundation for bid comparison', positive: true },
        { label: 'Implementation Cost', value: '~60 hours', positive: false },
      ],
      risks: [
        'Not every project needs every division — need to account for project type',
        'Empty folder ≠ missing scope (work could be self-performed or N/A)',
        'Requires understanding of which divisions are critical per project type',
      ],
      integrations: [
        { name: 'SharePoint Scanner', desc: 'Already parsing Subcontractors/children — extend to aggregate across projects' },
        { name: 'Protocols Dashboard', desc: 'CSI matrix is complementary to the SOP compliance view' },
      ],
    },
    {
      id: 'document-size-intelligence',
      title: 'Project Document Intelligence & Cost Correlation',
      category: 'Analytics / Intelligence',
      impact: 'medium',
      effort: 'low',
      tagline: `${d.fileStats.totalFileCount.toLocaleString()} files totaling ${(d.fileStats.totalSizeBytes / (1024*1024*1024)).toFixed(1)} GB across ${d.summary.total} projects`,
      summary: 'Analyze document volumes, file types, and sizes across projects to identify patterns that correlate with project health, complexity, and risk.',
      problem: 'Chase Group has a massive document repository but no intelligence layer on top of it. There\'s no way to answer questions like: "Which projects have unusually few documents for their phase?" or "Are we taking enough site photos?" or "Which projects have the most change-related documents?"',
      problemBullets: [
        `${d.fileStats.totalFileCount.toLocaleString()} total files across all projects — no analytics on this data`,
        `${(d.fileStats.totalSizeBytes / (1024*1024*1024)).toFixed(1)} GB of project documents with no search or classification`,
        `${d.activity.projectsWithNoRecentFiles} projects have zero recent file activity`,
        'No correlation between document patterns and project outcomes',
        'No way to quickly find similar projects based on document patterns',
      ],
      metrics: [
        { label: 'Total Files', value: d.fileStats.totalFileCount.toLocaleString() },
        { label: 'Total Size', value: `${(d.fileStats.totalSizeBytes / (1024*1024*1024)).toFixed(1)} GB` },
        { label: 'Avg Files/Project', value: Math.round(d.fileStats.totalFileCount / Math.max(d.summary.total, 1)) },
        { label: 'No Recent Activity', value: d.activity.projectsWithNoRecentFiles, color: '#f59e0b' },
      ],
      evidence: () => {
        const bySize = [...d.projects].sort((a, b) => (b.totalSizeBytes || 0) - (a.totalSizeBytes || 0)).slice(0, 8);
        return (
          <div className="opp-evidence-group">
            <strong>Largest Projects by Document Volume:</strong>
            <div className="opp-table-wrapper">
              <table className="opp-table">
                <thead><tr><th>Project</th><th>Files</th><th>Size</th><th>Status</th></tr></thead>
                <tbody>
                  {bySize.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.fileCount}</td>
                      <td>{((p.totalSizeBytes || 0) / (1024*1024)).toFixed(1)} MB</td>
                      <td>{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      },
      solution: 'Build a document analytics engine that tracks file volumes by type, detects anomalies, and correlates document patterns with project health. Surface insights like "This project has 50% fewer documents than similar active projects."',
      steps: [
        { title: 'File Type Classification', desc: 'Categorize files by type (PDFs, images, spreadsheets, CAD). Track counts and sizes by category.' },
        { title: 'Project Benchmarking', desc: 'Calculate average document volumes per phase. Flag projects significantly above or below the benchmark.' },
        { title: 'Photo Analytics', desc: 'Track site photo volume and frequency. Detect gaps in photo documentation that could be a liability risk.' },
        { title: 'Document Search', desc: 'Full-text search across file names. Find related documents across projects.' },
      ],
      roi: [
        { label: 'Reduced Discovery Time', value: '5-10 hours/month', positive: true },
        { label: 'Risk Detection', value: 'Early warning for under-documented projects', positive: true },
        { label: 'Implementation Cost', value: '~50 hours', positive: false },
      ],
      risks: [
        'File names alone don\'t reveal content quality — an empty PDF still counts',
        'Privacy considerations for photo analytics',
      ],
      integrations: [
        { name: 'SharePoint Scanner', desc: 'Extend to track file types and sizes per folder' },
        { name: 'Operations Dashboard', desc: 'Add document health widgets' },
      ],
    },
    {
      id: 'lead-conversion-pipeline',
      title: 'Lead-to-Estimating Conversion Automation',
      category: 'Business Development',
      impact: 'high',
      effort: 'medium',
      tagline: `${d.summary.leads} leads in pipeline — many with minimal documentation`,
      summary: 'Automate the lead qualification process by analyzing folder contents to determine readiness for estimating. Auto-score leads based on completeness of site photos, plans, and owner contact information.',
      problem: 'Chase Group has ' + d.summary.leads + ' leads but no structured process to decide which ones are ready to move to estimating. Some leads have extensive documentation (plans, site photos, proposals) while others are just a folder name. There\'s no scoring or prioritization.',
      problemBullets: [
        `${d.summary.leads} leads with varying levels of documentation`,
        'No readiness scoring — PMs decide subjectively which leads to pursue',
        'No visibility into which leads have plans & specs (required for estimating)',
        'Leads can sit for months without any go/no-go decision',
        `${d.activity.staleLeads.length} leads have been inactive for 60+ days`,
      ],
      metrics: [
        { label: 'Total Leads', value: d.summary.leads, color: '#8b5cf6' },
        { label: 'Cold Leads (60d+)', value: d.activity.staleLeads.length, color: '#ef4444' },
        { label: 'In Estimating', value: d.summary.estimating, color: '#f59e0b' },
        { label: 'Conversion Target', value: `${Math.round(d.summary.estimating / Math.max(d.summary.leads + d.summary.estimating, 1) * 100)}%`, color: '#22c55e' },
      ],
      evidence: () => {
        const leadsByDocs = d.leads.map(p => ({
          name: p.name,
          files: p.fileCount,
          hasPlans: hasContent(findFolder(p.subfolders || {}, 'Plans')),
          hasPhotos: hasContent(findFolder(p.subfolders || {}, 'Photo')) || hasContent(findFolder(p.subfolders || {}, 'Site Photo')),
          daysSinceUpdate: Math.floor((Date.now() - new Date(p.lastModified).getTime()) / (1000 * 60 * 60 * 24)),
        })).sort((a, b) => b.files - a.files);
        return (
          <div className="opp-evidence-group">
            <strong>Lead Documentation Analysis:</strong>
            <div className="opp-table-wrapper">
              <table className="opp-table">
                <thead><tr><th>Lead</th><th>Files</th><th>Plans</th><th>Photos</th><th>Days Idle</th></tr></thead>
                <tbody>
                  {leadsByDocs.map(l => (
                    <tr key={l.name}>
                      <td>{l.name}</td>
                      <td>{l.files}</td>
                      <td style={{ color: l.hasPlans ? '#22c55e' : '#ef4444' }}>{l.hasPlans ? 'Yes' : 'No'}</td>
                      <td style={{ color: l.hasPhotos ? '#22c55e' : '#ef4444' }}>{l.hasPhotos ? 'Yes' : 'No'}</td>
                      <td style={{ color: l.daysSinceUpdate > 60 ? '#ef4444' : l.daysSinceUpdate > 30 ? '#f59e0b' : '#22c55e' }}>{l.daysSinceUpdate}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      },
      solution: 'Build a lead scoring engine that analyzes folder contents and assigns a "readiness score" based on: presence of plans & specs, site photos, owner documents, file count, and recency of activity. Surface a prioritized lead board.',
      steps: [
        { title: 'Define Scoring Criteria', desc: 'Plans & specs: +30pts. Site photos: +15pts. Owner docs: +20pts. File count >10: +15pts. Activity in last 30 days: +20pts.' },
        { title: 'Build Lead Scoring Engine', desc: 'Score each lead automatically based on folder contents. Already have this data from the SharePoint scanner.' },
        { title: 'Prioritized Lead Board', desc: 'New dashboard view showing leads sorted by readiness score. Click to see what\'s missing.' },
        { title: 'Go/No-Go Workflow', desc: 'Structured decision workflow with documented reason. Logs the decision and transitions to Estimating or Archived.' },
        { title: 'Lead Aging Alerts', desc: 'Auto-alerts when scored leads sit without a go/no-go decision for too long.' },
      ],
      roi: [
        { label: 'Faster Qualification', value: '2-5 hours/lead saved', positive: true },
        { label: 'Better Win Rate', value: 'Pursue better-qualified opportunities', positive: true },
        { label: 'Prevented Revenue Loss', value: '1-3 recovered deals/year', positive: true },
        { label: 'Implementation Cost', value: '~60 hours', positive: false },
      ],
      risks: [
        'Score is only based on document presence, not document quality',
        'Some high-value leads start with very few documents (e.g., a phone call)',
        'Need human judgment on top of automated scoring',
      ],
      integrations: [
        { name: 'SharePoint Scanner', desc: 'Already have folder contents — just need scoring logic' },
        { name: 'Operations Dashboard', desc: 'Add lead pipeline widget with scores' },
      ],
    },
    // ── CORE SYSTEM OPPORTUNITIES ──────────────────────────────────
    {
      id: 'bid-leveling',
      title: 'Bid Leveling Engine',
      category: 'Preconstruction — Crown Jewel',
      impact: 'critical',
      effort: 'high',
      tagline: 'The #1 gap in construction software — where money is won or lost',
      summary: 'Build a dedicated bid leveling system that normalizes subcontractor bids, compares apples-to-apples, detects missing scope, and shows the true low bidder versus the stated low bidder.',
      problem: 'Bid leveling is currently done in spreadsheets. Sub bids come in via email, PDF, and phone. Each estimator levels differently. Scope gaps hide in exclusions that nobody catches until the change orders arrive. The "low bidder" often isn\'t actually the cheapest once you account for missing scope.',
      problemBullets: [
        'Every GC uses spreadsheets for bid leveling — no good software exists',
        'Subs hide costs in exclusions and qualifications',
        'Low bidders send change orders that eat the margin',
        'No structured comparison of inclusions/exclusions across bidders',
        'Historical bid data is lost — can\'t learn from past leveling decisions',
      ],
      metrics: [
        { label: 'Cost Overrun Risk', value: '2-5%', color: '#ef4444', sub: 'per job from scope gaps' },
        { label: 'Time Per Bid Level', value: '4-8 hrs', color: '#f59e0b', sub: 'per trade package' },
        { label: 'Typical Change Orders', value: '3-8%', color: '#ef4444', sub: 'of project cost' },
        { label: 'Active Estimating', value: d.summary.estimating, color: '#3b82f6' },
      ],
      evidence: () => (
        <div className="opp-evidence-group">
          <strong>Example: Concrete Package Bid Leveling</strong>
          <div className="opp-table-wrapper">
            <table className="opp-table">
              <thead><tr><th>Scope Item</th><th>Bidder A</th><th>Bidder B</th><th>Bidder C</th><th>Internal Est.</th></tr></thead>
              <tbody>
                <tr><td>Slab on Grade</td><td style={{color:'#22c55e'}}>Included</td><td style={{color:'#22c55e'}}>Included</td><td style={{color:'#22c55e'}}>Included</td><td>$45,000</td></tr>
                <tr><td>Foundation</td><td style={{color:'#22c55e'}}>Included</td><td style={{color:'#22c55e'}}>Included</td><td style={{color:'#22c55e'}}>Included</td><td>$32,000</td></tr>
                <tr><td>Rebar</td><td style={{color:'#22c55e'}}>Included</td><td style={{color:'#ef4444', fontWeight:700}}>EXCLUDED</td><td style={{color:'#22c55e'}}>Included</td><td>$18,000</td></tr>
                <tr><td>Vapor Barrier</td><td style={{color:'#22c55e'}}>Included</td><td style={{color:'#ef4444', fontWeight:700}}>EXCLUDED</td><td style={{color:'#22c55e'}}>Included</td><td>$4,000</td></tr>
                <tr style={{fontWeight:700}}><td>Stated Bid</td><td>$95,000</td><td>$78,000</td><td>$97,000</td><td>$99,000</td></tr>
                <tr style={{fontWeight:700, background:'#fef2f2'}}><td>True Cost (Normalized)</td><td>$95,000</td><td style={{color:'#ef4444'}}>$100,000</td><td>$97,000</td><td>$99,000</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{marginTop:12, fontSize:13, color:'#6b7280'}}>Bidder B looks cheapest at $78k but is actually the most expensive at $100k after scope normalization. This is where money is lost.</p>
        </div>
      ),
      solution: 'Build a structured bid intake and leveling system. Define scope line items per trade. Parse sub bids (manual first, AI later). Normalize by adding back excluded scope. Rank bidders by true total exposure, not stated price.',
      steps: [
        { title: 'Define Scope Templates by Trade', desc: 'Start with the top 10 trades: Concrete, Earthwork, Electrical, Plumbing, HVAC, Framing, Roofing, Finishes, Openings, Metals. Define standard scope line items for each.' },
        { title: 'Build Bid Intake Form', desc: 'Structured form per trade. Bidder fills in price per line item + marks inclusions/exclusions. Upload proposal PDF.' },
        { title: 'Build Comparison Engine', desc: 'Side-by-side comparison matrix. Auto-flag excluded items. Calculate normalized price by adding internal estimate for excluded scope.' },
        { title: 'Risk Scoring', desc: 'Flag bidders with excessive exclusions, unusual qualifications, or history of change orders.' },
        { title: 'Award Recommendation', desc: 'Recommend the true low bidder based on normalized price + risk score. Generate award justification document.' },
        { title: 'Historical Database', desc: 'Store all leveling decisions. Build a database of typical sub pricing by trade, project type, and geography.' },
      ],
      roi: [
        { label: 'Prevented Cost Overruns', value: '2-5% per project', positive: true, note: 'On a $2M job that\'s $40-100k saved' },
        { label: 'Time Savings', value: '60-70% faster leveling', positive: true },
        { label: 'Better Award Decisions', value: 'Documented justification', positive: true },
        { label: 'Implementation Cost', value: '~200 hours', positive: false },
      ],
      risks: [
        'Subs won\'t use a portal initially — need to support manual entry from PDFs',
        'Scope templates need to be maintained per trade — initial effort is significant',
        'AI parsing of PDF proposals is Phase 2 — start manual',
      ],
      integrations: [
        { name: 'Scope Sheet Builder', desc: 'Scope templates feed directly into bid leveling' },
        { name: 'Estimate → Budget', desc: 'Leveled bids feed the budget with committed costs' },
        { name: 'Buyout Automation', desc: 'Award decisions auto-generate subcontracts' },
      ],
    },
    {
      id: 'scope-sheet-builder',
      title: 'Scope Sheet Builder',
      category: 'Preconstruction',
      impact: 'critical',
      effort: 'medium',
      tagline: 'The foundation that bid leveling and buyout automation are built on',
      summary: 'Build structured scope packages by trade with standardized inclusions, exclusions, and responsibility assignments. The scope sheet becomes the single source of truth that flows through bid leveling, award, and buyout.',
      problem: 'Scope sheets are currently created ad-hoc in Word documents. Every estimator writes them differently. There\'s no template library, no standard inclusion/exclusion language, and no linkage between the scope sheet and the estimate line items or bid leveling process.',
      problemBullets: [
        'No standardized scope language — every bid package is unique',
        'Scope gaps between trades are the #1 source of change orders',
        'No template library — every estimator starts from scratch',
        'Scope sheets aren\'t linked to estimate line items or CSI codes',
        'Sub contracts don\'t reference the scope sheet — arguments over "what was included"',
      ],
      metrics: [
        { label: 'Time Per Scope Sheet', value: '2-4 hrs', color: '#f59e0b', sub: 'manual creation today' },
        { label: 'Typical Trades/Job', value: '15-22', sub: 'scope packages needed' },
        { label: 'Change Order Source', value: '60%+', color: '#ef4444', sub: 'from scope gaps' },
        { label: 'Active CSI Divisions', value: d.subAnalysis.totalSubDivisions - d.subAnalysis.emptySubDivisions },
      ],
      solution: 'Build a scope sheet engine with trade-specific templates. Each template defines standard inclusions, common exclusions, responsibility assignments, and clarification prompts. Templates link to CSI codes and estimate line items.',
      steps: [
        { title: 'Build Template Library', desc: 'Start with the 10 most common trades. Define standard scope items, typical exclusions, and responsibility matrix for each.' },
        { title: 'Scope Sheet Generator', desc: 'Select a project + trade → auto-populate template. Estimator customizes inclusions/exclusions for this specific job.' },
        { title: 'Responsibility Matrix', desc: 'For each scope item, assign: GC provides / Sub provides / Owner provides / N/A. This prevents "I thought you were doing that" situations.' },
        { title: 'Link to Estimate', desc: 'Each scope item maps to a cost code. When the scope sheet is complete, it validates against the estimate line items.' },
        { title: 'Export & Attach', desc: 'Generate clean PDF scope sheets for ITB packages. Auto-attach to bid invitations.' },
      ],
      roi: [
        { label: 'Time Savings', value: '20+ hours per bid package', positive: true },
        { label: 'Prevented Change Orders', value: '30-50% reduction', positive: true, note: 'Clear scope = fewer surprises' },
        { label: 'Institutional Knowledge', value: 'Templates capture expertise', positive: true },
        { label: 'Implementation Cost', value: '~120 hours', positive: false },
      ],
      risks: [
        'Templates need regular maintenance as standards evolve',
        'Initial template creation requires significant estimator input',
      ],
      integrations: [
        { name: 'Bid Leveling Engine', desc: 'Scope sheets define what to compare in bid leveling' },
        { name: 'Buyout Automation', desc: 'Scope sheets attach directly to subcontracts' },
        { name: 'Estimate Line Items', desc: 'Each scope item maps to a cost code' },
      ],
    },
    {
      id: 'estimate-to-budget',
      title: 'Estimate → Budget Conversion Engine',
      category: 'Award / Conversion',
      impact: 'critical',
      effort: 'high',
      tagline: '"The estimate should seamlessly become the budget and drive execution"',
      summary: 'One-click conversion of a completed estimate into a project execution budget. Strip overhead/profit, map cost codes, assign subs and vendors, and create a ready-to-run project budget — no re-entry of data.',
      problem: 'When Chase Group wins a job, the estimate has to be manually re-entered into a budget format. Cost codes get remapped, sub assignments are entered by hand, and the budget structure rarely matches the estimate structure. This takes weeks and introduces errors.',
      problemBullets: [
        'Estimate data is re-entered into budget manually — 40+ hours per project',
        'Cost code mapping is done by hand — errors propagate into job costing',
        'The estimate and budget are in different systems with different structures',
        'No audit trail connecting budget lines back to estimate assumptions',
        'Contingency and allowances get lost or misallocated in the transition',
      ],
      metrics: [
        { label: 'Current Setup Time', value: '40+ hrs', color: '#ef4444', sub: 'per project' },
        { label: 'Target Setup Time', value: '2-4 hrs', color: '#22c55e', sub: 'with automation' },
        { label: 'Projects Won/Year', value: `~${d.summary.active + d.summary.complete}`, sub: 'need budget conversion' },
        { label: 'Error Reduction', value: '90%+', color: '#22c55e' },
      ],
      solution: 'Build a conversion engine that takes the structured estimate and transforms it into a project budget. Map estimate line items to cost codes, separate out markups, assign committed costs from awarded bids, and create the baseline budget document.',
      steps: [
        { title: 'Define Budget Structure', desc: 'Standard budget format with cost code hierarchy, committed vs. uncommitted, original vs. revised, contingency tracking.' },
        { title: 'Build Cost Code Mapping', desc: 'Define rules that map estimate line items to budget cost codes. Allow manual override but auto-suggest based on CSI division.' },
        { title: 'Markup Stripping', desc: 'Automatically separate overhead, profit, contingency, and fee from the estimate to create the "cost" budget.' },
        { title: 'Bid Integration', desc: 'Pull awarded bid amounts from bid leveling as committed costs. Calculate remaining uncommitted budget per trade.' },
        { title: 'Baseline Lock', desc: 'Create a locked baseline budget that serves as the starting point. All changes are tracked as variances.' },
        { title: 'Budget vs. Estimate Reconciliation', desc: 'Dashboard showing estimate vs. budget with variance highlighting.' },
      ],
      roi: [
        { label: 'Time Savings', value: `${(d.summary.active + d.summary.complete) * 40} hours/year`, positive: true, note: 'At 40 hours per project' },
        { label: 'Error Prevention', value: 'Eliminates manual re-entry errors', positive: true },
        { label: 'Faster Project Start', value: '2-3 weeks earlier to buyout', positive: true },
        { label: 'Implementation Cost', value: '~160 hours', positive: false },
      ],
      risks: [
        'Requires structured estimate data — won\'t work with unstructured spreadsheets',
        'Cost code standards must be consistent across estimating and operations',
        'Need buy-in from both estimating and PM teams',
      ],
      integrations: [
        { name: 'Estimating Module', desc: 'Source data for conversion' },
        { name: 'Bid Leveling', desc: 'Awarded bids become committed costs' },
        { name: 'Buyout Automation', desc: 'Budget drives subcontract/PO generation' },
        { name: 'Job Cost System', desc: 'Budget baseline feeds cost tracking' },
      ],
    },
    {
      id: 'buyout-automation',
      title: 'Buyout Automation',
      category: 'Project Setup',
      impact: 'high',
      effort: 'medium',
      tagline: '20 days of manual work becomes 2 days of review',
      summary: 'Auto-generate subcontracts, purchase orders, and work orders from awarded bids, scope sheets, and budget line items. Compliance checks gate release.',
      problem: 'After award, the buyout process takes 2-4 weeks of manual work: typing subcontracts, creating POs, re-entering scope language, checking insurance certificates. Every subcontract is created from scratch.',
      problemBullets: [
        'Each subcontract takes 2-4 hours to create manually',
        'Scope language from the scope sheet has to be re-typed into the contract',
        'Insurance and compliance docs are checked manually before award',
        'PO creation is separate from subcontract creation — double entry',
        `${d.summary.active} active projects × 15-22 subs = hundreds of commitments to manage`,
      ],
      metrics: [
        { label: 'Current Buyout Time', value: '2-4 weeks', color: '#ef4444' },
        { label: 'Target Buyout Time', value: '2 days', color: '#22c55e' },
        { label: 'Subs Per Project', value: '15-22' },
        { label: 'Active Projects', value: d.summary.active, color: '#3b82f6' },
      ],
      solution: 'Build a commitment generation engine. Take awarded bid + scope sheet + contract template → auto-generate subcontract. Pre-fill all terms, scope, pricing, schedule requirements. Compliance check gates release.',
      steps: [
        { title: 'Contract Templates', desc: 'Standard subcontract template with variable fields. Different templates for lump sum, T&M, unit price.' },
        { title: 'Auto-Generation Engine', desc: 'Input: awarded bid + scope sheet + project info. Output: complete subcontract document ready for review.' },
        { title: 'Compliance Gateway', desc: 'Before a commitment can be released: verify insurance current, W-9 on file, license valid. Block if non-compliant.' },
        { title: 'PO Generator', desc: 'Auto-generate POs for material vendors from the budget. Link to estimate line items.' },
        { title: 'Approval Workflow', desc: 'Route commitments for approval based on amount thresholds. Digital signature integration.' },
      ],
      roi: [
        { label: 'Time Savings', value: '80-90% reduction in buyout time', positive: true },
        { label: 'Compliance Risk Elimination', value: 'Automated checks', positive: true },
        { label: 'Faster Project Start', value: 'Subs mobilize sooner', positive: true },
        { label: 'Implementation Cost', value: '~120 hours', positive: false },
      ],
      risks: [
        'Legal review of auto-generated contracts is still required',
        'Contract templates need regular legal updates',
      ],
      integrations: [
        { name: 'Bid Leveling', desc: 'Award decisions flow into commitment generation' },
        { name: 'Scope Sheet Builder', desc: 'Scope language attaches directly to contracts' },
        { name: 'Compliance Module', desc: 'Insurance/license verification gates release' },
      ],
    },
    {
      id: 'rfi-tracking',
      title: 'RFI & Submittal Tracking Automation',
      category: 'Project Execution',
      impact: 'medium',
      effort: 'medium',
      tagline: `${d.gaps.missingRFIs} projects have no RFI documentation`,
      summary: 'Centralized RFI and submittal tracking with automated numbering, routing, deadline alerts, and response tracking. Replace scattered emails and lost paperwork.',
      problem: `${d.gaps.missingRFIs} projects have no RFI folder or documentation. RFIs are tracked via email, Excel, or not at all. Responses get lost. There's no audit trail of who asked what and when.`,
      problemBullets: [
        'RFIs tracked in email — no centralized log',
        'No automatic numbering or sequencing',
        'Response deadlines aren\'t tracked — delays are invisible',
        'Submittals and shop drawings have no approval workflow',
        'No connection between RFIs and the cost impact (change orders)',
      ],
      metrics: [
        { label: 'Projects Missing RFIs', value: d.gaps.missingRFIs, color: '#ef4444' },
        { label: 'Avg RFIs Per Job', value: '20-50', sub: 'industry typical' },
        { label: 'Response Delay Risk', value: '1-3 days', color: '#f59e0b', sub: 'per lost RFI' },
        { label: 'Active Projects', value: d.summary.active, color: '#3b82f6' },
      ],
      solution: 'Build an RFI/submittal module with automatic numbering, routing rules, deadline tracking, and response logging. Link RFIs to cost codes and change events. Auto-create SharePoint folder structure.',
      steps: [
        { title: 'RFI Form & Numbering', desc: 'Standard RFI form with auto-incrementing numbers (e.g., RFI-001). Fields: question, drawing reference, responsible party, deadline.' },
        { title: 'Routing Engine', desc: 'Auto-route RFIs to architect/engineer based on trade classification. Track response status.' },
        { title: 'Deadline Alerts', desc: 'Automated reminders at 3/1/0 days before response deadline. Escalate overdue items.' },
        { title: 'Cost Impact Tracking', desc: 'Tag RFIs that result in a change. Link to change order when created.' },
        { title: 'Submittal Register', desc: 'Track required submittals, approval status, and resubmission requirements.' },
      ],
      roi: [
        { label: 'Schedule Protection', value: '1-5 days per delayed RFI', positive: true },
        { label: 'Audit Trail', value: 'Complete documentation for disputes', positive: true },
        { label: 'Implementation Cost', value: '~100 hours', positive: false },
      ],
      risks: [
        'Architect/engineer must be willing to respond through the system (or email integration needed)',
        'Existing RFI history would need manual migration',
      ],
      integrations: [
        { name: 'SharePoint', desc: 'Auto-file RFI documents in project RFI folders' },
        { name: 'Change Order Module', desc: 'RFIs that result in cost impact link to change events' },
        { name: 'Email', desc: 'Parse incoming RFI responses from email (Phase 2)' },
      ],
    },
    {
      id: 'meeting-minutes-ai',
      title: 'AI Meeting Minutes & Action Item Tracker',
      category: 'Project Execution',
      impact: 'medium',
      effort: 'medium',
      tagline: `${d.activeInsights.activeWithoutMeetings.length} active projects have no meeting documentation`,
      summary: 'Record construction meetings, auto-generate structured minutes with AI transcription, extract action items, assign owners, and track completion.',
      problem: 'Construction meetings happen weekly on every active job. Minutes are either not taken, taken in informal notes, or written up hours later from memory. Action items are agreed verbally and forgotten.',
      problemBullets: [
        `${d.activeInsights.activeWithoutMeetings.length} of ${d.summary.active} active projects have no meeting folder/documentation`,
        'Meeting minutes are created manually — often days after the meeting',
        'Action items are agreed verbally and have no tracking system',
        'No audit trail of decisions made in meetings — leads to disputes',
        'Owner/architect meeting decisions aren\'t linked to project documentation',
      ],
      metrics: [
        { label: 'No Meeting Docs', value: d.activeInsights.activeWithoutMeetings.length, color: '#ef4444' },
        { label: 'Meetings/Week', value: `~${d.summary.active}`, sub: 'one per active job' },
        { label: 'Minutes/Year', value: `~${d.summary.active * 50}`, sub: 'if captured properly' },
        { label: 'Time Per Minutes', value: '1-2 hrs', color: '#f59e0b', sub: 'manual creation' },
      ],
      solution: 'Mobile-friendly meeting recording with AI transcription. Auto-extract action items, decisions, and RFI triggers. Generate structured minutes with attendees, topics, and action items. Auto-file to SharePoint.',
      steps: [
        { title: 'Meeting Recording', desc: 'Simple audio recording from phone/laptop. Upload to system.' },
        { title: 'AI Transcription', desc: 'Whisper/Azure Speech API transcription. Speaker identification.' },
        { title: 'Action Item Extraction', desc: 'AI identifies action items, assigns owners based on context, sets deadlines.' },
        { title: 'Structured Minutes Template', desc: 'Auto-format into standard minutes template with: date, attendees, topics, decisions, action items.' },
        { title: 'Action Item Tracking', desc: 'Dashboard showing open action items per project. Reminders for overdue items.' },
        { title: 'SharePoint Auto-Filing', desc: 'Auto-save minutes PDF to the project\'s Meetings folder.' },
      ],
      roi: [
        { label: 'Time Savings', value: `${d.summary.active * 50} hours/year`, positive: true, note: 'At 1 hour per meeting' },
        { label: 'Dispute Protection', value: 'Documented decisions', positive: true },
        { label: 'Action Item Completion', value: '40-60% improvement', positive: true },
        { label: 'Implementation Cost', value: '~100 hours + AI API costs', positive: false },
      ],
      risks: [
        'Recording quality in noisy jobsite environments',
        'Privacy/consent for recording meetings',
        'AI accuracy on construction terminology',
      ],
      integrations: [
        { name: 'Azure/OpenAI', desc: 'Speech-to-text + action item extraction' },
        { name: 'SharePoint', desc: 'Auto-file minutes to project Meetings folder' },
        { name: 'RFI Module', desc: 'Meeting discussions that need RFIs auto-create drafts' },
      ],
    },
  ];
}

/* ═══════════════════════════════════════════════════════════════════
   UI COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

const IMPACT_COLORS = {
  critical: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', label: 'Critical' },
  high: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', label: 'High' },
  medium: { bg: '#f0fdf4', border: '#22c55e', text: '#166534', label: 'Medium' },
  low: { bg: '#f0f9ff', border: '#3b82f6', text: '#1e40af', label: 'Low' },
};

const EFFORT_LABELS = {
  low: { label: 'Quick Win', color: '#22c55e' },
  medium: { label: 'Moderate', color: '#f59e0b' },
  high: { label: 'Major', color: '#ef4444' },
};

function ImpactBadge({ impact }) {
  const c = IMPACT_COLORS[impact] || IMPACT_COLORS.medium;
  return <span className="auto-badge" style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}>{c.label}</span>;
}

function EffortBadge({ effort }) {
  const c = EFFORT_LABELS[effort] || EFFORT_LABELS.medium;
  return <span className="auto-badge auto-badge-outline" style={{ color: c.color, borderColor: c.color }}>{c.label}</span>;
}

function OpportunityCard({ opportunity, onClick }) {
  const o = opportunity;
  return (
    <button className="opp-card" onClick={onClick} type="button">
      <div className="opp-card-top">
        <div className="opp-card-badges">
          <ImpactBadge impact={o.impact} />
          <EffortBadge effort={o.effort} />
        </div>
        <span className="opp-card-category">{o.category}</span>
      </div>
      <h3 className="opp-card-title">{o.title}</h3>
      <p className="opp-card-tagline">{o.tagline}</p>
      <div className="opp-card-cta">
        View Detailed Breakdown
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </button>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function AutomationOpportunities() {
  const [projects, setProjects] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const all = await dataService.getAllProjects();
      setProjects(all);
      const data = analyzeOpportunities(all);
      setAnalysis(data);
      setOpportunities(buildOpportunities(data));
    } catch (err) {
      console.error('Failed to load automation data:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Analyzing automation opportunities...</div>
      </div>
    );
  }

  // Detail view for a selected opportunity
  if (selectedOpp) {
    return (
      <div className="page page-wide">
        <OpportunityDetail
          opportunity={selectedOpp}
          liveData={analysis}
          onBack={() => setSelectedOpp(null)}
        />
      </div>
    );
  }

  // Main listing view
  return (
    <div className="page page-wide">
      <div className="page-header">
        <h2>Automation Opportunities</h2>
        <div className="page-header-subtitle">
          {opportunities.length} opportunities identified from {analysis?.summary.total || 0} projects
        </div>
      </div>

      {/* Live Portfolio Snapshot */}
      {analysis && (
        <section className="dashboard-section">
          <div className="card">
            <h3>Portfolio Snapshot</h3>
            <div className="automation-summary-grid">
              <div className="automation-summary-card">
                <div className="automation-summary-number">{analysis.summary.total}</div>
                <div className="automation-summary-label">Total Projects</div>
              </div>
              <div className="automation-summary-card">
                <div className="automation-summary-number" style={{ color: '#3b82f6' }}>{analysis.summary.active}</div>
                <div className="automation-summary-label">Active</div>
              </div>
              <div className="automation-summary-card">
                <div className="automation-summary-number" style={{ color: '#f59e0b' }}>{analysis.summary.estimating}</div>
                <div className="automation-summary-label">Estimating</div>
              </div>
              <div className="automation-summary-card">
                <div className="automation-summary-number" style={{ color: '#8b5cf6' }}>{analysis.summary.leads}</div>
                <div className="automation-summary-label">Leads</div>
              </div>
              <div className="automation-summary-card">
                <div className="automation-summary-number" style={{ color: '#ef4444' }}>{analysis.activity.staleCount + analysis.activity.staleLeads.length}</div>
                <div className="automation-summary-label">At Risk</div>
              </div>
              <div className="automation-summary-card">
                <div className="automation-summary-number">{analysis.fileStats.totalFileCount.toLocaleString()}</div>
                <div className="automation-summary-label">Total Files</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Opportunity Cards */}
      <section className="dashboard-section">
        <div className="card">
          <h3>All Opportunities</h3>
          <p className="section-description">Click any opportunity to see the full detailed breakdown with live data evidence, implementation roadmap, and ROI analysis</p>
          <div className="opp-cards-grid">
            {opportunities.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} onClick={() => setSelectedOpp(opp)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
