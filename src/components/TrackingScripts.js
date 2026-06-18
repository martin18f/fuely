import { useEffect } from 'react';

const CLARITY_ID = 'qmta0j4gdp';
const GTM_ID = 'GTM-WLSCV2NQ';
const GTM_SCRIPT_ID = 'fuely-gtm-script';
const CLARITY_SCRIPT_ID = 'fuely-clarity-script';

const appendScript = ({ id, src, text }) => {
  if (document.getElementById(id)) return;

  const script = document.createElement('script');
  script.id = id;
  script.async = true;

  if (src) {
    script.src = src;
  }

  if (text) {
    script.text = text;
  }

  document.head.appendChild(script);
};

function TrackingScripts({ enabled }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };

    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });

    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    appendScript({
      id: GTM_SCRIPT_ID,
      src: `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`,
    });
  }, []);

  useEffect(() => {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: enabled ? 'granted' : 'denied',
        ad_user_data: enabled ? 'granted' : 'denied',
        ad_personalization: enabled ? 'granted' : 'denied',
        analytics_storage: enabled ? 'granted' : 'denied',
      });
    }

    if (!enabled) return;

    window.clarity =
      window.clarity ||
      function clarityQueue() {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    appendScript({
      id: CLARITY_SCRIPT_ID,
      src: `https://www.clarity.ms/tag/${CLARITY_ID}?ref=bwt`,
    });
  }, [enabled]);

  return null;
}

export default TrackingScripts;
