// src/PolicyLinks.js
import React from 'react';
import { Link } from 'react-router-dom';
import './PolicyLinks.css'; // Import CSS súboru, kde definujeme štýly

const PolicyLinks = () => {
  return (
    <div className="policy-links">
      <Link to="/cookie-policy">Cookie Policy</Link>
      <span className="separator">|</span>
      <Link to="/terms-of-use">Podmienky používania</Link>
      <span className="separator">|</span>
      <Link to="/privacy-policy">Zásady ochrany osobných údajov</Link>
    </div>
  );
};

export default PolicyLinks;
