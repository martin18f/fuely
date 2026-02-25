import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './CookieBanner.css';

const CookieBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef(null);
  const position = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookieConsent', 'true');
      setIsVisible(false);
    } catch (e) {
      console.error("Cookie accept error", e);
    }
  };

  const handleDeny = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  const handleMouseDown = (e) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    position.current = { x: rect.left, y: rect.top };
    bannerRef.current.style.left = `${rect.left}px`;
    bannerRef.current.style.top = `${rect.top}px`;
    bannerRef.current.style.bottom = 'auto';
    bannerRef.current.style.right = 'auto';
    dragging.current = true;
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current || !bannerRef.current) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    bannerRef.current.style.left = `${newX}px`;
    bannerRef.current.style.top = `${newY}px`;
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      onMouseDown={handleMouseDown}
      className="cookie-card"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
        padding: '1rem',
        zIndex: 10000,
        width: '320px',
        cursor: 'grab',
      }}
    >
      <span className="title">🍪 {t('cookieTitle')}</span>
      <p className="description">
        {t('cookieDescription')}{' '}
        <a href="/cookie-policy">{t('cookiePolicyLink')}</a>
      </p>
      <div className="actions">
        <button className="pref" onClick={handleDeny}>
          {t('cookieDeny') || 'Reject'}
        </button>
        <button className="accept" onClick={handleAccept}>
          {t('cookieAccept')}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
