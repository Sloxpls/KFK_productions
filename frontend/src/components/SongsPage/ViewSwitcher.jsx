import React from 'react';
import './ViewSwitcher.css';

const ViewSwitcher = ({ currentView, onViewChange }) => {
  const views = ['table', 'grid'];
  const viewNames = {
    table: 'Table View',
    grid: 'Grid View',
  };

  return (
    <div className="view-switcher">
      <select 
        value={currentView} 
        onChange={(e) => onViewChange(e.target.value)}
        className="view-select"
      >
        {views.map(view => (
          <option key={view} value={view}>
            {viewNames[view]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ViewSwitcher;