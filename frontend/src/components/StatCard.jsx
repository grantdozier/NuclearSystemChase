/**
 * Pipeline summary stat card — clickable to filter projects by status.
 */
export default function StatCard({ label, count, color, active, onClick }) {
  return (
    <button
      className={`stat-card stat-card-clickable ${active ? 'stat-card-active' : ''}`}
      style={active ? { borderColor: color, borderWidth: 2 } : {}}
      onClick={onClick}
      type="button"
    >
      <div className="stat-number" style={color ? { color } : {}}>
        {count}
      </div>
      <div className="stat-label">{label}</div>
    </button>
  );
}
