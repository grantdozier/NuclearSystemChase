import { useState } from 'react';
import { PHASES, SOP_STEPS, evaluateProjectProtocol } from '../data/protocolConfig';

const evidenceLabels = {
  complete: 'Evidence Found',
  partial: 'Partial',
  missing: 'Missing',
  na: 'N/A',
};

const evidenceIcons = {
  complete: '\u2713',
  partial: '!',
  missing: '\u2717',
  na: '\u2014',
};

/**
 * Full SOP construction sequence checklist.
 * Groups 157 steps by phase and shows evidence status for selected project.
 */
export default function SOPChecklist({ projects, selectedProjectId }) {
  const [expandedPhases, setExpandedPhases] = useState(
    Object.fromEntries(PHASES.map(p => [p.id, true]))
  );
  const [filterEvidence, setFilterEvidence] = useState('all');

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const protocol = selectedProject ? evaluateProjectProtocol(selectedProject) : null;

  function togglePhase(phaseId) {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  }

  function getStepsByPhase(phaseId) {
    const steps = SOP_STEPS.filter(s => s.phaseId === phaseId);
    if (!protocol) return steps.map(s => ({ ...s, evidence: 'na' }));

    const phaseResult = protocol[phaseId];
    return phaseResult.steps.filter(step => {
      if (filterEvidence === 'all') return true;
      return step.evidence === filterEvidence;
    });
  }

  return (
    <div className="sop-checklist">
      <div className="sop-checklist-header">
        <h3>SOP Construction Sequence ({SOP_STEPS.length} Steps)</h3>
        <div className="sop-filter-bar">
          <span className="sop-filter-label">Show:</span>
          {['all', 'complete', 'partial', 'missing'].map(f => (
            <button
              key={f}
              className={`btn btn-filter ${filterEvidence === f ? 'active' : ''}`}
              onClick={() => setFilterEvidence(f)}
              type="button"
            >
              {f === 'all' ? 'All' : evidenceLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {!selectedProject && (
        <div className="sop-no-project">
          Select a project above to see evidence status for each step.
        </div>
      )}

      <div className="sop-phases">
        {PHASES.map(phase => {
          const steps = getStepsByPhase(phase.id);
          const isExpanded = expandedPhases[phase.id];
          const phaseResult = protocol ? protocol[phase.id] : null;
          const applicable = phaseResult ? phaseResult.total - phaseResult.na : 0;
          const completePct = applicable > 0
            ? Math.round(((phaseResult.complete + phaseResult.partial * 0.5) / applicable) * 100)
            : 0;

          return (
            <div key={phase.id} className="sop-phase-group">
              <button
                className="sop-phase-header"
                onClick={() => togglePhase(phase.id)}
                type="button"
              >
                <span className="sop-phase-toggle">{isExpanded ? '\u25BE' : '\u25B8'}</span>
                <span className="sop-phase-number" style={{ backgroundColor: phase.color }}>
                  {phase.number}
                </span>
                <span className="sop-phase-name">{phase.name}</span>
                <span className="sop-phase-description">{phase.description}</span>
                {phaseResult && (
                  <span className="sop-phase-stats">
                    <span className="sop-phase-pct">{completePct}%</span>
                    <span className="sop-phase-counts">
                      ({phaseResult.complete}/{applicable} complete)
                    </span>
                  </span>
                )}
                <span className="sop-phase-step-count">{steps.length} steps</span>
              </button>

              {isExpanded && (
                <div className="sop-steps-list">
                  {steps.length === 0 ? (
                    <div className="sop-empty">No steps match the current filter.</div>
                  ) : (
                    steps.map(step => (
                      <div key={step.id} className={`sop-step sop-step-${step.evidence}`}>
                        <span className="sop-step-number">#{step.step}</span>
                        <span className="sop-step-name">{step.name}</span>
                        <span className={`sop-step-evidence sop-evidence-${step.evidence}`}>
                          <span className="sop-evidence-icon">{evidenceIcons[step.evidence]}</span>
                          {evidenceLabels[step.evidence]}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
