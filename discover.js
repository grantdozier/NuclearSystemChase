// Discovery script — traverses SharePoint drives via Microsoft Graph API
// and outputs the full directory tree structure.

const https = require('https');

const TENANT = 'afbb8ea1-0e42-4f9a-b3d8-6fc556a1ea38';
const CLIENT = 'fa421387-d9d8-4e86-94f9-8e3699f63c4b';
const SECRET = process.env.AZURE_CLIENT_SECRET || 'SET_AZURE_CLIENT_SECRET_ENV_VAR';

const DRIVES = [
  {
    label: 'Chase Group Construction - Documents',
    driveId: 'b!WFmgBa44_0e7CzHUkgpUGOL_AiwsYxVPhU6_kzsiXUaAKeeQhdUHRIgmyad_0B4i',
  },
  {
    label: 'CG Executive - Documents',
    driveId: 'b!C58BT38b2E2KRtH1wwFbBDJhod9GPixPqGiN2El4yrHmvZ8UhbSGQYiNvMErOtIQ',
  },
  {
    label: 'CGC Operations Team - Documents',
    driveId: 'b!FAwb4GdXxEmgEMt0l2SDqG0oq7Tlb5JKgqv3UK79slw9iiCupVPISoUQa8uljI6W',
  },
];

const MAX_DEPTH = 4; // How deep to traverse

function httpsRequest(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ error: data }); }
      });
    });
    req.on('error', reject);
  });
}

async function getToken() {
  return new Promise((resolve, reject) => {
    const postData = `client_id=${CLIENT}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=${encodeURIComponent(SECRET)}&grant_type=client_credentials`;
    const options = {
      hostname: 'login.microsoftonline.com',
      path: `/${TENANT}/oauth2/v2.0/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data).access_token); }
        catch { reject(new Error(data)); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function listChildren(token, driveId, itemPath, depth) {
  const url = itemPath
    ? `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/${encodeURI(itemPath)}:/children?$select=name,folder,file,size,lastModifiedDateTime,createdDateTime&$top=200`
    : `https://graph.microsoft.com/v1.0/drives/${driveId}/root/children?$select=name,folder,file,size,lastModifiedDateTime,createdDateTime&$top=200`;

  const result = await httpsRequest(url, { Authorization: `Bearer ${token}` });

  if (result.error) {
    return [{ name: `ERROR: ${JSON.stringify(result.error).substring(0, 100)}`, type: 'error' }];
  }

  const items = result.value || [];
  const output = [];

  for (const item of items) {
    const entry = {
      name: item.name,
      type: item.folder ? 'folder' : 'file',
      size: item.size,
      lastModified: item.lastModifiedDateTime,
      childCount: item.folder ? item.folder.childCount : undefined,
    };

    if (item.folder && depth < MAX_DEPTH && item.folder.childCount > 0) {
      const childPath = itemPath ? `${itemPath}/${item.name}` : item.name;
      entry.children = await listChildren(token, driveId, childPath, depth + 1);
    }

    output.push(entry);
  }

  return output;
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function toMarkdown(items, indent = '') {
  let md = '';
  for (const item of items) {
    if (item.type === 'folder') {
      const count = item.childCount !== undefined ? ` (${item.childCount} items)` : '';
      const size = item.size ? ` [${formatSize(item.size)}]` : '';
      const mod = item.lastModified ? ` — last modified ${item.lastModified.split('T')[0]}` : '';
      md += `${indent}- **${item.name}/**${count}${size}${mod}\n`;
      if (item.children) {
        md += toMarkdown(item.children, indent + '  ');
      }
    } else if (item.type === 'file') {
      const size = item.size ? ` [${formatSize(item.size)}]` : '';
      md += `${indent}- ${item.name}${size}\n`;
    } else {
      md += `${indent}- ${item.name}\n`;
    }
  }
  return md;
}

async function main() {
  console.error('Getting token...');
  const token = await getToken();
  console.error('Token acquired. Starting discovery...\n');

  let md = `# SharePoint Discovery — Chase Group\n\n`;
  md += `> Generated: ${new Date().toISOString().split('T')[0]}\n`;
  md += `> Depth: ${MAX_DEPTH} levels\n\n`;

  for (const drive of DRIVES) {
    console.error(`Scanning: ${drive.label}...`);
    md += `---\n\n## ${drive.label}\n\n`;

    try {
      const items = await listChildren(token, drive.driveId, '', 0);
      md += toMarkdown(items);
    } catch (err) {
      md += `**Error scanning this drive:** ${err.message}\n`;
    }

    md += '\n';
  }

  // Write to file
  const fs = require('fs');
  fs.writeFileSync('discovery.md', md);
  console.error('\nDone! Written to discovery.md');
}

main().catch(console.error);
