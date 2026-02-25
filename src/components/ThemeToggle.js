// src/components/ThemeToggle.js
import React from 'react';
import './ThemeToggle.css';  // Sem dáš to Uiverse.io CSS (popísané nižšie)

function ThemeToggle({ theme, onToggle }) {
  // Input checkbox je checked, ak je theme == 'dark'
  const isDark = theme === 'dark';

  return (
    <label className="switch-button">
      <div className="switch-outer">
        <input
          id="switch"
          type="checkbox"
          checked={isDark}
          onChange={onToggle}
        />
        <div className="button">
          <span className="button-toggle"></span>
          <span className="button-indicator"></span>
        </div>
      </div>
    </label>
  );
}

export default ThemeToggle;
