import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ShareButton = ({ theme }) => {
  const { t } = useTranslation();
  const buttonRef = useRef(null);
  const position = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  const handleMouseDown = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    position.current = { x: rect.left, y: rect.top };
    buttonRef.current.style.left = `${rect.left}px`;
    buttonRef.current.style.top = `${rect.top}px`;
    buttonRef.current.style.right = 'auto';
    buttonRef.current.style.bottom = 'auto';
    dragging.current = true;
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    buttonRef.current.style.left = `${newX}px`;
    buttonRef.current.style.top = `${newY}px`;
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fuely – Fuel Cost Calculator',
          text: t('seoDescription'),
          url: window.location.href,
        });
      } catch (err) {
        console.error('Zdieľanie zrušené alebo zlyhalo:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('thankYouMessage') || 'Link copied!');
    }
  };

  return (
    <div
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onClick={handleShare}
      title={t('shareApp')}
      className={`shareButtonGlass ${
        theme === 'dark' ? 'shareButtonGlassDark' : 'shareButtonGlassLight'
      }`}
    >
      🔗 {t('shareApp')}
    </div>
  );
};

export default ShareButton;
