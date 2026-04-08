import { useNavigate } from 'react-router-dom';
import { PHASES, evaluateProjectProtocol, getPhaseStatus } from '../data/protocolConfig';

/**
 * Status cell component for the protocol grid
 */
function StatusCell({ status }) {
  const configs = {
    complete: { symbol: '\u2713', className: 'protocol-cell-complete', title: 'Evidence found' },
    partial: { symbol: '!', className: 'protocol-cell-partial', title: 'Partial evidence' },
    missing: { symbol: '\u2717', className: 'protocol-cell-missing', title: 'No evidence' },
    na: { symbol: '\u2014', className: 'protocol-cell-na', title: 'Not applicable yet' },
  };
  const config = configs[status] || configs.na;

  return (
    <td className={`protocol-cell ${config.className}`} title={config.title}>
      <span className="protocol-cell-symbol">{config.symbol}</span>
    </td>
  );
}

/**
 * Per-project protocol compliance grid.
 * Rows = active projects, Columns = construction phases.
 * Each cell shows completion status based on folder evidence.
 */
export default function ProtocolGrid({ projects }) {
  const navigate = useNavigate();

  if (!projects || projects.length === 0) {
    return <div className="empty-state">No active projects to display.</div>;
  }

  const projectEvals = projects.map(project => ({
    project,
    protocol: evaluateProjectProtocol(project),
  }));

  return (
    <div className="protocol-grid-wrapper">
      <table className="protocol-grid">
        <thead>
          <tr>
            <th className="protocol-grid-project-header">Project</th>
            {PHASES.map(phase => (
              <th key={phase.id} className="protocol-grid-phase-header">
                <div className="phase-header-content" style={{ borderBottomColor: phase.color }}>
                  <span className="phase-header-number">{phase.number}</span>
                  <span className="phase-header-name">{phase.shortName}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projectEvals.map(({ project, protocol }) => (
            <tr key={project.id} className="protocol-grid-row" onClick={() => navigate(`/projects/${project.id}`)}>
              <td className="protocol-grid-project-name">
                {project.number && (
                  <span className="project-number-badge-sm">{project.number}</span>
                )}
                <span>{project.displayName || project.name}</span>
              </td>
              {PHASES.map(phase => {
                const phaseResult = protocol[phase.id];
                const status = getPhaseStatus(phaseResult);
                return <StatusCell key={phase.id} status={status} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
