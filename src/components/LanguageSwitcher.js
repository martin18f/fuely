// src/components/LanguageSwitcher.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Switchers.css'; // Použijeme náš spoločný CSS

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [checked, setChecked] = useState(i18n.language === 'en');

  useEffect(() => {
    setChecked(i18n.language === 'en');
  }, [i18n.language]);

  const handleToggle = (e) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    i18n.changeLanguage(newValue ? 'en' : 'sk');
  };

  return (
    <div className="switcher">
      <span className="left-label">SK</span>
      <input 
        type="checkbox" 
        className="checkbox" 
        id="lang-switch" 
        checked={checked} 
        onChange={handleToggle} 
      />
      <label className="slider" htmlFor="lang-switch"></label>
      <span className="right-label">EN</span>
    </div>
  );
};

export default LanguageSwitcher;
