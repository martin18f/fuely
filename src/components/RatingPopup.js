import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RatingPopup.css';

const RATING_DELAY_MS = 1200;
const RATING_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

const safeLocalStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      // Best effort only.
    }
  },
};

const getDeviceType = () =>
  /Mobi|Android/i.test(window.navigator.userAgent) ? 'mobile' : 'desktop';

const shouldShowRating = () => {
  const lastRated = Number(safeLocalStorage.get('lastRated'));
  return !lastRated || Date.now() - lastRated > RATING_COOLDOWN_MS;
};

const RatingPopup = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const popupRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!safeLocalStorage.get('firstVisitDate')) {
      safeLocalStorage.set('firstVisitDate', new Date().toISOString());
    }

    if (!shouldShowRating()) return undefined;

    const timeoutId = window.setTimeout(() => {
      setVisible(true);
    }, RATING_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!isDraggingRef.current || !popupRef.current) return;

      const nextLeft = event.clientX - dragOffsetRef.current.x;
      const nextTop = event.clientY - dragOffsetRef.current.y;
      popupRef.current.style.left = `${Math.max(8, nextLeft)}px`;
      popupRef.current.style.top = `${Math.max(8, nextTop)}px`;
      popupRef.current.style.right = 'auto';
      popupRef.current.style.bottom = 'auto';
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setErrorMessage('');
    setStatus('idle');
  };

  const handleClose = () => {
    setVisible(false);
    window.setTimeout(resetForm, 250);
  };

  const handleDragStart = (event) => {
    if (!popupRef.current || event.pointerType === 'touch') return;

    const rect = popupRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    popupRef.current.style.left = `${rect.left}px`;
    popupRef.current.style.top = `${rect.top}px`;
    popupRef.current.style.right = 'auto';
    popupRef.current.style.bottom = 'auto';
    isDraggingRef.current = true;
  };

  const handleSubmit = async () => {
    if (!rating || status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    const feedbackData = {
      rating,
      comment,
      date: new Date().toISOString(),
      device: getDeviceType(),
      isReturningUser: Boolean(safeLocalStorage.get('lastRated')),
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      firstVisitDate: safeLocalStorage.get('firstVisitDate'),
      page: window.location.href,
    };

    try {
      const response = await fetch('/api/submit-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      safeLocalStorage.set('lastRated', Date.now().toString());
      setStatus('success');
      window.setTimeout(handleClose, 1800);
    } catch (error) {
      console.error('Rating submit error', error);
      setStatus('error');
      setErrorMessage(t('ratingSubmitError'));
    }
  };

  if (!visible) return null;

  const selectedRating = hoverRating || rating;

  return (
    <aside
      ref={popupRef}
      className="ratingPopup"
      aria-live="polite"
      aria-labelledby="rating-popup-title"
    >
      <div
        className="ratingPopupHeader"
        onPointerDown={handleDragStart}
      >
        <p id="rating-popup-title">{t('ratingTitle')}</p>
        <button
          type="button"
          className="ratingCloseButton"
          onClick={handleClose}
          aria-label={t('ratingClose')}
        />
      </div>

      <p className="ratingPopupHint">{t('ratingHint')}</p>

      <div className="ratingStars" role="radiogroup" aria-label={t('ratingTitle')}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={`ratingStar ${star <= selectedRating ? 'isActive' : ''}`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onFocus={() => setHoverRating(star)}
            onBlur={() => setHoverRating(0)}
            onClick={() => {
              setRating(star);
              setErrorMessage('');
              if (status === 'error') setStatus('idle');
            }}
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} ${t('stars')}`}
          >
            <span aria-hidden="true">★</span>
          </button>
        ))}
      </div>

      <label className="ratingCommentLabel" htmlFor="rating-comment">
        <span>{t('placeholder')}</span>
        <textarea
          id="rating-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows="3"
          maxLength={1200}
        />
      </label>

      {status === 'error' && (
        <p className="ratingMessage ratingMessageError" role="alert">
          {errorMessage}
        </p>
      )}

      {status === 'success' && (
        <p className="ratingMessage ratingMessageSuccess">
          {t('ratingSubmitSuccess')}
        </p>
      )}

      <button
        type="button"
        className="ratingSubmitButton"
        onClick={handleSubmit}
        disabled={!rating || status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? t('ratingSubmitting') : t('sendButton')}
      </button>
    </aside>
  );
};

export default RatingPopup;
