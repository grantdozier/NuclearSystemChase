import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import KanbanBoard from '../components/KanbanBoard';
import ActivityFeed from '../components/ActivityFeed';
import { dataService } from '../services/api';

const STAT_CARDS = [
  { key: 'total', label: 'Total Projects', color: '#374151', filterKey: null },
  { key: 'Lead', label: 'Leads', color: '#8b5cf6', filterKey: 'Lead' },
  { key: 'Estimating', label: 'Estimating', color: '#f59e0b', filterKey: 'Estimating' },
  { key: 'Active', label: 'Active', color: '#3b82f6', filterKey: 'Active' },
  { key: 'Punch List', label: 'Punch List', color: '#f97316', filterKey: 'Punch List' },
  { key: 'Complete', label: 'Complete', color: '#22c55e', filterKey: 'Complete' },
];

export default function OperationsDashboard() {
  const [counts, setCounts] = useState({});
  const [projectsByStage, setProjectsByStage] = useState({});
  const [activities, setActivities] = useState([]);
  const [filterStatus, setFilterStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [countsData, stageData, activityData, statusData] = await Promise.all([
        dataService.getProjectCounts(),
        dataService.getProjectsByStage(),
        dataService.getActivityFeed(20),
        dataService.getDirectoryStatus(),
      ]);
      setCounts(countsData);
      setProjectsByStage(stageData);
      setActivities(activityData);
      setScanning(statusData?.isScanning === true);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleStatClick(filterKey) {
    setFilterStatus(prev => prev === filterKey ? null : filterKey);
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <div className="page-header">
        <h2>Operations Dashboard</h2>
        <button className="btn btn-secondary" onClick={loadData}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      {scanning && (
        <div className="scan-banner">
          Syncing with SharePoint — live data loading...
        </div>
      )}

      {/* Pipeline Summary */}
      <section className="dashboard-section">
        <div className="stats-grid stats-grid-6">
          {STAT_CARDS.map(card => (
            <StatCard
              key={card.key}
              label={card.label}
              count={counts[card.key] || 0}
              color={card.color}
              active={filterStatus === card.filterKey}
              onClick={() => handleStatClick(card.filterKey)}
            />
          ))}
        </div>
      </section>

      {/* Project Pipeline Kanban */}
      <section className="dashboard-section">
        <div className="section-header">
          <h3>Project Pipeline</h3>
          {filterStatus && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setFilterStatus(null)}
            >
              Clear Filter
            </button>
          )}
        </div>
        <KanbanBoard projectsByStage={projectsByStage} filterStatus={filterStatus} />
      </section>

      {/* Recent Activity Feed */}
      <section className="dashboard-section">
        <div className="card">
          <h3>Recent Activity</h3>
          <ActivityFeed activities={activities} limit={15} />
        </div>
      </section>
    </div>
  );
}
