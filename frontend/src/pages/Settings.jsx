import { useState, useEffect } from 'react';
import { settingsApi, directoryApi, adminApi } from '../services/api';

export default function Settings() {
  const [rootPath, setRootPath] = useState('');
  const [label, setLabel] = useState('Projects');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [serverAction, setServerAction] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const [settingsRes, statusRes] = await Promise.all([
        settingsApi.get(),
        directoryApi.getStatus(),
      ]);
      setRootPath(settingsRes.data.rootPath || '');
      setLabel(settingsRes.data.label || 'Projects');
      setStatus(statusRes.data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await settingsApi.updateRootPath(rootPath, label);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data || 'Failed to save settings.');
    }
  }

  async function handleRescan() {
    setServerAction('Scanning SharePoint...');
    try {
      const res = await adminApi.rescan();
      setServerAction(`Done — ${res.data.projects} projects loaded.`);
      await loadSettings();
    } catch {
      setServerAction('Rescan failed. Check backend logs.');
    }
  }

  async function handleRestart() {
    if (!window.confirm('Restart the backend server? The page will need a refresh in a few seconds.')) return;
    setServerAction('Restarting...');
    try {
      const res = await adminApi.restart();
      setServerAction(res.data.message);
    } catch {
      setServerAction('Restart signal sent — refresh in a moment.');
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h2>Settings</h2>

      <div className="card">
        <h3>Watched Directory</h3>
        <p className="settings-desc">
          Set the root directory path to your SharePoint/shared drive folder.
          The CRM will scan this directory and display projects based on the folder structure.
        </p>

        <form onSubmit={handleSave} className="settings-form">
          <div className="form-group">
            <label htmlFor="rootPath">Root Directory Path</label>
            <input
              id="rootPath"
              type="text"
              className="form-input"
              value={rootPath}
              onChange={(e) => setRootPath(e.target.value)}
              placeholder="e.g., C:\Users\...\SharePoint\Company\Projects"
            />
          </div>

          <div className="form-group">
            <label htmlFor="label">Display Label</label>
            <input
              id="label"
              type="text"
              className="form-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Projects"
            />
          </div>

          <button type="submit" className="btn btn-primary">Save Settings</button>
        </form>

        {message && <div className="settings-message">{message}</div>}

        {status && (
          <div className="status-info">
            <h4>Current Status</h4>
            <p><strong>Source:</strong> {status.source || 'SharePoint Graph API'}</p>
            <p><strong>Configured:</strong> {status.isConfigured ? 'Yes' : 'No'}</p>
            <p><strong>Scanning:</strong> {status.isScanning ? 'Yes — in progress' : 'No'}</p>
            <p><strong>Last Scan:</strong> {status.lastScan && status.lastScan !== '0001-01-01T00:00:00Z'
              ? new Date(status.lastScan).toLocaleString() : 'Not yet'}</p>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <h3>Server Controls</h3>
        <p className="settings-desc">
          Use these if projects aren't loading or the backend needs a kick.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleRescan}>
            Rescan SharePoint
          </button>
          <button className="btn btn-danger" onClick={handleRestart}>
            Restart Backend
          </button>
        </div>

        {serverAction && (
          <div className="settings-message" style={{ marginTop: '12px' }}>
            {serverAction}
          </div>
        )}
      </div>
    </div>
  );
}
