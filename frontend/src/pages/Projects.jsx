import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { dataService } from '../services/api';

const STATUS_OPTIONS = ['All', 'Lead', 'Estimating', 'Active', 'Punch List', 'Complete'];

function formatSize(bytes) {
  if (!bytes) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [sortDir, setSortDir] = useState('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await dataService.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  }

  const filtered = projects
    .filter(p => filter === 'All' || p.status === filter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name': aVal = a.name; bVal = b.name; break;
        case 'status': aVal = a.status; bVal = b.status; break;
        case 'fileCount': aVal = a.fileCount; bVal = b.fileCount; break;
        case 'totalSizeBytes': aVal = a.totalSizeBytes; bVal = b.totalSizeBytes; break;
        case 'lastModified':
        default: aVal = new Date(a.lastModified); bVal = new Date(b.lastModified); break;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  function SortHeader({ field, children }) {
    const isActive = sortBy === field;
    return (
      <th
        className="table-sort-header"
        onClick={() => handleSort(field)}
      >
        {children}
        {isActive && (
          <span className="sort-indicator">{sortDir === 'asc' ? ' \u25B4' : ' \u25BE'}</span>
        )}
      </th>
    );
  }

  return (
    <div className="page page-wide">
      <div className="page-header">
        <h2>Projects</h2>
        <span className="page-header-count">{filtered.length} projects</span>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="status-filters">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              className={`btn btn-filter ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No projects found matching your criteria.</div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <SortHeader field="name">Project</SortHeader>
                <SortHeader field="status">Status</SortHeader>
                <SortHeader field="fileCount">Files</SortHeader>
                <th>Folders</th>
                <SortHeader field="totalSizeBytes">Size</SortHeader>
                <SortHeader field="lastModified">Last Modified</SortHeader>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="table-row-clickable"
                  onClick={() => navigate(`/projects/${p.id}`)}
                >
                  <td>
                    <div className="project-name-cell">
                      {p.number && <span className="project-number-badge-sm">{p.number}</span>}
                      <span>{p.displayName || p.name}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p.fileCount?.toLocaleString()}</td>
                  <td>{p.subfolderCount}</td>
                  <td>{formatSize(p.totalSizeBytes)}</td>
                  <td>
                    <span title={new Date(p.lastModified).toLocaleString()}>
                      {timeAgo(p.lastModified)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
