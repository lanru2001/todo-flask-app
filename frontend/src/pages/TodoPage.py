import React, { useState, useEffect, useCallback } from 'react';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import FilterBar from '../components/FilterBar';
import { todoService } from '../services/todoService';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoService.getAll(filters);
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const handleCreate = async (data) => {
    try {
      const newTodo = await todoService.create(data);
      setTodos(prev => [newTodo, ...prev]);
      showNotification('Task created!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await todoService.toggle(id);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updated = await todoService.update(id, data);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
      showNotification('Task updated!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoService.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      showNotification('Task deleted!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const stats = {
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    in_progress: todos.filter(t => t.status === 'in_progress').length,
    completed: todos.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="page">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? '✅' : '❌'} {notification.msg}
        </div>
      )}

      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">◈</span>
            TaskFlow
          </h1>
          <p className="app-subtitle">Stay organized. Get things done.</p>
        </div>
      </header>

      <main className="main-content">
        <section className="add-section">
          <h2 className="section-title">New Task</h2>
          <TodoForm onSubmit={handleCreate} />
        </section>

        <section className="list-section">
          <FilterBar filters={filters} onFilterChange={setFilters} stats={stats} />

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading tasks...</span>
            </div>
          )}

          {error && (
            <div className="error-state">
              <span>⚠️ {error}</span>
              <button onClick={fetchTodos} className="btn btn-ghost">Retry</button>
            </div>
          )}

          {!loading && !error && todos.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No tasks found</h3>
              <p>{filters.status || filters.priority ? 'Try adjusting your filters.' : 'Add your first task above!'}</p>
            </div>
          )}

          {!loading && !error && todos.length > 0 && (
            <div className="todo-list">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TodoPage;
