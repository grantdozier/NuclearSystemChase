import { useState, useEffect } from 'react';
import ProtocolStepper from '../components/ProtocolStepper';
import ProtocolGrid from '../components/ProtocolGrid';
import SOPChecklist from '../components/SOPChecklist';
import { dataService } from '../services/api';
import { evaluateProjectProtocol, PHASES, getPhaseCompletionPercent } from '../data/protocolConfig';

export default function ProtocolsDashboard() {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const all = await dataService.getAllProjects();
      setAllProjects(all);
      // For protocols, primarily show active projects (but allow viewing others)
      const active = all.filter(p => p.status === 'Active');
      setProjects(active);
      if (active.length > 0 && !selectedProjectId) {
        setSelectedProjectId(active[0].id);
      }
    } catch (err) {
      console.error('Failed to load protocol data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Compute aggregate phase data across all active projects
  const aggregatePhaseData = (() => {
    if (projects.length === 0) return null;
    const aggregate = {};
    for (const phase of PHASES) {
      aggregate[phase.id] = { total: 0, complete: 0, partial: 0, missing: 0, na: 0 };
    }
    for (const project of projects) {
      const protocol = evaluateProjectProtocol(project);
      for (const phase of PHASES) {
        const pd = protocol[phase.id];
        aggregate[phase.id].total += pd.total;
        aggregate[phase.id].complete += pd.complete;
        aggregate[phase.id].partial += pd.partial;
        aggregate[phase.id].missing += pd.missing;
        aggregate[phase.id].na += pd.na;
      }
    }
    return aggregate;
  })();

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading protocols...</div>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <div className="page-header">
        <h2>Protocols Dashboard</h2>
        <div className="page-header-subtitle">
          SOP Construction Sequence Compliance
        </div>
      </div>

      {/* Phase Overview Stepper */}
      <section className="dashboard-section">
        <div className="card">
          <h3>Construction Phase Overview</h3>
          <p className="section-description">
            Aggregate compliance across {projects.length} active projects. Click a phase to filter.
          </p>
          <ProtocolStepper
            phaseData={aggregatePhaseData}
            selectedPhase={selectedPhase}
            onSelectPhase={setSelectedPhase}
          />
        </div>
      </section>

      {/* Per-Project Protocol Grid */}
      <section className="dashboard-section">
        <div className="card">
          <h3>Per-Project Protocol Compliance</h3>
          <p className="section-description">
            Each cell shows evidence status based on project folder contents.
            Green = evidence found, Yellow = partial, Red = missing, Gray = N/A.
          </p>
          <ProtocolGrid projects={projects} />
        </div>
      </section>

      {/* SOP Checklist Viewer */}
      <section className="dashboard-section">
        <div className="card">
          <div className="sop-project-selector">
            <label htmlFor="sop-project-select">View SOP for project:</label>
            <select
              id="sop-project-select"
              className="form-input sop-select"
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value || null)}
            >
              <option value="">-- Select a project --</option>
              <optgroup label="Active Projects">
                {allProjects.filter(p => p.status === 'Active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
              <optgroup label="Estimating">
                {allProjects.filter(p => p.status === 'Estimating').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
              <optgroup label="Complete">
                {allProjects.filter(p => p.status === 'Complete').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <SOPChecklist projects={allProjects} selectedProjectId={selectedProjectId} />
        </div>
      </section>
    </div>
  );
}
