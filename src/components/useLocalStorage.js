
import { useState,} from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Najprv zistíme, či je user OK s cookies
      const consent = localStorage.getItem('cookieConsent');
      if (consent !== 'true') {
        // Ak user neodsúhlasil, nepoužijeme localStorage vôbec
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Chyba pri načítaní ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(prev => {
        const valueToStore =
          value instanceof Function ? value(prev) : value;

        // Skontrolujeme cookieConsent
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'true') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } else {
          // Ak user nesúhlasil, do localStorage nezapisujeme
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(`Chyba pri ukladaní ${key}:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
