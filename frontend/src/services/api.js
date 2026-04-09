const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    });
    
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error((data && data.message) || response.statusText);
    }
    return { data };
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export const authAPI = {
  login: (data) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => fetchAPI('/auth/me')
};

export const tasksAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetchAPI(`/tasks${q ? '?' + q : ''}`);
  },
  create: (data) => fetchAPI('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/tasks/${id}`, { method: 'DELETE' }),
  getSummary: () => fetchAPI('/tasks/stats/summary'),
  toggle: (id) => fetchAPI(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  toggleSub: (tid, sid) => fetchAPI(`/tasks/${tid}/subtasks/${sid}`, { method: 'PATCH' }),
  addSub: (tid, data) => fetchAPI(`/tasks/${tid}/subtasks`, { method: 'POST', body: JSON.stringify(data) }),
  deleteSub: (tid, sid) => fetchAPI(`/tasks/${tid}/subtasks/${sid}`, { method: 'DELETE' })
};

export const notesAPI = {
  getAll: () => fetchAPI('/notes'),
  create: (data) => fetchAPI('/notes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/notes/${id}`, { method: 'DELETE' })
};

export const timerAPI = {
  saveSession: (data) => fetchAPI('/timer/session', { method: 'POST', body: JSON.stringify(data) })
};

export const streakAPI = {
  get: () => fetchAPI('/streak')
};

export const aiAPI = {
  getSuggestions: () => fetchAPI('/ai/suggestions')
};

