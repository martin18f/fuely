// src/components/TestIndexNowButton.js
import React from 'react';
import { notifyIndexNowSingle } from '../services/indexNow';

const TestIndexNowButton = () => {
  const handleClick = () => {
    // Zadajte URL, ktorú chcete otestovať (musí patriť vašej doméne)
    notifyIndexNowSingle('https://www.vasadomena.sk/testovacia-stranka');
  };

  return (
    <button onClick={handleClick} style={{ padding: '10px 20px', margin: '20px', fontSize: '16px' }}>
      Otestovať IndexNow
    </button>
  );
};

export default TestIndexNowButton;
