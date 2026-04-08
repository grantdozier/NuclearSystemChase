import { useNavigate } from 'react-router-dom';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf': return 'pdf';
    case 'doc':
    case 'docx': return 'doc';
    case 'xls':
    case 'xlsx': return 'xls';
    case 'zip':
    case 'rar': return 'zip';
    case 'jpg':
    case 'jpeg':
    case 'png': return 'img';
    default: return 'file';
  }
}

const fileTypeColors = {
  pdf: '#ef4444',
  doc: '#3b82f6',
  xls: '#22c55e',
  zip: '#f59e0b',
  img: '#8b5cf6',
  file: '#6b7280',
};

export default function ActivityFeed({ activities, limit = 15 }) {
  const navigate = useNavigate();
  const items = (activities || []).slice(0, limit);

  if (items.length === 0) {
    return <div className="empty-state">No recent activity.</div>;
  }

  return (
    <div className="activity-feed">
      {items.map((item, idx) => {
        const fileType = getFileIcon(item.fileName);
        const color = fileTypeColors[fileType];
        return (
          <div
            key={`${item.projectId}-${item.fileName}-${idx}`}
            className="activity-item"
            onClick={() => navigate(`/projects/${item.projectId}`)}
          >
            <div className="activity-icon" style={{ backgroundColor: color + '20', color }}>
              <span className="activity-file-type">{fileType.toUpperCase()}</span>
            </div>
            <div className="activity-content">
              <div className="activity-file-name">{item.fileName}</div>
              <div className="activity-meta">
                <span className="activity-project">{item.projectName}</span>
                {item.size > 0 && (
                  <span className="activity-size">{formatSize(item.size)}</span>
                )}
              </div>
            </div>
            <div className="activity-time">{timeAgo(item.modified)}</div>
          </div>
        );
      })}
    </div>
  );
}
