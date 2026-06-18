import { useEffect, useRef } from 'react';

const ADSENSE_CLIENT =
  process.env.REACT_APP_ADSENSE_CLIENT || 'ca-pub-8147584564803084';
const ADSENSE_ENABLED = process.env.REACT_APP_ADSENSE_ENABLED === 'true';

export const AD_SLOTS = {
  top: process.env.REACT_APP_ADSENSE_TOP_SLOT,
  content: process.env.REACT_APP_ADSENSE_CONTENT_SLOT,
  article: process.env.REACT_APP_ADSENSE_ARTICLE_SLOT,
};

function AdSenseUnit({
  slot,
  className = '',
  format = 'auto',
  label = 'Advertisement',
  responsive = true,
}) {
  const pushedRef = useRef(false);
  const adSlot = slot?.trim();

  useEffect(() => {
    if (
      !ADSENSE_ENABLED ||
      !adSlot ||
      pushedRef.current ||
      typeof window === 'undefined'
    ) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('AdSense slot could not be requested:', error);
      }
    }
  }, [adSlot]);

  if (!ADSENSE_ENABLED || !adSlot) return null;

  return (
    <aside className={`adSenseUnit ${className}`.trim()} aria-label={label}>
      <span className="adSenseLabel">{label}</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </aside>
  );
}

export default AdSenseUnit;
