import ProjectCard from './ProjectCard';

const STAGE_CONFIG = [
  { key: 'Lead', label: 'LEADS', color: '#8b5cf6' },
  { key: 'Estimating', label: 'ESTIMATING', color: '#f59e0b' },
  { key: 'Active', label: 'ACTIVE', color: '#3b82f6' },
  { key: 'Punch List', label: 'PUNCH LIST', color: '#f97316' },
  { key: 'Complete', label: 'COMPLETE', color: '#22c55e' },
];

export default function KanbanBoard({ projectsByStage, filterStatus }) {
  const stages = filterStatus
    ? STAGE_CONFIG.filter(s => s.key === filterStatus)
    : STAGE_CONFIG;

  return (
    <div className="kanban-board">
      {stages.map(stage => {
        const projects = projectsByStage[stage.key] || [];
        return (
          <div key={stage.key} className="kanban-column">
            <div className="kanban-column-header" style={{ borderTopColor: stage.color }}>
              <span className="kanban-column-title">{stage.label}</span>
              <span className="kanban-column-count">{projects.length}</span>
            </div>
            <div className="kanban-column-body">
              {projects.length === 0 ? (
                <div className="kanban-empty">No projects</div>
              ) : (
                projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
