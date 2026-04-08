/**
 * SOP Construction Sequence Protocol Configuration
 * Maps the ~157 construction steps to folder evidence checks.
 *
 * Chase Group's SharePoint directory structure IS their project management system.
 * This module defines the phases, steps, and how to check for evidence in the file system.
 */

/** The 8 high-level construction phases */
export const PHASES = [
  {
    id: 'pre-construction',
    number: 1,
    name: 'Pre-Construction',
    shortName: 'Pre-Con',
    color: '#6366f1',
    description: 'NTP, photos, procurement, mobilization',
  },
  {
    id: 'site-work',
    number: 2,
    name: 'Site Work',
    shortName: 'Site',
    color: '#8b5cf6',
    description: 'Dirt, civil, utilities, grading',
  },
  {
    id: 'foundation',
    number: 3,
    name: 'Foundation',
    shortName: 'Found.',
    color: '#a78bfa',
    description: 'Concrete, MEP in-slab, footings',
  },
  {
    id: 'framing',
    number: 4,
    name: 'Framing',
    shortName: 'Frame',
    color: '#3b82f6',
    description: 'Wood/steel framing, sheathing, roof deck',
  },
  {
    id: 'mep-rough',
    number: 5,
    name: 'MEP Rough-In',
    shortName: 'MEP',
    color: '#0ea5e9',
    description: 'Plumbing, HVAC, electrical rough-in',
  },
  {
    id: 'insulation-drywall',
    number: 6,
    name: 'Insulation & Drywall',
    shortName: 'Ins/DW',
    color: '#14b8a6',
    description: 'Thermal protection, drywall, tape & float',
  },
  {
    id: 'finishes',
    number: 7,
    name: 'Finishes',
    shortName: 'Finish',
    color: '#22c55e',
    description: 'Paint, flooring, trim, fixtures, specialties',
  },
  {
    id: 'closeout',
    number: 8,
    name: 'Closeout',
    shortName: 'Close',
    color: '#eab308',
    description: 'Fire marshal, CO, warranty, final clean',
  },
];

/**
 * Evidence check functions.
 * Each returns 'complete' | 'partial' | 'missing' | 'na' based on subfolder data.
 */
function checkFolder(subfolders, path, minFiles = 1) {
  const folder = resolveFolder(subfolders, path);
  if (!folder) return 'missing';
  const count = folder.itemCount ?? folder.fileCount ?? 0;
  const hasFiles = count > 0 || folder.hasFiles;
  if (hasFiles && count >= minFiles) return 'complete';
  if (hasFiles) return 'partial';
  return 'missing';
}

/**
 * Resolve a folder path like 'Subcontractors/22 - PLUMBING' or 'Owner Documents/Contract Documents'
 * by navigating through the subfolder tree. Handles both flat mock keys and nested API structure.
 */
function resolveFolder(subfolders, path) {
  if (!subfolders) return null;
  // Direct match first (works for mock data with flat paths)
  if (subfolders[path]) return subfolders[path];

  // Try navigating nested structure (API data)
  const parts = path.split('/');
  let current = subfolders[parts[0]];
  if (!current) {
    // Try partial match for top-level key
    const topKey = Object.keys(subfolders).find(k =>
      k.toLowerCase().includes(parts[0].toLowerCase())
    );
    if (topKey) current = subfolders[topKey];
  }
  if (!current) return null;
  if (parts.length === 1) return current;

  // Navigate into children for remaining path segments
  for (let i = 1; i < parts.length; i++) {
    const children = current.children;
    if (!children) return null;
    const segment = parts[i];
    let child = children[segment];
    if (!child) {
      // Fuzzy match child key
      const childKey = Object.keys(children).find(k =>
        k.toLowerCase().includes(segment.toLowerCase())
      );
      if (childKey) child = children[childKey];
    }
    if (!child) return null;
    current = child;
  }
  return current;
}

function checkAnyElectrical(subfolders) {
  const paths = [
    'Subcontractors/25 - INTEGRATED AUTOMATION',
    'Subcontractors/26 - ELECTRICAL',
    'Subcontractors/27 - COMMUNICATIONS',
    'Subcontractors/28 - ELECTRONIC SAFETY',
    'Subcontractors/25, 26, 27, 28 - ELECTRICAL SYSTEMS',
  ];
  let totalFiles = 0;
  let hasAny = false;
  for (const p of paths) {
    const folder = resolveFolder(subfolders, p);
    if (!folder) continue;
    const count = folder.itemCount ?? folder.fileCount ?? 0;
    if (count > 0 || folder.hasFiles) {
      hasAny = true;
      totalFiles += count;
    }
  }
  if (totalFiles >= 5) return 'complete';
  if (hasAny) return 'partial';
  return 'missing';
}

/**
 * Full SOP construction sequence — 157 steps grouped by phase.
 * Each step has:
 *   - id: unique key
 *   - step: step number in the SOP
 *   - name: description
 *   - phaseId: which phase it belongs to
 *   - checkEvidence: function(subfolders) => 'complete'|'partial'|'missing'|'na'
 */
export const SOP_STEPS = [
  // ═══ PHASE 1: PRE-CONSTRUCTION ═══════════════════════════════
  { id: 'sop-001', step: 1, name: 'Receive Notice to Proceed (NTP)', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Owner Documents/Contract Documents', 2) },
  { id: 'sop-002', step: 2, name: 'Review contract documents', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Owner Documents/Contract Documents', 3) },
  { id: 'sop-003', step: 3, name: 'Conduct pre-construction meeting', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 2) },
  { id: 'sop-004', step: 4, name: 'Take pre-construction site photos', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 3) },
  { id: 'sop-005', step: 5, name: 'Establish project schedule', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 4) },
  { id: 'sop-006', step: 6, name: 'Submit building permit application', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Permits', 1) },
  { id: 'sop-007', step: 7, name: 'Obtain building permit', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Permits', 2) },
  { id: 'sop-008', step: 8, name: 'Set up project directory structure', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 1) },
  { id: 'sop-009', step: 9, name: 'Issue subcontractor bid packages', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 5) },
  { id: 'sop-010', step: 10, name: 'Review and award subcontracts', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 6) },
  { id: 'sop-011', step: 11, name: 'Collect subcontractor insurance certificates', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 7) },
  { id: 'sop-012', step: 12, name: 'Order long-lead materials', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 8) },
  { id: 'sop-013', step: 13, name: 'Establish safety plan', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 9) },
  { id: 'sop-014', step: 14, name: 'Set up job site office/trailer', phaseId: 'pre-construction', checkEvidence: () => 'na' },
  { id: 'sop-015', step: 15, name: 'Install temporary utilities', phaseId: 'pre-construction', checkEvidence: () => 'na' },
  { id: 'sop-016', step: 16, name: 'Install erosion control / SWPPP', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Permits', 3) },
  { id: 'sop-017', step: 17, name: 'Install construction fencing', phaseId: 'pre-construction', checkEvidence: () => 'na' },
  { id: 'sop-018', step: 18, name: 'Post required signage (OSHA, permits)', phaseId: 'pre-construction', checkEvidence: () => 'na' },
  { id: 'sop-019', step: 19, name: 'Conduct owner/architect kickoff', phaseId: 'pre-construction', checkEvidence: (sf) => checkFolder(sf, 'Chase Group', 3) },
  { id: 'sop-020', step: 20, name: 'Mobilize equipment to site', phaseId: 'pre-construction', checkEvidence: () => 'na' },

  // ═══ PHASE 2: SITE WORK ═══════════════════════════════════════
  { id: 'sop-021', step: 21, name: 'Call LA One Call (utility locate)', phaseId: 'site-work', checkEvidence: () => 'na' },
  { id: 'sop-022', step: 22, name: 'Clear and grub site', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 1) },
  { id: 'sop-023', step: 23, name: 'Strip and stockpile topsoil', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 2) },
  { id: 'sop-024', step: 24, name: 'Rough grade site', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 3) },
  { id: 'sop-025', step: 25, name: 'Excavate for foundations', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 4) },
  { id: 'sop-026', step: 26, name: 'Install storm drainage', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 5) },
  { id: 'sop-027', step: 27, name: 'Install sanitary sewer', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 1) },
  { id: 'sop-028', step: 28, name: 'Install water main / service', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 2) },
  { id: 'sop-029', step: 29, name: 'Install fire line / hydrant', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 3) },
  { id: 'sop-030', step: 30, name: 'Install gas service', phaseId: 'site-work', checkEvidence: () => 'na' },
  { id: 'sop-031', step: 31, name: 'Install electrical service conduit', phaseId: 'site-work', checkEvidence: (sf) => checkAnyElectrical(sf) },
  { id: 'sop-032', step: 32, name: 'Install telecom/data conduit', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/27 - COMMUNICATIONS', 1) },
  { id: 'sop-033', step: 33, name: 'Compact fill / proof roll', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 6) },
  { id: 'sop-034', step: 34, name: 'Soil testing / compaction reports', phaseId: 'site-work', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 7) },
  { id: 'sop-035', step: 35, name: 'Install termite pre-treatment', phaseId: 'site-work', checkEvidence: () => 'na' },

  // ═══ PHASE 3: FOUNDATION ══════════════════════════════════════
  { id: 'sop-036', step: 36, name: 'Layout building / control points', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 1) },
  { id: 'sop-037', step: 37, name: 'Form footings', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 2) },
  { id: 'sop-038', step: 38, name: 'Install footing rebar', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 3) },
  { id: 'sop-039', step: 39, name: 'Footing inspection', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Permits', 4) },
  { id: 'sop-040', step: 40, name: 'Pour footings', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 4) },
  { id: 'sop-041', step: 41, name: 'Form stem walls / grade beams', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 5) },
  { id: 'sop-042', step: 42, name: 'Install stem wall rebar', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 6) },
  { id: 'sop-043', step: 43, name: 'Pour stem walls', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 7) },
  { id: 'sop-044', step: 44, name: 'Strip and cure foundation forms', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 8) },
  { id: 'sop-045', step: 45, name: 'Waterproof / damp-proof foundation', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 1) },
  { id: 'sop-046', step: 46, name: 'Install underslab plumbing', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 3) },
  { id: 'sop-047', step: 47, name: 'Install underslab electrical conduit', phaseId: 'foundation', checkEvidence: (sf) => checkAnyElectrical(sf) },
  { id: 'sop-048', step: 48, name: 'Plumbing pressure test (underslab)', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 4) },
  { id: 'sop-049', step: 49, name: 'Backfill foundation', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 8) },
  { id: 'sop-050', step: 50, name: 'Install vapor barrier', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 2) },
  { id: 'sop-051', step: 51, name: 'Install slab rebar / wire mesh', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 9) },
  { id: 'sop-052', step: 52, name: 'Slab pre-pour inspection', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Permits', 5) },
  { id: 'sop-053', step: 53, name: 'Pour slab on grade', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 10) },
  { id: 'sop-054', step: 54, name: 'Cure slab', phaseId: 'foundation', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 11) },

  // ═══ PHASE 4: FRAMING ═════════════════════════════════════════
  { id: 'sop-055', step: 55, name: 'Deliver framing materials', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 1) },
  { id: 'sop-056', step: 56, name: 'Layout and snap walls', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 2) },
  { id: 'sop-057', step: 57, name: 'Frame exterior walls', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 3) },
  { id: 'sop-058', step: 58, name: 'Frame interior walls', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 4) },
  { id: 'sop-059', step: 59, name: 'Install steel beams / columns', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/05 - METALS', 1) },
  { id: 'sop-060', step: 60, name: 'Install trusses / rafters', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 5) },
  { id: 'sop-061', step: 61, name: 'Install roof decking / sheathing', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 6) },
  { id: 'sop-062', step: 62, name: 'Install wall sheathing', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 7) },
  { id: 'sop-063', step: 63, name: 'Install subfloor / floor sheathing', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 8) },
  { id: 'sop-064', step: 64, name: 'Install stairs / stair framing', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 9) },
  { id: 'sop-065', step: 65, name: 'Frame soffits and bulkheads', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 10) },
  { id: 'sop-066', step: 66, name: 'Install blocking for cabinets/fixtures', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 11) },
  { id: 'sop-067', step: 67, name: 'Framing inspection', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Permits', 6) },
  { id: 'sop-068', step: 68, name: 'Install house wrap / WRB', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 3) },
  { id: 'sop-069', step: 69, name: 'Install roofing underlayment', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 4) },
  { id: 'sop-070', step: 70, name: 'Install roofing material', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 5) },
  { id: 'sop-071', step: 71, name: 'Install flashing and gutters', phaseId: 'framing', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 6) },

  // ═══ PHASE 5: MEP ROUGH-IN ════════════════════════════════════
  { id: 'sop-072', step: 72, name: 'Rough-in plumbing (top-out)', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 4) },
  { id: 'sop-073', step: 73, name: 'Install plumbing vent stacks', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 5) },
  { id: 'sop-074', step: 74, name: 'Plumbing pressure test (top-out)', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 6) },
  { id: 'sop-075', step: 75, name: 'Install HVAC ductwork', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/23 - HVAC', 1) },
  { id: 'sop-076', step: 76, name: 'Install HVAC equipment (AHUs, condensers)', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/23 - HVAC', 3) },
  { id: 'sop-077', step: 77, name: 'Install refrigerant lines', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/23 - HVAC', 4) },
  { id: 'sop-078', step: 78, name: 'Rough-in electrical wiring', phaseId: 'mep-rough', checkEvidence: (sf) => checkAnyElectrical(sf) },
  { id: 'sop-079', step: 79, name: 'Install electrical panels / breakers', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/26 - ELECTRICAL', 3) },
  { id: 'sop-080', step: 80, name: 'Install low-voltage rough-in (data, phone)', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/27 - COMMUNICATIONS', 2) },
  { id: 'sop-081', step: 81, name: 'Install fire alarm rough-in', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/28 - ELECTRONIC SAFETY', 1) },
  { id: 'sop-082', step: 82, name: 'Install fire sprinkler rough-in', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 7) },
  { id: 'sop-083', step: 83, name: 'MEP rough-in inspection (plumbing)', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Permits', 6) },
  { id: 'sop-084', step: 84, name: 'MEP rough-in inspection (mechanical)', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Permits', 7) },
  { id: 'sop-085', step: 85, name: 'MEP rough-in inspection (electrical)', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Permits', 8) },
  { id: 'sop-086', step: 86, name: 'Install gas piping', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 8) },
  { id: 'sop-087', step: 87, name: 'Gas pressure test', phaseId: 'mep-rough', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 9) },

  // ═══ PHASE 6: INSULATION & DRYWALL ════════════════════════════
  { id: 'sop-088', step: 88, name: 'Install batt insulation (walls)', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 3) },
  { id: 'sop-089', step: 89, name: 'Install batt insulation (ceiling/attic)', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 4) },
  { id: 'sop-090', step: 90, name: 'Install spray foam insulation', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 5) },
  { id: 'sop-091', step: 91, name: 'Insulation inspection', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Permits', 7) },
  { id: 'sop-092', step: 92, name: 'Hang drywall', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 1) },
  { id: 'sop-093', step: 93, name: 'Tape and float drywall', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 2) },
  { id: 'sop-094', step: 94, name: 'Sand drywall', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 3) },
  { id: 'sop-095', step: 95, name: 'Apply drywall texture', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 4) },
  { id: 'sop-096', step: 96, name: 'Install cement board (wet areas)', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 5) },
  { id: 'sop-097', step: 97, name: 'Install exterior sheathing / substrate', phaseId: 'insulation-drywall', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 6) },

  // ═══ PHASE 7: FINISHES ════════════════════════════════════════
  { id: 'sop-098', step: 98, name: 'Prime all surfaces', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 5) },
  { id: 'sop-099', step: 99, name: 'Paint walls (first coat)', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 6) },
  { id: 'sop-100', step: 100, name: 'Install exterior cladding / siding', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/07 - THERMAL & MOISTURE PROTECT', 7) },
  { id: 'sop-101', step: 101, name: 'Install exterior brick / stone', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/04 - MASONRY', 1) },
  { id: 'sop-102', step: 102, name: 'Install windows', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/08 - OPENINGS', 1) },
  { id: 'sop-103', step: 103, name: 'Install exterior doors', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/08 - OPENINGS', 2) },
  { id: 'sop-104', step: 104, name: 'Install interior doors and hardware', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/08 - OPENINGS', 3) },
  { id: 'sop-105', step: 105, name: 'Install door frames and casings', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/08 - OPENINGS', 4) },
  { id: 'sop-106', step: 106, name: 'Install cabinets', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 12) },
  { id: 'sop-107', step: 107, name: 'Install countertops', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 13) },
  { id: 'sop-108', step: 108, name: 'Install tile (floors and walls)', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 7) },
  { id: 'sop-109', step: 109, name: 'Install hardwood flooring', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 8) },
  { id: 'sop-110', step: 110, name: 'Install carpet', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 9) },
  { id: 'sop-111', step: 111, name: 'Install VCT / LVP / vinyl flooring', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 10) },
  { id: 'sop-112', step: 112, name: 'Install base trim and crown molding', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 14) },
  { id: 'sop-113', step: 113, name: 'Install window sills and casings', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/06 - WOOD, PLASTICS, COMP', 15) },
  { id: 'sop-114', step: 114, name: 'Install shelving and closet systems', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/10 - SPECIALTIES', 1) },
  { id: 'sop-115', step: 115, name: 'Install mirrors and accessories', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/10 - SPECIALTIES', 2) },
  { id: 'sop-116', step: 116, name: 'Install toilet partitions / accessories', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/10 - SPECIALTIES', 3) },
  { id: 'sop-117', step: 117, name: 'Paint walls (final coat)', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 11) },
  { id: 'sop-118', step: 118, name: 'Paint doors and trim', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 12) },
  { id: 'sop-119', step: 119, name: 'Install plumbing fixtures (sinks, toilets)', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 9) },
  { id: 'sop-120', step: 120, name: 'Install faucets and trim', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 10) },
  { id: 'sop-121', step: 121, name: 'Install water heater', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 11) },
  { id: 'sop-122', step: 122, name: 'Install light fixtures', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/26 - ELECTRICAL', 5) },
  { id: 'sop-123', step: 123, name: 'Install switches and receptacles', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/26 - ELECTRICAL', 6) },
  { id: 'sop-124', step: 124, name: 'Install HVAC registers and grilles', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/23 - HVAC', 6) },
  { id: 'sop-125', step: 125, name: 'Install thermostats', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/23 - HVAC', 7) },
  { id: 'sop-126', step: 126, name: 'Install appliances', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/10 - SPECIALTIES', 4) },
  { id: 'sop-127', step: 127, name: 'Install ceiling grid / tiles', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 13) },
  { id: 'sop-128', step: 128, name: 'Install exterior painting / stucco', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/09 - FINISHES', 14) },
  { id: 'sop-129', step: 129, name: 'Install signage', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/10 - SPECIALTIES', 5) },
  { id: 'sop-130', step: 130, name: 'Install handrails and guardrails', phaseId: 'finishes', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/05 - METALS', 3) },

  // ═══ PHASE 8: CLOSEOUT ════════════════════════════════════════
  { id: 'sop-131', step: 131, name: 'Complete punch list walkthrough', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Project Progress Reports', 5) },
  { id: 'sop-132', step: 132, name: 'Correct punch list items', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Project Progress Reports', 8) },
  { id: 'sop-133', step: 133, name: 'Install final site grading', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 10) },
  { id: 'sop-134', step: 134, name: 'Pour sidewalks and curbs', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/03 - CONCRETE', 12) },
  { id: 'sop-135', step: 135, name: 'Install asphalt / paving', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 12) },
  { id: 'sop-136', step: 136, name: 'Stripe parking lot', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 13) },
  { id: 'sop-137', step: 137, name: 'Install landscaping', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 14) },
  { id: 'sop-138', step: 138, name: 'Install irrigation system', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/31 - EARTHWORK', 15) },
  { id: 'sop-139', step: 139, name: 'Final electrical inspection', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Permits', 10) },
  { id: 'sop-140', step: 140, name: 'Final plumbing inspection', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Permits', 11) },
  { id: 'sop-141', step: 141, name: 'Final mechanical inspection', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Permits', 12) },
  { id: 'sop-142', step: 142, name: 'Fire marshal inspection', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Permits', 13) },
  { id: 'sop-143', step: 143, name: 'Health department inspection', phaseId: 'closeout', checkEvidence: () => 'na' },
  { id: 'sop-144', step: 144, name: 'ADA compliance verification', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Permits', 14) },
  { id: 'sop-145', step: 145, name: 'Certificate of Occupancy (CO)', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Permits', 14) },
  { id: 'sop-146', step: 146, name: 'HVAC start-up and commissioning', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/23 - HVAC', 10) },
  { id: 'sop-147', step: 147, name: 'Test and balance HVAC', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/23 - HVAC', 12) },
  { id: 'sop-148', step: 148, name: 'Fire alarm final test', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/28 - ELECTRONIC SAFETY', 3) },
  { id: 'sop-149', step: 149, name: 'Fire sprinkler final test', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Subcontractors/22 - PLUMBING', 12) },
  { id: 'sop-150', step: 150, name: 'Collect as-built drawings', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Permits', 14) },
  { id: 'sop-151', step: 151, name: 'Collect O&M manuals', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Warranty', 1) },
  { id: 'sop-152', step: 152, name: 'Collect warranty documents', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Warranty', 2) },
  { id: 'sop-153', step: 153, name: 'Collect lien waivers', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Owner Documents/Contract Documents', 10) },
  { id: 'sop-154', step: 154, name: 'Submit final pay application', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Owner Documents/Contract Documents', 12) },
  { id: 'sop-155', step: 155, name: 'Owner training on building systems', phaseId: 'closeout', checkEvidence: () => 'na' },
  { id: 'sop-156', step: 156, name: 'Final clean', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Project Progress Reports', 10) },
  { id: 'sop-157', step: 157, name: 'Project closeout and handover', phaseId: 'closeout', checkEvidence: (sf) => checkFolder(sf, 'Owner Documents/Contract Documents', 15) },
];

/**
 * Evaluate all SOP steps for a project and return results grouped by phase.
 * @param {object} project - Project with subfolders map
 * @returns {object} { phaseId: { total, complete, partial, missing, na, steps: [...] } }
 */
export function evaluateProjectProtocol(project) {
  const subfolders = project.subfolders || {};
  const result = {};

  for (const phase of PHASES) {
    result[phase.id] = {
      phaseId: phase.id,
      phaseName: phase.name,
      phaseNumber: phase.number,
      total: 0,
      complete: 0,
      partial: 0,
      missing: 0,
      na: 0,
      steps: [],
    };
  }

  for (const step of SOP_STEPS) {
    const evidence = step.checkEvidence(subfolders);
    const phaseResult = result[step.phaseId];
    phaseResult.total++;
    phaseResult[evidence]++;
    phaseResult.steps.push({
      ...step,
      evidence,
    });
  }

  return result;
}

/**
 * Get a summary score per phase for protocol grid display.
 * Returns 'complete' if >80% done, 'partial' if >20% done, 'missing' otherwise, 'na' if not applicable
 */
export function getPhaseStatus(phaseResult) {
  const applicable = phaseResult.total - phaseResult.na;
  if (applicable === 0) return 'na';
  const completionRate = phaseResult.complete / applicable;
  const anyProgress = (phaseResult.complete + phaseResult.partial) / applicable;
  if (completionRate >= 0.8) return 'complete';
  if (anyProgress >= 0.2) return 'partial';
  return 'missing';
}

/**
 * Get phase completion percentage
 */
export function getPhaseCompletionPercent(phaseResult) {
  const applicable = phaseResult.total - phaseResult.na;
  if (applicable === 0) return 100;
  return Math.round(((phaseResult.complete + phaseResult.partial * 0.5) / applicable) * 100);
}
