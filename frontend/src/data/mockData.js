/**
 * Mock data for Chase Group Construction CRM.
 * Used as fallback when the API is unavailable.
 * Projects follow lifecycle: Leads -> Estimating -> Active -> Punch List -> Complete
 * Numbered YY-XXX (e.g., "24-088 FPK Johnston")
 */

const now = new Date();
function daysAgo(n) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/** Subfolder content flags per project — used by protocol dashboard */
function makeSubfolders(overrides = {}) {
  const defaults = {
    'Owner Documents/Contract Documents': { hasFiles: false, fileCount: 0 },
    'Chase Group': { hasFiles: false, fileCount: 0 },
    'Permits': { hasFiles: false, fileCount: 0 },
    'Subcontractors/03 - CONCRETE': { hasFiles: false, fileCount: 0 },
    'Subcontractors/05 - METALS': { hasFiles: false, fileCount: 0 },
    'Subcontractors/06 - WOOD, PLASTICS, COMP': { hasFiles: false, fileCount: 0 },
    'Subcontractors/07 - THERMAL & MOISTURE PROTECT': { hasFiles: false, fileCount: 0 },
    'Subcontractors/08 - OPENINGS': { hasFiles: false, fileCount: 0 },
    'Subcontractors/09 - FINISHES': { hasFiles: false, fileCount: 0 },
    'Subcontractors/10 - SPECIALTIES': { hasFiles: false, fileCount: 0 },
    'Subcontractors/22 - PLUMBING': { hasFiles: false, fileCount: 0 },
    'Subcontractors/23 - HVAC': { hasFiles: false, fileCount: 0 },
    'Subcontractors/25 - INTEGRATED AUTOMATION': { hasFiles: false, fileCount: 0 },
    'Subcontractors/26 - ELECTRICAL': { hasFiles: false, fileCount: 0 },
    'Subcontractors/27 - COMMUNICATIONS': { hasFiles: false, fileCount: 0 },
    'Subcontractors/28 - ELECTRONIC SAFETY': { hasFiles: false, fileCount: 0 },
    'Subcontractors/31 - EARTHWORK': { hasFiles: false, fileCount: 0 },
    'Project Progress Reports': { hasFiles: false, fileCount: 0 },
    'Warranty': { hasFiles: false, fileCount: 0 },
  };
  const result = { ...defaults };
  for (const [key, val] of Object.entries(overrides)) {
    result[key] = { hasFiles: true, fileCount: val };
  }
  return result;
}

export const MOCK_PROJECTS = [
  // ─── ACTIVE PROJECTS ─────────────────────────────────────────
  {
    id: '24-088',
    number: '24-088',
    name: '24-088 FPK Johnston',
    displayName: 'FPK Johnston',
    status: 'Active',
    lifecyclePhase: 'Active Project',
    lastModified: daysAgo(2),
    fileCount: 1247,
    subfolderCount: 89,
    totalSizeBytes: 4831920128,
    relativePath: 'Active Projects/24-088 FPK Johnston',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 12,
      'Chase Group': 34,
      'Permits': 8,
      'Subcontractors/03 - CONCRETE': 15,
      'Subcontractors/05 - METALS': 7,
      'Subcontractors/06 - WOOD, PLASTICS, COMP': 22,
      'Subcontractors/07 - THERMAL & MOISTURE PROTECT': 5,
      'Subcontractors/08 - OPENINGS': 11,
      'Subcontractors/09 - FINISHES': 18,
      'Subcontractors/10 - SPECIALTIES': 3,
      'Subcontractors/22 - PLUMBING': 9,
      'Subcontractors/23 - HVAC': 14,
      'Subcontractors/26 - ELECTRICAL': 8,
      'Subcontractors/31 - EARTHWORK': 19,
      'Project Progress Reports': 24,
    }),
    recentFiles: [
      { name: 'Progress Report - March 2026.pdf', modified: daysAgo(2), size: 2450000, path: 'Project Progress Reports/' },
      { name: 'RFI-042 Response.pdf', modified: daysAgo(3), size: 890000, path: 'Chase Group/RFIs/' },
      { name: 'CO #7 - Approved.pdf', modified: daysAgo(5), size: 1230000, path: 'Owner Documents/Change Orders/' },
      { name: 'HVAC Submittal Rev2.pdf', modified: daysAgo(6), size: 5670000, path: 'Subcontractors/23 - HVAC/' },
      { name: 'Electrical Panel Schedule.xlsx', modified: daysAgo(8), size: 340000, path: 'Subcontractors/26 - ELECTRICAL/' },
    ],
  },
  {
    id: '24-115',
    number: '24-115',
    name: '24-115 Smash (Bonin Rd.)',
    displayName: 'Smash (Bonin Rd.)',
    status: 'Active',
    lifecyclePhase: 'Active Project',
    lastModified: daysAgo(1),
    fileCount: 892,
    subfolderCount: 76,
    totalSizeBytes: 3241580544,
    relativePath: 'Active Projects/24-115 Smash (Bonin Rd.)',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 8,
      'Chase Group': 21,
      'Permits': 6,
      'Subcontractors/03 - CONCRETE': 11,
      'Subcontractors/05 - METALS': 9,
      'Subcontractors/06 - WOOD, PLASTICS, COMP': 16,
      'Subcontractors/07 - THERMAL & MOISTURE PROTECT': 4,
      'Subcontractors/09 - FINISHES': 7,
      'Subcontractors/22 - PLUMBING': 8,
      'Subcontractors/23 - HVAC': 10,
      'Subcontractors/26 - ELECTRICAL': 6,
      'Subcontractors/31 - EARTHWORK': 14,
      'Project Progress Reports': 18,
    }),
    recentFiles: [
      { name: 'Daily Log 03-17-26.pdf', modified: daysAgo(1), size: 450000, path: 'Chase Group/Daily Logs/' },
      { name: 'Framing Inspection Report.pdf', modified: daysAgo(3), size: 1870000, path: 'Permits/' },
      { name: 'Plumbing Top-Out Photos.zip', modified: daysAgo(4), size: 45000000, path: 'Subcontractors/22 - PLUMBING/' },
    ],
  },
  {
    id: '25-105',
    number: '25-105',
    name: '25-105 Gifted Daycare',
    displayName: 'Gifted Daycare',
    status: 'Active',
    lifecyclePhase: 'Active Project',
    lastModified: daysAgo(4),
    fileCount: 534,
    subfolderCount: 62,
    totalSizeBytes: 1892352000,
    relativePath: 'Active Projects/25-105 Gifted Daycare',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 6,
      'Chase Group': 15,
      'Permits': 4,
      'Subcontractors/03 - CONCRETE': 8,
      'Subcontractors/06 - WOOD, PLASTICS, COMP': 12,
      'Subcontractors/22 - PLUMBING': 5,
      'Subcontractors/23 - HVAC': 3,
      'Subcontractors/26 - ELECTRICAL': 4,
      'Subcontractors/31 - EARTHWORK': 10,
      'Project Progress Reports': 8,
    }),
    recentFiles: [
      { name: 'Slab Pour Schedule.xlsx', modified: daysAgo(4), size: 87000, path: 'Subcontractors/03 - CONCRETE/' },
      { name: 'Building Permit.pdf', modified: daysAgo(7), size: 3200000, path: 'Permits/' },
    ],
  },
  {
    id: '25-110',
    number: '25-110',
    name: '25-110 Palmer Parc',
    displayName: 'Palmer Parc',
    status: 'Active',
    lifecyclePhase: 'Active Project',
    lastModified: daysAgo(6),
    fileCount: 312,
    subfolderCount: 55,
    totalSizeBytes: 987654321,
    relativePath: 'Active Projects/25-110 Palmer Parc',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 9,
      'Chase Group': 11,
      'Permits': 5,
      'Subcontractors/03 - CONCRETE': 6,
      'Subcontractors/31 - EARTHWORK': 8,
      'Subcontractors/22 - PLUMBING': 3,
      'Project Progress Reports': 5,
    }),
    recentFiles: [
      { name: 'Earthwork Completion Photos.zip', modified: daysAgo(6), size: 32000000, path: 'Subcontractors/31 - EARTHWORK/' },
      { name: 'Foundation Plan Rev A.pdf', modified: daysAgo(9), size: 8900000, path: 'Chase Group/Plans/' },
    ],
  },
  {
    id: '25-115',
    number: '25-115',
    name: '25-115 2905 Kaliste Saloom',
    displayName: '2905 Kaliste Saloom',
    status: 'Active',
    lifecyclePhase: 'Active Project',
    lastModified: daysAgo(3),
    fileCount: 445,
    subfolderCount: 58,
    totalSizeBytes: 1523456789,
    relativePath: 'Active Projects/25-115 2905 Kaliste Saloom',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 7,
      'Chase Group': 18,
      'Permits': 6,
      'Subcontractors/03 - CONCRETE': 9,
      'Subcontractors/05 - METALS': 5,
      'Subcontractors/06 - WOOD, PLASTICS, COMP': 14,
      'Subcontractors/07 - THERMAL & MOISTURE PROTECT': 3,
      'Subcontractors/22 - PLUMBING': 7,
      'Subcontractors/23 - HVAC': 8,
      'Subcontractors/26 - ELECTRICAL': 5,
      'Subcontractors/31 - EARTHWORK': 11,
      'Project Progress Reports': 12,
    }),
    recentFiles: [
      { name: 'HVAC Rough-In Inspection.pdf', modified: daysAgo(3), size: 1540000, path: 'Subcontractors/23 - HVAC/' },
      { name: 'Progress Photos Week 14.zip', modified: daysAgo(5), size: 67000000, path: 'Project Progress Reports/' },
      { name: 'Permit Amendment.pdf', modified: daysAgo(8), size: 2100000, path: 'Permits/' },
    ],
  },
  {
    id: '25-116',
    number: '25-116',
    name: '25-116 800 E Farrel',
    displayName: '800 E Farrel',
    status: 'Active',
    lifecyclePhase: 'Active Project',
    lastModified: daysAgo(12),
    fileCount: 267,
    subfolderCount: 48,
    totalSizeBytes: 756432100,
    relativePath: 'Active Projects/25-116 800 E Farrel',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 5,
      'Chase Group': 9,
      'Permits': 3,
      'Subcontractors/03 - CONCRETE': 4,
      'Subcontractors/31 - EARTHWORK': 7,
      'Subcontractors/22 - PLUMBING': 2,
      'Project Progress Reports': 4,
    }),
    recentFiles: [
      { name: 'Site Survey Report.pdf', modified: daysAgo(12), size: 4500000, path: 'Chase Group/' },
      { name: 'Concrete Mix Design.pdf', modified: daysAgo(15), size: 890000, path: 'Subcontractors/03 - CONCRETE/' },
    ],
  },
  {
    id: '25-120',
    number: '25-120',
    name: '25-120 Caddy Shack',
    displayName: 'Caddy Shack',
    status: 'Active',
    lifecyclePhase: 'Active Project',
    lastModified: daysAgo(5),
    fileCount: 189,
    subfolderCount: 42,
    totalSizeBytes: 534211890,
    relativePath: 'Active Projects/25-120 Caddy Shack',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 4,
      'Chase Group': 8,
      'Permits': 2,
      'Subcontractors/31 - EARTHWORK': 5,
      'Subcontractors/03 - CONCRETE': 3,
      'Project Progress Reports': 3,
    }),
    recentFiles: [
      { name: 'Grading Plan.pdf', modified: daysAgo(5), size: 6700000, path: 'Subcontractors/31 - EARTHWORK/' },
      { name: 'Pre-Con Meeting Notes.docx', modified: daysAgo(10), size: 234000, path: 'Chase Group/' },
    ],
  },
  {
    id: '26-124',
    number: '26-124',
    name: '26-124 Woodhouse Spa',
    displayName: 'Woodhouse Spa',
    status: 'Active',
    lifecyclePhase: 'Active Project',
    lastModified: daysAgo(1),
    fileCount: 98,
    subfolderCount: 35,
    totalSizeBytes: 267890456,
    relativePath: 'Active Projects/26-124 Woodhouse Spa',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 3,
      'Chase Group': 5,
      'Permits': 2,
      'Subcontractors/31 - EARTHWORK': 2,
      'Project Progress Reports': 1,
    }),
    recentFiles: [
      { name: 'Signed Contract.pdf', modified: daysAgo(1), size: 3400000, path: 'Owner Documents/Contract Documents/' },
      { name: 'Pre-Construction Photos.zip', modified: daysAgo(2), size: 89000000, path: 'Chase Group/' },
    ],
  },

  // ─── ESTIMATING ─────────────────────────────────────────────
  {
    id: '26-125',
    number: '26-125',
    name: "26-125 Roul's Restaurant",
    displayName: "Roul's Restaurant",
    status: 'Estimating',
    lifecyclePhase: 'Estimating',
    lastModified: daysAgo(8),
    fileCount: 45,
    subfolderCount: 12,
    totalSizeBytes: 123456789,
    relativePath: "Estimating/26-125 Roul's Restaurant",
    subfolders: makeSubfolders({
      'Chase Group': 3,
    }),
    recentFiles: [
      { name: 'Bid Package.pdf', modified: daysAgo(8), size: 12000000, path: 'Chase Group/' },
      { name: 'Scope Review Notes.docx', modified: daysAgo(10), size: 56000, path: 'Chase Group/' },
    ],
  },
  {
    id: '25-123',
    number: '25-123',
    name: '25-123 First South Farm Credit',
    displayName: 'First South Farm Credit',
    status: 'Estimating',
    lifecyclePhase: 'Estimating',
    lastModified: daysAgo(15),
    fileCount: 32,
    subfolderCount: 8,
    totalSizeBytes: 89765432,
    relativePath: 'Estimating/25-123 First South Farm Credit',
    subfolders: makeSubfolders({
      'Chase Group': 2,
    }),
    recentFiles: [
      { name: 'Plans Set A.pdf', modified: daysAgo(15), size: 45000000, path: 'Chase Group/' },
      { name: 'Estimate Worksheet.xlsx', modified: daysAgo(18), size: 234000, path: 'Chase Group/' },
    ],
  },
  {
    id: '25-122',
    number: '25-122',
    name: '25-122 Milton Water System',
    displayName: 'Milton Water System',
    status: 'Estimating',
    lifecyclePhase: 'Estimating',
    lastModified: daysAgo(22),
    fileCount: 28,
    subfolderCount: 7,
    totalSizeBytes: 67432100,
    relativePath: 'Estimating/25-122 Milton Water System',
    subfolders: makeSubfolders({
      'Chase Group': 2,
    }),
    recentFiles: [
      { name: 'Invitation to Bid.pdf', modified: daysAgo(22), size: 890000, path: 'Chase Group/' },
    ],
  },

  // ─── LEADS ──────────────────────────────────────────────────
  {
    id: 'lead-001',
    number: null,
    name: 'Dr Burbank',
    displayName: 'Dr Burbank',
    status: 'Lead',
    lifecyclePhase: 'Business Development',
    lastModified: daysAgo(5),
    fileCount: 4,
    subfolderCount: 1,
    totalSizeBytes: 8900000,
    relativePath: 'Business Development/Dr Burbank',
    subfolders: makeSubfolders({}),
    recentFiles: [
      { name: 'Initial Inquiry Notes.docx', modified: daysAgo(5), size: 45000, path: '' },
    ],
  },
  {
    id: 'lead-002',
    number: null,
    name: 'Josh Reaves Dental',
    displayName: 'Josh Reaves Dental',
    status: 'Lead',
    lifecyclePhase: 'Business Development',
    lastModified: daysAgo(14),
    fileCount: 3,
    subfolderCount: 1,
    totalSizeBytes: 5600000,
    relativePath: 'Business Development/Josh Reaves Dental',
    subfolders: makeSubfolders({}),
    recentFiles: [
      { name: 'Site Visit Notes.docx', modified: daysAgo(14), size: 67000, path: '' },
    ],
  },
  {
    id: 'lead-003',
    number: null,
    name: 'Youngsville Land Listings',
    displayName: 'Youngsville Land Listings',
    status: 'Lead',
    lifecyclePhase: 'Business Development',
    lastModified: daysAgo(32),
    fileCount: 2,
    subfolderCount: 1,
    totalSizeBytes: 3200000,
    relativePath: 'Business Development/Youngsville Land Listings',
    subfolders: makeSubfolders({}),
    recentFiles: [
      { name: 'Lot Survey.pdf', modified: daysAgo(32), size: 2100000, path: '' },
    ],
  },
  {
    id: 'lead-004',
    number: null,
    name: 'Lafayette Dermatology',
    displayName: 'Lafayette Dermatology',
    status: 'Lead',
    lifecyclePhase: 'Business Development',
    lastModified: daysAgo(45),
    fileCount: 2,
    subfolderCount: 1,
    totalSizeBytes: 1500000,
    relativePath: 'Business Development/Lafayette Dermatology',
    subfolders: makeSubfolders({}),
    recentFiles: [
      { name: 'Conceptual Layout.pdf', modified: daysAgo(45), size: 1200000, path: '' },
    ],
  },

  // ─── COMPLETE ───────────────────────────────────────────────
  {
    id: '22-200',
    number: '22-200',
    name: '22-200 Luquette Oil',
    displayName: 'Luquette Oil',
    status: 'Complete',
    lifecyclePhase: 'Closeout',
    lastModified: daysAgo(120),
    fileCount: 2134,
    subfolderCount: 112,
    totalSizeBytes: 8765432100,
    relativePath: 'Completed/22-200 Luquette Oil',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 18,
      'Chase Group': 67,
      'Permits': 14,
      'Subcontractors/03 - CONCRETE': 22,
      'Subcontractors/05 - METALS': 15,
      'Subcontractors/06 - WOOD, PLASTICS, COMP': 28,
      'Subcontractors/07 - THERMAL & MOISTURE PROTECT': 9,
      'Subcontractors/08 - OPENINGS': 16,
      'Subcontractors/09 - FINISHES': 24,
      'Subcontractors/10 - SPECIALTIES': 8,
      'Subcontractors/22 - PLUMBING': 18,
      'Subcontractors/23 - HVAC': 21,
      'Subcontractors/26 - ELECTRICAL': 14,
      'Subcontractors/31 - EARTHWORK': 25,
      'Project Progress Reports': 42,
      'Warranty': 6,
    }),
    recentFiles: [
      { name: 'Final Warranty Docs.pdf', modified: daysAgo(120), size: 3400000, path: 'Warranty/' },
      { name: 'Certificate of Occupancy.pdf', modified: daysAgo(125), size: 890000, path: 'Permits/' },
    ],
  },
  {
    id: '23-265',
    number: '23-265',
    name: '23-265 Clipper Cove',
    displayName: 'Clipper Cove',
    status: 'Complete',
    lifecyclePhase: 'Closeout',
    lastModified: daysAgo(95),
    fileCount: 1876,
    subfolderCount: 98,
    totalSizeBytes: 6543210987,
    relativePath: 'Completed/23-265 Clipper Cove',
    subfolders: makeSubfolders({
      'Owner Documents/Contract Documents': 15,
      'Chase Group': 54,
      'Permits': 11,
      'Subcontractors/03 - CONCRETE': 19,
      'Subcontractors/05 - METALS': 12,
      'Subcontractors/06 - WOOD, PLASTICS, COMP': 23,
      'Subcontractors/07 - THERMAL & MOISTURE PROTECT': 7,
      'Subcontractors/08 - OPENINGS': 13,
      'Subcontractors/09 - FINISHES': 20,
      'Subcontractors/10 - SPECIALTIES': 6,
      'Subcontractors/22 - PLUMBING': 15,
      'Subcontractors/23 - HVAC': 18,
      'Subcontractors/26 - ELECTRICAL': 11,
      'Subcontractors/31 - EARTHWORK': 21,
      'Project Progress Reports': 36,
      'Warranty': 4,
    }),
    recentFiles: [
      { name: 'As-Built Drawings.pdf', modified: daysAgo(95), size: 45000000, path: 'Permits/' },
      { name: 'Final Clean Signoff.pdf', modified: daysAgo(97), size: 234000, path: 'Chase Group/' },
    ],
  },
];

/**
 * Generate a flat activity feed from all projects' recent files
 */
export function getActivityFeed(projects = MOCK_PROJECTS, limit = 30) {
  const activities = [];
  for (const project of projects) {
    for (const file of (project.recentFiles || [])) {
      activities.push({
        projectId: project.id,
        projectName: project.name,
        projectNumber: project.number,
        fileName: file.name,
        filePath: file.path || '',
        modified: file.modified || file.lastModified,
        size: file.size ?? file.sizeBytes,
        status: project.status,
      });
    }
  }
  activities.sort((a, b) => new Date(b.modified) - new Date(a.modified));
  return activities.slice(0, limit);
}

/**
 * Get project counts by status
 */
export function getProjectCounts(projects = MOCK_PROJECTS) {
  const counts = {
    total: projects.length,
    Lead: 0,
    Estimating: 0,
    Active: 0,
    'Punch List': 0,
    Complete: 0,
    'On Hold': 0,
    Unknown: 0,
  };
  for (const p of projects) {
    if (counts[p.status] !== undefined) {
      counts[p.status]++;
    }
  }
  return counts;
}

/**
 * Get projects grouped by lifecycle stage (for Kanban)
 */
export function getProjectsByStage(projects = MOCK_PROJECTS) {
  const stages = {
    'Lead': [],
    'Estimating': [],
    'Active': [],
    'Punch List': [],
    'Complete': [],
    'On Hold': [],
    'Unknown': [],
  };
  for (const p of projects) {
    if (stages[p.status]) {
      stages[p.status].push(p);
    }
  }
  return stages;
}

export default MOCK_PROJECTS;
