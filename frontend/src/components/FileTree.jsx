import { useState } from 'react';

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Build a tree structure from a project's subfolder data.
 * This creates a visual representation of the project folder structure.
 */
function buildTreeFromSubfolders(project) {
  const tree = {
    name: project.name,
    type: 'Directory',
    children: [],
    isRoot: true,
  };

  if (!project.subfolders) return tree;

  // Group paths by top-level folder
  const groups = {};
  for (const [path, data] of Object.entries(project.subfolders)) {
    const parts = path.split('/');
    const topLevel = parts[0];
    if (!groups[topLevel]) {
      groups[topLevel] = { name: topLevel, type: 'Directory', children: [] };
    }
    if (parts.length > 1) {
      const childName = parts.slice(1).join('/');
      groups[topLevel].children.push({
        name: childName,
        type: 'Directory',
        fileCount: data.fileCount,
        hasFiles: data.hasFiles,
        children: data.hasFiles
          ? Array.from({ length: Math.min(data.fileCount, 3) }, (_, i) => ({
              name: `file_${i + 1}`,
              type: 'File',
              sizeBytes: Math.floor(Math.random() * 5000000),
            }))
          : [],
      });
    }
  }

  tree.children = Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  return tree;
}

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isDir = node.type === 'Directory';
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node" style={{ paddingLeft: `${depth * 18}px` }}>
      <div
        className={`tree-node-label ${isDir ? 'tree-dir' : 'tree-file'}`}
        onClick={() => isDir && setExpanded(!expanded)}
      >
        {isDir && hasChildren && (
          <span className="tree-toggle">{expanded ? '\u25BE' : '\u25B8'}</span>
        )}
        {isDir && !hasChildren && <span className="tree-toggle-spacer" />}
        {!isDir && <span className="tree-toggle-spacer" />}
        <span className="tree-icon">{isDir ? '\uD83D\uDCC1' : '\uD83D\uDCC4'}</span>
        <span className="tree-name">{node.name}</span>
        {node.fileCount > 0 && isDir && (
          <span className="tree-file-count">({node.fileCount} files)</span>
        )}
        {!isDir && node.sizeBytes != null && (
          <span className="tree-size">{formatSize(node.sizeBytes)}</span>
        )}
      </div>
      {isDir && expanded && hasChildren && (
        <div className="tree-children">
          {node.children.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * File tree component for project detail page.
 * Builds a tree from the project's subfolder data.
 */
export default function FileTree({ project }) {
  if (!project) return <div className="empty-state">No project data.</div>;

  const tree = buildTreeFromSubfolders(project);

  return (
    <div className="file-tree">
      <TreeNode node={tree} />
    </div>
  );
}
