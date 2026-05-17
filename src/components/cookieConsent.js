export const COOKIE_CONSENT_KEY = 'cookieConsent';
export const COOKIE_CONSENT_EVENT = 'fuely-cookie-consent-change';

const OPTIONAL_STORAGE_KEYS = ['lastRated', 'firstVisitDate', 'ratings'];

export const getCookieConsentValue = () => {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch (error) {
    console.error('Cookie consent read error', error);
    return null;
  }
};

export const hasCookieConsent = () => getCookieConsentValue() === 'true';

export const clearOptionalStorage = () => {
  try {
    OPTIONAL_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch (error) {
    console.error('Optional storage cleanup error', error);
  }
};

export const setCookieConsent = (accepted) => {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? 'true' : 'false');

    if (!accepted) {
      clearOptionalStorage();
    }

    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, {
        detail: { accepted },
      })
    );
  } catch (error) {
    console.error('Cookie consent write error', error);
  }
};

export const resetCookieConsent = () => {
  try {
    clearOptionalStorage();
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, {
        detail: { accepted: false },
      })
    );
  } catch (error) {
    console.error('Cookie consent reset error', error);
  }
};
