import { useEffect } from 'react';

const CLARITY_ID = 'qmta0j4gdp';
const GTM_ID = 'GTM-WLSCV2NQ';

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
    if (!enabled) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    appendScript({
      id: 'fuely-gtm-script',
      src: `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`,
    });

    window.clarity =
      window.clarity ||
      function clarityQueue() {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    appendScript({
      id: 'fuely-clarity-script',
      src: `https://www.clarity.ms/tag/${CLARITY_ID}?ref=bwt`,
    });
  }, [enabled]);

  return null;
}

export default TrackingScripts;
