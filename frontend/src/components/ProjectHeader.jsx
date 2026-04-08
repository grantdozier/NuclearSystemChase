import StatusBadge from './StatusBadge';

function formatSize(bytes) {
  if (!bytes) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Project detail page header with name, number, status, and key stats.
 */
export default function ProjectHeader({ project }) {
  const match = project.name.match(/^(\d{2}-\d{3})\s+(.+)$/);
  const number = match ? match[1] : null;
  const displayName = match ? match[2] : project.name;

  return (
    <div className="project-detail-header">
      <div className="project-detail-title-row">
        <div className="project-detail-title">
          {number && <span className="project-number-badge-lg">{number}</span>}
          <h2>{displayName}</h2>
        </div>
        <div className="project-detail-badges">
          <StatusBadge status={project.status} />
          {project.lifecyclePhase && (
            <span className="lifecycle-badge">{project.lifecyclePhase}</span>
          )}
        </div>
      </div>
      <div className="project-detail-stats">
        <div className="project-detail-stat">
          <span className="project-detail-stat-value">{project.fileCount?.toLocaleString()}</span>
          <span className="project-detail-stat-label">Files</span>
        </div>
        <div className="project-detail-stat">
          <span className="project-detail-stat-value">{project.subfolderCount}</span>
          <span className="project-detail-stat-label">Folders</span>
        </div>
        <div className="project-detail-stat">
          <span className="project-detail-stat-value">{formatSize(project.totalSizeBytes)}</span>
          <span className="project-detail-stat-label">Total Size</span>
        </div>
        <div className="project-detail-stat">
          <span className="project-detail-stat-value">
            {new Date(project.lastModified).toLocaleDateString()}
          </span>
          <span className="project-detail-stat-label">Last Modified</span>
        </div>
      </div>
    </div>
  );
}
