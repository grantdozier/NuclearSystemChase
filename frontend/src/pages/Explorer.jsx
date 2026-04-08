import { useState, useEffect } from 'react';
import { directoryApi } from '../services/api';
import TreeView from '../components/TreeView';

export default function Explorer() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTree();
  }, []);

  async function loadTree() {
    setLoading(true);
    try {
      const res = await directoryApi.getTree();
      setTree(res.data);
    } catch (err) {
      console.error('Failed to load directory tree:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRescan() {
    await directoryApi.rescan();
    loadTree();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>File Explorer</h2>
        <button className="btn btn-secondary" onClick={handleRescan}>Refresh</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading directory tree...</div>
        ) : (
          <TreeView tree={tree} />
        )}
      </div>
    </div>
  );
}
