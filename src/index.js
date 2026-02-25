import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';     // Globálny CSS, alebo ako to nazveš
import App from './App';
import './i18n';        // Načítaj i18n config

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
