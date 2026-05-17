
import { useCallback, useEffect, useState } from 'react';
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  hasCookieConsent,
} from './cookieConsent';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (!hasCookieConsent()) {
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

  useEffect(() => {
    const handleConsentChange = (event) => {
      try {
        if (event.detail?.accepted) {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
        } else if (key !== COOKIE_CONSENT_KEY) {
          window.localStorage.removeItem(key);
        }
      } catch (error) {
        console.error(`Chyba pri synchronizácii ${key}:`, error);
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    };
  }, [key, storedValue]);

  const setValue = useCallback((value) => {
    try {
      setStoredValue(prev => {
        const valueToStore =
          value instanceof Function ? value(prev) : value;

        if (hasCookieConsent()) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } else {
          // Ak user nesúhlasil, do localStorage nezapisujeme
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(`Chyba pri ukladaní ${key}:`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
