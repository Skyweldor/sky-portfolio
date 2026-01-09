import React, { useEffect, useState } from 'react';
import './PageTransition.css';

/**
 * Full-screen page transition overlay with neon bloom aesthetic.
 * Uses inline styles as fallback to ensure styling even before CSS loads.
 */
export default function PageTransition({
  show = false,
  entrance = false,
  text = 'Loading...',
  duration = 800,
  onComplete = null
}) {
  const [visible, setVisible] = useState(entrance || show);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Entrance mode: show on mount, then fade out after duration
  useEffect(() => {
    if (entrance && visible && !fadeOut) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setHidden(true);
          setVisible(false);
          onComplete?.();
        }, 600);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [entrance, visible, fadeOut, duration, onComplete]);

  // Controlled mode: respond to show prop changes
  useEffect(() => {
    if (!entrance) {
      if (show && !visible) {
        setHidden(false);
        setFadeOut(false);
        setVisible(true);
      } else if (!show && visible && !fadeOut) {
        setFadeOut(true);
        setTimeout(() => {
          setHidden(true);
          setVisible(false);
          onComplete?.();
        }, 600);
      }
    }
  }, [show, entrance, visible, fadeOut, onComplete]);

  // Don't render if:
  // - hidden is true (completely done), OR
  // - not visible AND not entrance mode AND show is false (controlled mode not active)
  if (hidden || (!visible && !entrance && !show)) return null;

  // Determine if we should show or fade based on mode
  // For controlled mode (!entrance), use show prop directly; for entrance mode, use fadeOut state
  const shouldFade = entrance ? fadeOut : (!show && fadeOut);
  const shouldShow = entrance ? !fadeOut : show;

  // Inline styles as fallback (CSS file provides additional effects)
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(ellipse at center, #020924 0%, #010612 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    transition: 'opacity 0.6s ease, visibility 0.6s ease',
    visibility: shouldShow ? 'visible' : 'hidden',
    opacity: shouldShow ? 1 : 0,
    pointerEvents: shouldShow ? 'auto' : 'none',
    overflow: 'hidden',
    fontFamily: '"IBM Plex Mono", "Courier New", monospace'
  };

  const gridStyle = {
    position: 'absolute',
    bottom: 0,
    left: '-50%',
    width: '200%',
    height: '40%',
    background: `
      linear-gradient(90deg, transparent 0%, transparent 49%, rgba(0, 221, 255, 0.1) 49%, rgba(0, 221, 255, 0.1) 51%, transparent 51%, transparent 100%),
      linear-gradient(0deg, rgba(0, 221, 255, 0.2) 0%, transparent 100%)
    `,
    backgroundSize: '80px 100%, 100% 100%',
    transform: 'perspective(500px) rotateX(60deg)',
    transformOrigin: 'center bottom',
    opacity: 0.6
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  };

  const headerStyle = {
    textAlign: 'center',
    color: '#00ddff',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '4px',
    marginBottom: '60px',
    textShadow: '0 0 10px rgba(0, 221, 255, 0.8), 0 0 20px rgba(0, 221, 255, 0.5), 0 0 40px rgba(0, 221, 255, 0.3)'
  };

  const spinnerContainerStyle = {
    position: 'relative',
    width: '120px',
    height: '120px',
    marginBottom: '50px'
  };

  const spinnerOuterStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100px',
    height: '100px',
    border: '1px solid rgba(0, 221, 255, 0.1)',
    borderTop: '1px solid rgba(0, 221, 255, 0.4)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'transitionSpinReverse 2s linear infinite'
  };

  const spinnerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '80px',
    height: '80px',
    border: '2px solid rgba(0, 221, 255, 0.15)',
    borderTop: '2px solid #00ddff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 20px rgba(0, 221, 255, 0.5), 0 0 40px rgba(0, 221, 255, 0.3), inset 0 0 20px rgba(0, 221, 255, 0.1)',
    animation: 'transitionSpin 1s linear infinite'
  };

  const spinnerCoreStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '20px',
    height: '20px',
    background: 'radial-gradient(circle, #00ddff 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'transitionCorePulse 1.5s ease-in-out infinite'
  };

  const statusStyle = {
    textAlign: 'center',
    color: '#00ddff',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '30px',
    textShadow: '0 0 10px rgba(0, 221, 255, 0.7), 0 0 20px rgba(0, 221, 255, 0.4)',
    minHeight: '24px',
    letterSpacing: '1px'
  };

  const footerStyle = {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    color: 'rgba(0, 221, 255, 0.3)',
    fontSize: '10px',
    letterSpacing: '3px'
  };

  return (
    <div className={`page-transition-overlay ${!shouldShow ? 'fade-out' : ''}`} style={overlayStyle}>
      <div className="page-transition-grid" style={gridStyle} />

      <div className="page-transition-content" style={contentStyle}>
        <div className="page-transition-header" style={headerStyle}>[ SYNTHCITY DIGILABS ]</div>

        <div className="page-transition-spinner-container" style={spinnerContainerStyle}>
          <div className="page-transition-spinner-outer" style={spinnerOuterStyle} />
          <div className="page-transition-spinner" style={spinnerStyle} />
          <div className="page-transition-spinner-core" style={spinnerCoreStyle} />
        </div>

        <div className="page-transition-status" style={statusStyle}>{text}</div>

        <div className="page-transition-footer" style={footerStyle}>{'// NAVIGATING //'}</div>
      </div>

      {/* Inline keyframes for animations */}
      <style>{`
        @keyframes transitionSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes transitionSpinReverse {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes transitionCorePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
