const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const todoService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    const url = `${API_BASE_URL}/todos${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    return handleResponse(response);
  },

  create: async (todoData) => {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    return handleResponse(response);
  },

  update: async (id, todoData) => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  toggle: async (id) => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },
};
