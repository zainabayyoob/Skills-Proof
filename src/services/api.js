// Centralized API Client for SkillProof Full-Stack Architecture

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('skillproof_jwt_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data?.error || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // Auth API
  auth: {
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },

    login: async (credentials) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return handleResponse(res);
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    loadDemoPreset: async () => {
      const res = await fetch(`${API_BASE}/auth/demo-preset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return handleResponse(res);
    },
  },

  // Dynamic Assessment Tests API
  tests: {
    startTest: async (skillId) => {
      const res = await fetch(`${API_BASE}/tests/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ skillId }),
      });
      return handleResponse(res);
    },

    submitTest: async (attemptId, answers) => {
      const res = await fetch(`${API_BASE}/tests/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ attemptId, answers }),
      });
      return handleResponse(res);
    },

    verifyCode: async (codeSubmission) => {
      const res = await fetch(`${API_BASE}/tests/verify-code`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(codeSubmission),
      });
      return handleResponse(res);
    },

    getHistory: async () => {
      const res = await fetch(`${API_BASE}/tests/history`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Profile API
  profile: {
    get: async () => {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    update: async (profileData) => {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },
  },

  // Opportunities & Applications API
  opportunities: {
    list: async () => {
      const res = await fetch(`${API_BASE}/opportunities`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    apply: async (opportunityId, candidateNote = '') => {
      const res = await fetch(`${API_BASE}/opportunities/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ opportunityId, candidateNote }),
      });
      return handleResponse(res);
    },

    getApplications: async () => {
      const res = await fetch(`${API_BASE}/opportunities/applications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
