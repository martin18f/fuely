// src/components/TestIndexNowButton.js
import React from 'react';
import { notifyIndexNowSingle } from '../services/indexNow';

const TestIndexNowButton = () => {
  const handleClick = () => {
    // Zadajte URL, ktorú chcete otestovať (musí patriť vašej doméne)
    notifyIndexNowSingle('https://fuely.martinsulak.dev/');
  };

  return (
    <button className="indexNowTestButton" onClick={handleClick}>
      Otestovať IndexNow
    </button>
  );
};

export default TestIndexNowButton;
