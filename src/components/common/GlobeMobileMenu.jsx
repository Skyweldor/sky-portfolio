import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GlobeMobileMenu.module.css';

const MENU_CONFIG = {
  navigation: [
    { text: 'Home', url: '/' },
    { text: 'Skills', url: '/portfolio' },
    { text: 'Projects', url: '/portfolio' },
    { text: 'Downloads', url: '/catalog' }
  ],
  services: [
    { text: 'Game Development', url: '/portfolio' },
    { text: 'Quantitative Finance', url: '#', disabled: true },
    { text: 'Tutoring', url: '#', disabled: true }
  ],
  ecommerce: [
    { text: 'Make-Up/Skincare', url: '/makeup' },
    { text: 'Stickers', url: '/stickers' }
  ]
};

export default function GlobeMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  // Hide hint after first interaction or timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Long-press handler for hover effect
  const handleLongPress = useCallback((itemId) => {
    setActiveItem(itemId);
    // Auto-clear after 2 seconds
    setTimeout(() => setActiveItem(null), 2000);
  }, []);

  const handleNavigation = (url, disabled) => {
    if (disabled || !url || url === '#') return;

    setIsOpen(false);
    document.body.classList.add('page-exit');
    setTimeout(() => {
      document.body.classList.remove('page-exit');
      navigate(url);
    }, 500);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowHint(false);
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Icon */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.open : ''} ${showHint ? styles.pulse : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
      </button>

      {/* Overlay + Panel */}
      {isOpen && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.pdaPanel}>
            {/* Scanline effect */}
            <div className={styles.scanlines} />

            {/* Header */}
            <div className={styles.pdaHeader}>
              <span className={styles.bracket}>[</span>
              <span className={styles.headerText}>NAVIGATION</span>
              <span className={styles.bracket}>]</span>
            </div>

            {/* Navigation Section */}
            <div className={styles.section}>
              {MENU_CONFIG.navigation.map((item, idx) => {
                const itemId = `nav-${idx}`;
                return (
                  <button
                    key={idx}
                    className={`${styles.menuItem} ${activeItem === itemId ? styles.longPressActive : ''}`}
                    onClick={() => handleNavigation(item.url, false)}
                    onTouchStart={() => {
                      const timer = setTimeout(() => handleLongPress(itemId), 500);
                      item._timer = timer;
                    }}
                    onTouchEnd={() => clearTimeout(item._timer)}
                    onTouchCancel={() => clearTimeout(item._timer)}
                  >
                    <span className={styles.itemPrefix}>&gt;</span>
                    <span className={styles.itemText}>{item.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Services Section */}
            <div className={styles.sectionHeader}>
              <span className={styles.bracket}>[</span>
              <span className={styles.headerText}>SERVICES</span>
              <span className={styles.bracket}>]</span>
            </div>
            <div className={styles.section}>
              {MENU_CONFIG.services.map((item, idx) => {
                const itemId = `svc-${idx}`;
                return (
                  <button
                    key={idx}
                    className={`${styles.menuItem} ${item.disabled ? styles.disabled : ''} ${activeItem === itemId ? styles.longPressActive : ''}`}
                    onClick={() => handleNavigation(item.url, item.disabled)}
                    disabled={item.disabled}
                    onTouchStart={() => {
                      if (!item.disabled) {
                        const timer = setTimeout(() => handleLongPress(itemId), 500);
                        item._timer = timer;
                      }
                    }}
                    onTouchEnd={() => clearTimeout(item._timer)}
                    onTouchCancel={() => clearTimeout(item._timer)}
                  >
                    <span className={styles.itemPrefix}>&gt;</span>
                    <span className={styles.itemText}>{item.text}</span>
                    {item.disabled && <span className={styles.statusTag}>OFFLINE</span>}
                  </button>
                );
              })}
            </div>

            {/* E-Commerce Section */}
            <div className={styles.sectionHeader}>
              <span className={styles.bracket}>[</span>
              <span className={styles.headerText}>E-COMMERCE</span>
              <span className={styles.bracket}>]</span>
            </div>
            <div className={styles.section}>
              {MENU_CONFIG.ecommerce.map((item, idx) => {
                const itemId = `eco-${idx}`;
                return (
                  <button
                    key={idx}
                    className={`${styles.menuItem} ${activeItem === itemId ? styles.longPressActive : ''}`}
                    onClick={() => handleNavigation(item.url, false)}
                    onTouchStart={() => {
                      const timer = setTimeout(() => handleLongPress(itemId), 500);
                      item._timer = timer;
                    }}
                    onTouchEnd={() => clearTimeout(item._timer)}
                    onTouchCancel={() => clearTimeout(item._timer)}
                  >
                    <span className={styles.itemPrefix}>&gt;</span>
                    <span className={styles.itemText}>{item.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className={styles.pdaFooter}>
              <span className={styles.footerText}>// SYNTHCITY DIGILABS //</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
