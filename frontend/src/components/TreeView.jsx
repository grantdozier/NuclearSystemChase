import { useState } from 'react';

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isDir = node.type === 'Directory';
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node" style={{ paddingLeft: `${depth * 16}px` }}>
      <div
        className={`tree-node-label ${isDir ? 'tree-dir' : 'tree-file'}`}
        onClick={() => isDir && setExpanded(!expanded)}
      >
        {isDir && hasChildren && (
          <span className="tree-toggle">{expanded ? '▾' : '▸'}</span>
        )}
        {isDir && !hasChildren && <span className="tree-toggle-spacer" />}
        <span className="tree-icon">{isDir ? '📁' : '📄'}</span>
        <span className="tree-name">{node.name}</span>
        {!isDir && node.sizeBytes != null && (
          <span className="tree-size">{formatSize(node.sizeBytes)}</span>
        )}
      </div>
      {isDir && expanded && hasChildren && (
        <div className="tree-children">
          {node.children.map((child, i) => (
            <TreeNode key={child.relativePath || i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function TreeView({ tree }) {
  if (!tree) return <div className="empty-state">No directory data available.</div>;
  return (
    <div className="tree-view">
      <TreeNode node={tree} />
    </div>
  );
}
