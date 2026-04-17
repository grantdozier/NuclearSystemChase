import axios from 'axios';
import { MOCK_PROJECTS, getActivityFeed, getProjectCounts, getProjectsByStage } from '../data/mockData';

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : '/api';

/** Map API enum names to frontend display names */
const STATUS_MAP = {
  PunchList: 'Punch List',
  OnHold: 'On Hold',
  BusinessDevelopment: 'Business Development',
};

/** Normalize a project object from the API to match frontend expectations */
function normalizeProject(p) {
  return {
    ...p,
    status: STATUS_MAP[p.status] || p.status,
    lifecyclePhase: STATUS_MAP[p.phase] || p.phase,
    recentFiles: (p.recentFiles || []).map(f => ({
      ...f,
      modified: f.lastModified || f.modified,
      size: f.sizeBytes ?? f.size,
    })),
  };
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

/**
 * Wraps an API call with fallback to mock data.
 * If the API is unreachable, returns the fallback value.
 */
async function withFallback(apiCall, fallbackValue) {
  try {
    const res = await apiCall();
    return res.data;
  } catch (err) {
    console.warn('API unavailable, using mock data:', err.message);
    return fallbackValue;
  }
}

export const directoryApi = {
  getTree: () => api.get('/directory/tree'),
  getSubTree: (path) => api.get(`/directory/tree/${path}`),
  rescan: () => api.post('/directory/rescan'),
  getStatus: () => api.get('/directory/status'),
};

export const projectsApi = {
  getAll: (status) => api.get('/projects', { params: status ? { status } : {} }),
  getByPath: (path) => api.get(`/projects/${path}`),
  getSummary: () => api.get('/projects/summary'),
};

export const settingsApi = {
  get: () => api.get('/settings'),
  updateRootPath: (path, label) => api.put('/settings/root-path', { path, label }),
};

export const emailApi = {
  getStatus: () => api.get('/email/status'),
  getHistory: () => api.get('/email/history'),
  getEmails: (project, tag) => api.get('/email/emails', { params: { project, tag } }),
  runNow: (dryRun = false) => api.post('/email/run', null, { params: { dryRun } }),
};

/**
 * High-level data fetchers with automatic mock fallback.
 * These are the preferred way to fetch data in the new dashboards.
 */
export const dataService = {
  /** Fetch all projects — falls back to mock data */
  async getAllProjects() {
    const data = await withFallback(
      () => projectsApi.getAll(),
      MOCK_PROJECTS
    );
    return Array.isArray(data) ? data.map(normalizeProject) : data;
  },

  /** Fetch a single project by ID */
  async getProject(id) {
    const projects = await this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  },

  /** Fetch projects grouped by lifecycle stage */
  async getProjectsByStage() {
    const projects = await this.getAllProjects();
    return getProjectsByStage(projects);
  },

  /** Fetch project counts by status */
  async getProjectCounts() {
    const projects = await this.getAllProjects();
    return getProjectCounts(projects);
  },

  /** Fetch recent activity feed */
  async getActivityFeed(limit = 30) {
    const projects = await this.getAllProjects();
    return getActivityFeed(projects, limit);
  },

  /** Fetch directory status — falls back to configured mock */
  async getDirectoryStatus() {
    return withFallback(
      () => directoryApi.getStatus(),
      { isConfigured: true, rootPath: 'C:\\SharePoint\\Chase Group\\Projects', lastScan: new Date().toISOString() }
    );
  },

  /** Get active projects only */
  async getActiveProjects() {
    const projects = await this.getAllProjects();
    return projects.filter(p => p.status === 'Active');
  },
};

export default api;
