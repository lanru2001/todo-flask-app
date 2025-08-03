import axios from 'axios';
const API_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getTasks = () => api.get('/tasks');
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const searchTasks = (query) => api.get('/tasks/search', { params: { q: query } });
export const getTasksByStatus = (status) => api.get(`/tasks/status/${status}`);
export const getUpcomingTasks = (days) => api.get('/tasks/upcoming', { params: { days } });
export default api;
