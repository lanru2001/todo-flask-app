import React from 'react';

const FilterBar = ({ filters, onFilterChange, stats }) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: '⏳ Pending' },
    { value: 'in_progress', label: '🔵 In Progress' },
    { value: 'completed', label: '✅ Completed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'high', label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
  ];

  return (
    <div className="filter-bar">
      <div className="stats-row">
        <span className="stat-chip">📋 {stats.total} Total</span>
        <span className="stat-chip pending">⏳ {stats.pending} Pending</span>
        <span className="stat-chip in-progress">🔵 {stats.in_progress} In Progress</span>
        <span className="stat-chip completed">✅ {stats.completed} Done</span>
      </div>

      <div className="filter-controls">
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
          className="filter-select"
        >
          {priorityOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {(filters.status || filters.priority) && (
          <button
            onClick={() => onFilterChange({ status: '', priority: '' })}
            className="btn btn-ghost clear-btn"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
