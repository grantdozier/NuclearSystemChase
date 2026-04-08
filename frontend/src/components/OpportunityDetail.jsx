import { useState } from 'react';
import { FLOW_MAP } from './FlowChart';

const IMPACT_COLORS = {
  critical: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', label: 'Critical Impact' },
  high: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', label: 'High Impact' },
  medium: { bg: '#f0fdf4', border: '#22c55e', text: '#166534', label: 'Medium Impact' },
  low: { bg: '#f0f9ff', border: '#3b82f6', text: '#1e40af', label: 'Low Impact' },
};

const EFFORT_LABELS = {
  low: { label: 'Quick Win', color: '#22c55e' },
  medium: { label: 'Moderate Effort', color: '#f59e0b' },
  high: { label: 'Major Initiative', color: '#ef4444' },
};

function Badge({ impact }) {
  const c = IMPACT_COLORS[impact] || IMPACT_COLORS.medium;
  return <span className="auto-badge" style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}>{c.label}</span>;
}

function EffortBadge({ effort }) {
  const c = EFFORT_LABELS[effort] || EFFORT_LABELS.medium;
  return <span className="auto-badge auto-badge-outline" style={{ color: c.color, borderColor: c.color }}>{c.label}</span>;
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div className="opp-metric-card">
      <div className="opp-metric-value" style={{ color: color || 'var(--text-primary, #111827)' }}>{value}</div>
      <div className="opp-metric-label">{label}</div>
      {sub && <div className="opp-metric-sub">{sub}</div>}
    </div>
  );
}

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`opp-collapse ${open ? 'opp-collapse-open' : ''}`}>
      <button className="opp-collapse-header" onClick={() => setOpen(!open)} type="button">
        <h4 className="opp-section-title">{title}</h4>
        <svg className="opp-collapse-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && <div className="opp-collapse-body">{children}</div>}
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="opp-table-wrapper">
      <table className="opp-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OpportunityDetail({ opportunity, liveData, onBack }) {
  const o = opportunity;
  if (!o) return null;

  const FlowComponent = FLOW_MAP[o.id];

  return (
    <div className="opp-detail">
      <button className="opp-back-btn" onClick={onBack} type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to All Opportunities
      </button>

      {/* Header */}
      <div className="opp-detail-header">
        <div className="opp-detail-title-row">
          <h2>{o.title}</h2>
          <div className="opp-detail-badges">
            <Badge impact={o.impact} />
            <EffortBadge effort={o.effort} />
          </div>
        </div>
        <div className="opp-detail-category">{o.category}</div>
        <p className="opp-detail-summary">{o.summary}</p>
      </div>

      {/* ── FLOWCHART — the main visual, always first ── */}
      {FlowComponent && (
        <div className="opp-flow-section">
          <h3 className="opp-flow-heading">How It Works</h3>
          <FlowComponent />
        </div>
      )}

      {/* Key Metrics row */}
      {o.metrics && (
        <div className="opp-metrics-grid">
          {o.metrics.map((m, i) => (
            <MetricCard key={i} label={m.label} value={m.value} sub={m.sub} color={m.color} />
          ))}
        </div>
      )}

      {/* ── Collapsible detail sections below the flow ── */}
      <div className="opp-details-below">

        <CollapsibleSection title="The Problem" defaultOpen={true}>
          <div className="opp-problem-text">{o.problem}</div>
          {o.problemBullets && (
            <ul className="opp-bullet-list">
              {o.problemBullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </CollapsibleSection>

        {o.evidence && (
          <CollapsibleSection title="Evidence From Your Data" defaultOpen={true}>
            <div className="opp-evidence-box">
              {o.evidence(liveData)}
            </div>
          </CollapsibleSection>
        )}

        <CollapsibleSection title="The Solution">
          <div className="opp-solution-text">{o.solution}</div>
        </CollapsibleSection>

        {o.steps && (
          <CollapsibleSection title="Implementation Roadmap">
            <div className="opp-step-list">
              {o.steps.map((step, i) => (
                <div key={i} className="opp-step">
                  <div className="opp-step-num">{i + 1}</div>
                  <div className="opp-step-content">
                    <div className="opp-step-title">{step.title}</div>
                    <div className="opp-step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {o.dataModel && (
          <CollapsibleSection title="Data Model">
            <DataTable headers={o.dataModel.headers} rows={o.dataModel.rows} />
          </CollapsibleSection>
        )}

        {o.roi && (
          <CollapsibleSection title="ROI Breakdown" defaultOpen={true}>
            <div className="opp-roi-grid">
              {o.roi.map((r, i) => (
                <div key={i} className="opp-roi-item">
                  <div className="opp-roi-label">{r.label}</div>
                  <div className="opp-roi-value" style={{ color: r.positive ? '#16a34a' : '#dc2626' }}>{r.value}</div>
                  {r.note && <div className="opp-roi-note">{r.note}</div>}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {o.integrations && (
          <CollapsibleSection title="Integration Points">
            <div className="opp-integrations">
              {o.integrations.map((ig, i) => (
                <div key={i} className="opp-integration-card">
                  <div className="opp-integration-name">{ig.name}</div>
                  <div className="opp-integration-desc">{ig.desc}</div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {o.risks && (
          <CollapsibleSection title="Risks & Considerations">
            <ul className="opp-bullet-list opp-risk-list">
              {o.risks.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}
