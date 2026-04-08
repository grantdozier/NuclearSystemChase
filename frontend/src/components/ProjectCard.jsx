import { useNavigate } from 'react-router-dom';

/**
 * Parse project number and display name from "YY-XXX Name" format
 */
function parseProjectName(name) {
  const match = name.match(/^(\d{2}-\d{3})\s+(.+)$/);
  if (match) {
    return { number: match[1], displayName: match[2] };
  }
  return { number: null, displayName: name };
}

/**
 * Get recency color based on days since last modified
 */
function getRecencyColor(lastModified) {
  const days = Math.floor((Date.now() - new Date(lastModified).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 7) return { color: '#22c55e', label: 'Active', className: 'recency-green' };
  if (days <= 30) return { color: '#f59e0b', label: 'Recent', className: 'recency-yellow' };
  if (days <= 90) return { color: '#f97316', label: 'Aging', className: 'recency-orange' };
  return { color: '#ef4444', label: 'Stale', className: 'recency-red' };
}

/**
 * Format bytes to human-readable size
 */
function formatSize(bytes) {
  if (!bytes) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Format relative time
 */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/**
 * Check health indicators from subfolder data
 */
function findFolder(subfolders, name) {
  if (!subfolders) return null;
  if (subfolders[name]) return subfolders[name];
  const key = Object.keys(subfolders).find(k =>
    k.toLowerCase().includes(name.toLowerCase())
  );
  return key ? subfolders[key] : null;
}

function folderHasContent(folder) {
  if (!folder) return false;
  return (folder.itemCount ?? folder.fileCount ?? 0) > 0 || folder.hasFiles;
}

function getHealthIndicators(subfolders) {
  if (!subfolders) return [];
  const indicators = [];

  const permits = findFolder(subfolders, 'Permits');
  indicators.push(folderHasContent(permits)
    ? { icon: 'P', title: 'Has Permits', present: true }
    : { icon: 'P', title: 'No Permits', present: false });

  const schedules = findFolder(subfolders, 'Project Schedules');
  indicators.push(folderHasContent(schedules)
    ? { icon: 'S', title: 'Has Schedule', present: true }
    : { icon: 'S', title: 'No Schedule', present: false });

  const progressReports = findFolder(subfolders, 'Project Progress Report');
  indicators.push(folderHasContent(progressReports)
    ? { icon: 'R', title: 'Has Reports', present: true }
    : { icon: 'R', title: 'No Reports', present: false });

  const ownerDocs = findFolder(subfolders, 'Owner Documents');
  indicators.push(folderHasContent(ownerDocs)
    ? { icon: 'C', title: 'Has Contract', present: true }
    : { icon: 'C', title: 'No Contract', present: false });

  return indicators;
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { number, displayName } = parseProjectName(project.name);
  const recency = getRecencyColor(project.lastModified);
  const health = getHealthIndicators(project.subfolders);

  function handleClick() {
    navigate(`/projects/${project.id}`);
  }

  return (
    <div className="project-card" onClick={handleClick}>
      <div className="project-card-header">
        {number && <span className="project-number-badge">{number}</span>}
        <span className="project-card-name" title={displayName}>{displayName}</span>
      </div>

      <div className="project-card-meta">
        <span className={`project-card-recency ${recency.className}`} title={`Last modified: ${new Date(project.lastModified).toLocaleDateString()}`}>
          <span className="recency-dot" style={{ backgroundColor: recency.color }} />
          {timeAgo(project.lastModified)}
        </span>
        <span className="project-card-files" title={`${project.fileCount} files, ${formatSize(project.totalSizeBytes)}`}>
          {project.fileCount} files
        </span>
      </div>

      <div className="project-card-health">
        {health.map((h) => (
          <span
            key={h.icon}
            className={`health-indicator ${h.present ? 'health-present' : 'health-missing'}`}
            title={h.title}
          >
            {h.icon}
          </span>
        ))}
      </div>
    </div>
  );
}
