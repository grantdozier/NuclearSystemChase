import { useState, useEffect } from 'react';
import { settingsApi, directoryApi } from '../services/api';

export default function Settings() {
  const [rootPath, setRootPath] = useState('');
  const [label, setLabel] = useState('Projects');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

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
            <p><strong>Configured:</strong> {status.isConfigured ? 'Yes' : 'No'}</p>
            <p><strong>Root Path:</strong> {status.rootPath || '(not set)'}</p>
            <p><strong>Last Scan:</strong> {status.lastScan ? new Date(status.lastScan).toLocaleString() : 'Never'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
