import { PHASES } from '../data/protocolConfig';

/**
 * Horizontal phase progress stepper for the Protocols dashboard.
 * Shows 8 construction phases with completion status.
 */
export default function ProtocolStepper({ phaseData, selectedPhase, onSelectPhase }) {
  return (
    <div className="protocol-stepper">
      {PHASES.map((phase) => {
        const data = phaseData ? phaseData[phase.id] : null;
        const applicable = data ? data.total - data.na : 0;
        const completionPct = applicable > 0
          ? Math.round(((data.complete + data.partial * 0.5) / applicable) * 100)
          : 0;
        const isSelected = selectedPhase === phase.id;

        return (
          <button
            key={phase.id}
            className={`stepper-phase ${isSelected ? 'stepper-phase-selected' : ''}`}
            onClick={() => onSelectPhase(isSelected ? null : phase.id)}
            type="button"
          >
            <div className="stepper-phase-number" style={{ backgroundColor: phase.color }}>
              {phase.number}
            </div>
            <div className="stepper-phase-info">
              <div className="stepper-phase-name">{phase.shortName}</div>
              {data && (
                <div className="stepper-phase-bar">
                  <div
                    className="stepper-phase-fill"
                    style={{ width: `${completionPct}%`, backgroundColor: phase.color }}
                  />
                </div>
              )}
              {data && (
                <div className="stepper-phase-pct">{completionPct}%</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
