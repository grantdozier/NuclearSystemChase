const statusColors = {
  Lead: '#8b5cf6',
  Estimating: '#f59e0b',
  Active: '#3b82f6',
  'Punch List': '#f97316',
  'On Hold': '#8b5cf6',
  Complete: '#22c55e',
  InProgress: '#3b82f6',
  Completed: '#22c55e',
  WaitingOn: '#f59e0b',
  OnHold: '#8b5cf6',
  Archived: '#6b7280',
  Unknown: '#9ca3af',
};

const statusLabels = {
  Lead: 'Lead',
  Estimating: 'Estimating',
  Active: 'Active',
  'Punch List': 'Punch List',
  'On Hold': 'On Hold',
  Complete: 'Complete',
  InProgress: 'In Progress',
  Completed: 'Completed',
  WaitingOn: 'Waiting On',
  OnHold: 'On Hold',
  Archived: 'Archived',
  Unknown: 'Unknown',
};

export default function StatusBadge({ status }) {
  const color = statusColors[status] || statusColors.Unknown;
  const label = statusLabels[status] || status;

  return (
    <span
      className="status-badge"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
