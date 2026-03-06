import React, { useState } from 'react';
import TodoForm from './TodoForm';

const priorityConfig = {
  high:   { label: 'High',   color: '#ef4444', icon: '🔴' },
  medium: { label: 'Medium', color: '#f59e0b', icon: '🟡' },
  low:    { label: 'Low',    color: '#22c55e', icon: '🟢' },
};

const statusConfig = {
  pending:     { label: 'Pending',     color: '#94a3b8' },
  in_progress: { label: 'In Progress', color: '#3b82f6' },
  completed:   { label: 'Completed',   color: '#22c55e' },
};

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

  const priority = priorityConfig[todo.priority] || priorityConfig.medium;
  const statusInfo = statusConfig[todo.status] || statusConfig.pending;
  const isCompleted = todo.status === 'completed';

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try { await onDelete(todo.id); }
    finally { setDeleting(false); }
  };

  const handleStatusChange = async (e) => {
    setStatusChanging(true);
    try { await onUpdate(todo.id, { status: e.target.value }); }
    finally { setStatusChanging(false); }
  };

  const handleUpdate = async (data) => {
    await onUpdate(todo.id, data);
    setEditing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = todo.due_date && !isCompleted && new Date(todo.due_date) < new Date();

  if (editing) {
    return (
      <div className="todo-item editing">
        <TodoForm
          initialData={todo}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`todo-item ${isCompleted ? 'completed' : ''} ${deleting ? 'deleting' : ''}`}>
      <div className="todo-left">
        <button
          className={`check-btn ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggle(todo.id)}
          title="Toggle completion"
        >
          {isCompleted ? '✓' : ''}
        </button>
      </div>

      <div className="todo-content">
        <div className="todo-header">
          <span className={`todo-title ${isCompleted ? 'strikethrough' : ''}`}>
            {todo.title}
          </span>
          <span className="priority-badge" style={{ color: priority.color }}>
            {priority.icon} {priority.label}
          </span>
        </div>

        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        <div className="todo-meta">
          <select
            value={todo.status}
            onChange={handleStatusChange}
            className="status-select"
            disabled={statusChanging}
            style={{ color: statusInfo.color }}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {todo.due_date && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              📅 {isOverdue ? '⚠️ ' : ''}{formatDate(todo.due_date)}
            </span>
          )}

          <span className="created-at">
            {new Date(todo.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="todo-actions">
        <button onClick={() => setEditing(true)} className="action-btn edit-btn" title="Edit">✏️</button>
        <button onClick={handleDelete} className="action-btn delete-btn" title="Delete" disabled={deleting}>
          {deleting ? '...' : '🗑️'}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
