import { useState, useEffect, useCallback } from 'react'
import { emailApi } from '../services/api'

const TAG_STYLE = {
  priority: { background: '#3d1a1a', color: '#f85149' },
  budget:   { background: '#2a2012', color: '#d29922' },
  schedule: { background: '#0d2a1a', color: '#3fb950' },
  unmatched:{ background: '#1c2128', color: '#8b949e' },
}

function TagBadge({ tag }) {
  const style = TAG_STYLE[tag] || TAG_STYLE.unmatched
  return (
    <span style={{
      ...style,
      borderRadius: 4,
      padding: '1px 6px',
      fontSize: 11,
      fontWeight: 600,
      marginRight: 4,
      display: 'inline-block',
    }}>{tag}</span>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '14px 18px',
      minWidth: 120,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent || 'var(--text)' }}>{value ?? '—'}</div>
    </div>
  )
}

function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      marginBottom: 10,
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{project.name}</span>
        {project.priorityCount > 0 && <TagBadge tag="priority" />}
        {project.budgetCount > 0 && <TagBadge tag="budget" />}
        {project.scheduleCount > 0 && <TagBadge tag="schedule" />}
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {project.totalEmails} email{project.totalEmails !== 1 ? 's' : ''}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {project.recentEmails?.length === 0 && (
            <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
              No emails in last run
            </div>
          )}
          {project.recentEmails?.map(email => (
            <div key={email.id} style={{
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
              fontSize: 13,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 500, flex: 1 }}>{email.subject}</span>
                {email.tags?.map(t => <TagBadge key={t} tag={t} />)}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>
                {email.sender} · {email.received ? email.received.slice(0, 16).replace('T', ' ') : ''}
                {email.hasAttachments && ' · 📎'}
              </div>
              {email.summary && (
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{email.summary}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Email() {
  const [status, setStatus] = useState(null)
  const [history, setHistory] = useState([])
  const [running, setRunning] = useState(false)
  const [runMsg, setRunMsg] = useState('')
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      const [s, h] = await Promise.all([emailApi.getStatus(), emailApi.getHistory()])
      setStatus(s.data)
      setHistory(h.data)
      setError(null)
    } catch (e) {
      setError('Could not reach the backend — make sure the backend is running.')
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [load])

  async function runNow() {
    setRunning(true)
    setRunMsg('Running…')
    try {
      const r = await emailApi.runNow()
      const d = r.data
      setRunMsg(d.error
        ? `✗ ${d.error}`
        : `✓ Done — ${d.fetched} fetched, ${d.classified} classified`)
      load()
    } catch {
      setRunMsg('✗ Request failed')
    }
    setRunning(false)
  }

  const lr = status?.lastRun

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Email Intelligence</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Pulls Derek's inbox daily, classifies by project, and surfaces action items.
        </p>
      </div>

      {error && (
        <div style={{
          background: '#3d1a1a',
          border: '1px solid #f85149',
          borderRadius: 6,
          padding: '10px 14px',
          marginBottom: 16,
          color: '#f85149',
          fontSize: 13,
        }}>{error}</div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Scheduler" value={status?.schedulerRunning ? 'Active' : 'Stopped'}
          accent={status?.schedulerRunning ? '#3fb950' : '#f85149'} />
        <StatCard label="Last Run" value={lr?.startedAt ? lr.startedAt.slice(0, 16).replace('T', ' ') : 'Never'} />
        <StatCard label="Fetched" value={lr?.fetched} />
        <StatCard label="Classified" value={lr?.classified} />
        <StatCard label="Unmatched" value={lr?.unmatched} />
        <StatCard label="Next Run (UTC)"
          value={status?.nextRunUtc ? status.nextRunUtc.slice(11, 16) : '—'} />
      </div>

      {lr?.error && (
        <div style={{
          background: '#3d1a1a', border: '1px solid #f85149', borderRadius: 6,
          padding: '8px 14px', marginBottom: 16, color: '#f85149', fontSize: 13,
        }}>Last run error: {lr.error}</div>
      )}

      {/* Run Now */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={runNow}
          disabled={running}
          style={{
            background: '#238636',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            fontWeight: 600,
            cursor: running ? 'default' : 'pointer',
            opacity: running ? 0.6 : 1,
            fontSize: 13,
          }}
        >
          {running ? 'Running…' : 'Run Now'}
        </button>
        {runMsg && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{runMsg}</span>}
      </div>

      {/* Project summaries */}
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Projects
      </h3>
      {status?.projects?.length > 0
        ? status.projects.map(p => <ProjectCard key={p.slug} project={p} />)
        : <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No project data yet — click Run Now.</div>
      }

      {/* Run History */}
      <h3 style={{ fontSize: 14, fontWeight: 600, margin: '24px 0 12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Run History
      </h3>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Started', 'Fetched', 'Classified', 'Unmatched', 'Duration', 'Result'].map(h => (
                <th key={h} style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  fontSize: 12,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 20, color: 'var(--text-muted)', textAlign: 'center' }}>No runs yet</td></tr>
            )}
            {history.slice(0, 20).map((run, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 12px' }}>{run.startedAt?.slice(0, 16).replace('T', ' ')}</td>
                <td style={{ padding: '8px 12px' }}>{run.fetched ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>{run.classified ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>{run.unmatched ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>
                  {run.durationSeconds != null ? `${run.durationSeconds.toFixed(1)}s` : '—'}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  {run.error
                    ? <span style={{ color: '#f85149' }}>✗ {run.error.slice(0, 50)}</span>
                    : <span style={{ color: '#3fb950' }}>✓ OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
