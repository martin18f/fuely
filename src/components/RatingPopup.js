import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';



const MiniRatingPopup = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');
  const popupRef = useRef(null);
    const position = useRef({ x: 0, y: 0 });
    const offset = useRef({ x: 0, y: 0 });
    const dragging = useRef(false);
    

  
  

    useEffect(() => {
        const lastRated = localStorage.getItem('lastRated');
        if (!localStorage.getItem('firstVisitDate')) {
          localStorage.setItem('firstVisitDate', new Date().toISOString());
        }
        if (!lastRated || Date.now() - parseInt(lastRated) > 7 * 24 * 60 * 60 * 1000) {
          setTimeout(() => setVisible(true), 1000);
        }
      }, []);

  const handleMouseDown = (e) => {
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      position.current = { x: rect.left, y: rect.top };
      popupRef.current.style.top = `${rect.top}px`;
      popupRef.current.style.left = `${rect.left}px`;
      popupRef.current.style.bottom = 'auto';
      popupRef.current.style.right = 'auto';
    }
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.current.x,
      y: e.clientY - position.current.y,
    };
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setRating(0);
      setHoverRating(0);
      setComment('');
    }, 1); // čas na fade-out
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    position.current = {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    };
    if (popupRef.current) {
      popupRef.current.style.right = 'auto';
      popupRef.current.style.left = `${position.current.x}px`;
      popupRef.current.style.top = `${position.current.y}px`;
      popupRef.current.style.bottom = 'auto';
    }
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

  const getDeviceType = () => /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';



  const handleSubmit = async () => {
    if (rating === 0) return;
    setStatus('loading');
    try {
      const feedbackData = {
        rating,
        comment,
        date: new Date().toISOString(),
        device: getDeviceType(),
        isReturningUser: !!localStorage.getItem('lastRated'),
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        firstVisitDate: localStorage.getItem('firstVisitDate')
      };
  
      await fetch('https://script.google.com/macros/s/AKfycbzHNRvqen4b1-DpRTS11JfMYFAEtaXestfTjWKJwwLhsYQ0QGF472ZzXWV6sSxDl6BG/exec', {
        method: 'POST',
        body: JSON.stringify(feedbackData),
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors'
      });
  
      localStorage.setItem('lastRated', Date.now().toString());
      setStatus('success');
      setTimeout(() => {
        setVisible(false);
        setStatus('idle');
        setComment('');
        setRating(0);
        setHoverRating(0);
      }, 2000);
    } catch (err) {
      console.error('Chyba pri odoslaní hodnotenia', err);
      setStatus('idle');
    }
  };
  

  if (!visible) return null;

  return (
    <div
    
    
    ref={popupRef}
        onMouseDown={handleMouseDown}
        className={`popup ${visible ? 'popup-show' : 'popup-hide'}`}
        style={{
            
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
            padding: '15px',
            zIndex: 9999,
            width: '300px',
            textAlign: 'center',
            animation: 'float 3s ease-in-out infinite',
            cursor: 'grab'
    }}
    >
      <div style={{ position: 'relative', marginBottom: '10px' }}>
  <p style={{ fontWeight: 'bold', margin: 0, textAlign: 'center' }}>
    {t('ratingTitle')}
  </p>
  <button
    onClick={handleClose}
    className="close-button"
    style={{
      position: 'absolute',
      top: '-4px',
      right: '-4px',
    }}
  />
</div>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: '1.9rem',
              cursor: 'pointer',
              color: star <= (hoverRating || rating) ? '#ffd700' : '#ccc',
              transition: '0.2s',
              textShadow: star <= (hoverRating || rating) ? '0 0 10px #ffd700' : 'none'
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <div className="input-container" style={{ marginTop: '10px' }}>
        <textarea
          name="comment"
          className="input"
          placeholder={t('placeholder')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          style={{ resize: 'none', width: '100%', boxSizing: 'border-box' }}
        />
        <div className="highlight"></div>
      </div>

      {status === 'idle' && (
        <button
          onClick={handleSubmit}
          style={{
            marginTop: '12px',
            backgroundColor: 'limegreen',
            fontFamily: 'Inter, Roboto, Helvetica Neue, sans-serif',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold'
          }}
        >
          {t('sendButton')}
        </button>
      )}

      {status === 'loading' && (
        <div style={{ marginTop: '15px' }}>
          <svg viewBox="25 25 50 50" style={{ width: '3.25em', transformOrigin: 'center', animation: 'rotate4 2s linear infinite' }}>
            <circle r="20" cy="50" cx="50" style={{ fill: 'none', stroke: 'hsl(214, 97%, 59%)', strokeWidth: 2, strokeDasharray: '1,200', strokeDashoffset: 0, strokeLinecap: 'round', animation: 'dash4 1.5s ease-in-out infinite' }}></circle>
          </svg>
        </div>
      )}

{status === 'success' && (
  <div style={{ marginTop: '15px' }}>
    <svg
      viewBox="0 0 52 52"
      style={{ width: '60px', height: '60px', display: 'block', margin: '0 auto' }}
    >
      <path
        fill="none"
        stroke="#4BB543"
        strokeWidth="4"
        d="M14 27 l7 7 l17 -17"
        style={{
          strokeDasharray: 50,
          strokeDashoffset: 50,
          animation: 'draw-check 0.8s ease forwards'
        }}
      />
    </svg>
  </div>
)}


      <style>{`
                .close-button {
  width: 1.8em;
  height: 1.8em;
  border: none;
  background: rgba(180, 83, 107, 0.11);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  padding: 0;
  position: relative; /* už nie absolute */
}

.close-button::before,
.close-button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.2em;
  height: 2px;
  background-color: #fff;
  transform-origin: center;
}

.close-button::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-button::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.close-button:hover {
  background-color: rgba(211, 21, 21, 0.8);
}

.close-button:active {
  background-color: rgb(130, 0, 0);
}

        
        
        
        .popup-show {
  animation: popupFadeIn 0.7s ease forwards, float 3s ease-in-out infinite;
}

.popup-hide {
  animation: popupFadeOut 0.7s ease forwards;
}

@keyframes popupFadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes popupFadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(15px); }
}

        
        @keyframes draw-check {
        to {
            stroke-dashoffset: 0;
        }
        }
        
        
        @keyframes rotate4 {
          100% { transform: rotate(360deg); }
        }
        @keyframes dash4 {
          0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 200; stroke-dashoffset: -35px; }
          100% { stroke-dashoffset: -125px; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .input-container { position: relative; }
        .input {
        font-family: 'Inter', 'Roboto', 'Helvetica Neue', sans-serif;
        font-size: 1em;
        padding: 0.6em 1em;
        border: none;
        border-radius: 6px;
        background-color: #f8f8f8;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        color: #333;
        width: 100%;
        box-sizing: border-box;
        }
        .input:hover { background-color: #f2f2f2; }
        .input:focus {
          outline: none;
          background-color: #fff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          animation: input-focus 0.3s ease;
        }
        .input::placeholder { color: #999; }
        .highlight {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: limegreen;
          transition: width 0.3s ease;
        }
        .input:focus + .highlight { width: 100%; }
        @keyframes input-focus {
          from { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0.1); }
          to { transform: scale(1.02); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        }
      `}</style>
    </div>
  );
};

export default MiniRatingPopup;
