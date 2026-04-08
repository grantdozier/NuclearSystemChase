import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectHeader from '../components/ProjectHeader';
import FileTree from '../components/FileTree';
import ActivityFeed from '../components/ActivityFeed';
import { dataService } from '../services/api';
import { PHASES, evaluateProjectProtocol, getPhaseStatus, getPhaseCompletionPercent } from '../data/protocolConfig';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'files', label: 'Files' },
  { id: 'protocol', label: 'Protocol Compliance' },
  { id: 'activity', label: 'Activity' },
];

function formatSize(bytes) {
  if (!bytes) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function OverviewTab({ project, protocol }) {
  // Folder completeness chart
  const subfolderEntries = Object.entries(project.subfolders || {}).filter(
    ([, data]) => data.hasFiles
  );
  const totalFolders = Object.keys(project.subfolders || {}).length;
  const populatedFolders = subfolderEntries.length;
  const completenessPercent = totalFolders > 0
    ? Math.round((populatedFolders / totalFolders) * 100)
    : 0;

  return (
    <div className="project-tab-content">
      <div className="overview-grid">
        {/* Folder Completeness */}
        <div className="card overview-card">
          <h3>Folder Completeness</h3>
          <div className="completeness-chart">
            <div className="completeness-ring">
              <svg viewBox="0 0 120 120" className="completeness-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="var(--primary)"
                  strokeWidth="10"
                  strokeDasharray={`${completenessPercent * 3.14} ${314 - completenessPercent * 3.14}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 60 60)"
                  strokeLinecap="round"
                />
                <text x="60" y="56" textAnchor="middle" className="completeness-pct-text">
                  {completenessPercent}%
                </text>
                <text x="60" y="72" textAnchor="middle" className="completeness-label-text">
                  complete
                </text>
              </svg>
            </div>
            <div className="completeness-detail">
              <p>{populatedFolders} of {totalFolders} folders have files</p>
            </div>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="card overview-card">
          <h3>Protocol Phase Progress</h3>
          <div className="phase-progress-list">
            {PHASES.map(phase => {
              const phaseResult = protocol[phase.id];
              const pct = getPhaseCompletionPercent(phaseResult);
              const status = getPhaseStatus(phaseResult);
              return (
                <div key={phase.id} className="phase-progress-item">
                  <div className="phase-progress-label">
                    <span className="phase-progress-number" style={{ backgroundColor: phase.color }}>
                      {phase.number}
                    </span>
                    <span>{phase.shortName}</span>
                  </div>
                  <div className="phase-progress-bar-container">
                    <div className="phase-progress-bar">
                      <div
                        className="phase-progress-fill"
                        style={{ width: `${pct}%`, backgroundColor: phase.color }}
                      />
                    </div>
                    <span className="phase-progress-pct">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Folders */}
        <div className="card overview-card overview-card-wide">
          <h3>Key Folders Status</h3>
          <div className="key-folders-grid">
            {Object.entries(project.subfolders || {}).map(([path, data]) => (
              <div key={path} className={`key-folder-item ${data.hasFiles ? 'key-folder-populated' : 'key-folder-empty'}`}>
                <span className="key-folder-icon">
                  {data.hasFiles ? '\u2713' : '\u2717'}
                </span>
                <span className="key-folder-name" title={path}>
                  {path.split('/').pop()}
                </span>
                {data.hasFiles && (
                  <span className="key-folder-count">{data.fileCount} files</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtocolTab({ project, protocol }) {
  return (
    <div className="project-tab-content">
      {PHASES.map(phase => {
        const phaseResult = protocol[phase.id];
        const pct = getPhaseCompletionPercent(phaseResult);
        return (
          <div key={phase.id} className="card protocol-phase-card">
            <div className="protocol-phase-header">
              <span className="sop-phase-number" style={{ backgroundColor: phase.color }}>
                {phase.number}
              </span>
              <h3>{phase.name}</h3>
              <span className="protocol-phase-pct">{pct}% complete</span>
            </div>
            <div className="protocol-steps-list">
              {phaseResult.steps.map(step => (
                <div key={step.id} className={`protocol-step-item protocol-step-${step.evidence}`}>
                  <span className={`protocol-step-icon protocol-icon-${step.evidence}`}>
                    {step.evidence === 'complete' ? '\u2713' : step.evidence === 'partial' ? '!' : step.evidence === 'missing' ? '\u2717' : '\u2014'}
                  </span>
                  <span className="protocol-step-num">#{step.step}</span>
                  <span className="protocol-step-name">{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityTab({ project }) {
  const activities = (project.recentFiles || []).map(f => ({
    projectId: project.id,
    projectName: project.name,
    projectNumber: project.number,
    fileName: f.name,
    filePath: f.path + f.name,
    modified: f.modified,
    size: f.size,
    status: project.status,
  }));

  return (
    <div className="project-tab-content">
      <div className="card">
        <h3>Recent File Activity</h3>
        <ActivityFeed activities={activities} limit={50} />
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    setLoading(true);
    try {
      const p = await dataService.getProject(id);
      setProject(p);
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>Project not found</h3>
          <p>The project with ID "{id}" could not be found.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const protocol = evaluateProjectProtocol(project);

  return (
    <div className="page page-wide">
      <div className="project-detail-nav">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <ProjectHeader project={project} />

      {/* Tabs */}
      <div className="project-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`project-tab ${activeTab === tab.id ? 'project-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab project={project} protocol={protocol} />}
      {activeTab === 'files' && (
        <div className="project-tab-content">
          <div className="card">
            <h3>Project File Structure</h3>
            <FileTree project={project} />
          </div>
        </div>
      )}
      {activeTab === 'protocol' && <ProtocolTab project={project} protocol={protocol} />}
      {activeTab === 'activity' && <ActivityTab project={project} />}
    </div>
  );
}
