import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUBSITE_NAV } from '../../data/subsiteNavConfig';
import { ROUTES } from '../../config/routes';
import styles from './GlobeMobileMenu.module.css';

const MENU_CONFIG = {
  services: [
    { text: 'Game Development', url: ROUTES.interactive },
    { text: 'Quantitative Finance', url: '#', disabled: true },
    { text: 'Tutoring', url: '#', disabled: true }
  ],
  ecommerce: [
    { text: 'Make-Up/Skincare', url: ROUTES.makeup, disabled: true },
    { text: 'Stickers', url: ROUTES.stickers, disabled: true }
  ]
};

// Match a menu item to a SUBSITE_NAV entry by URL so we don't depend on the
// item's display text matching the desktop label verbatim.
const getSubLinks = (url) => {
  if (!url || url === '#') return [];
  const entry = Object.values(SUBSITE_NAV).find((e) => e.url === url);
  return entry?.links ?? [];
};

export default function GlobeMobileMenu({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);
  const navigate = useNavigate();

  // Store long-press timers in a ref to avoid mutating config objects
  const longPressTimers = useRef({});

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

  // Start long-press timer
  const startLongPress = useCallback((itemId) => {
    longPressTimers.current[itemId] = setTimeout(() => handleLongPress(itemId), 500);
  }, [handleLongPress]);

  // Cancel long-press timer
  const cancelLongPress = useCallback((itemId) => {
    if (longPressTimers.current[itemId]) {
      clearTimeout(longPressTimers.current[itemId]);
      delete longPressTimers.current[itemId];
    }
  }, []);

  const handleNavigation = (url, disabled, navState) => {
    if (disabled || !url || url === '#') return;

    setIsOpen(false);
    setExpandedKey(null);

    // Use the provided navigation handler if available (for transition overlay)
    if (onNavigate) {
      onNavigate(url, navState);
    } else {
      // Fallback to direct navigation
      document.body.classList.add('page-exit');
      setTimeout(() => {
        document.body.classList.remove('page-exit');
        navigate(url, navState ? { state: navState } : undefined);
      }, 500);
    }
  };

  const toggleExpand = (key) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowHint(false);
    if (isOpen) setExpandedKey(null);
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
      setExpandedKey(null);
    }
  };

  const renderItem = (item, idx, prefix) => {
    const itemId = `${prefix}-${idx}`;
    const subLinks = item.disabled ? [] : getSubLinks(item.url);
    const hasDropdown = subLinks.length > 0;
    const isExpanded = expandedKey === itemId;

    return (
      <div key={idx} className={styles.menuItemGroup}>
        <div className={styles.menuItemRow}>
          <button
            className={`${styles.menuItem} ${item.disabled ? styles.disabled : ''} ${activeItem === itemId ? styles.longPressActive : ''}`}
            onClick={() => handleNavigation(item.url, item.disabled)}
            disabled={item.disabled}
            onTouchStart={() => !item.disabled && startLongPress(itemId)}
            onTouchEnd={() => cancelLongPress(itemId)}
            onTouchCancel={() => cancelLongPress(itemId)}
          >
            <span className={styles.itemPrefix}>&gt;</span>
            <span className={styles.itemText}>{item.text}</span>
            {item.disabled && <span className={styles.statusTag}>OFFLINE</span>}
          </button>
          {hasDropdown && (
            <button
              className={`${styles.expandToggle} ${isExpanded ? styles.expanded : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleExpand(itemId); }}
              aria-label={isExpanded ? 'Collapse sub-menu' : 'Expand sub-menu'}
              aria-expanded={isExpanded}
            >
              {isExpanded ? '\u2212' : '+'}
            </button>
          )}
        </div>
        {hasDropdown && isExpanded && (
          <div className={styles.subLinks}>
            {subLinks.map((link, sidx) => (
              <button
                key={sidx}
                className={styles.subLink}
                onClick={() => handleNavigation(
                  link.url,
                  false,
                  link.scrollTo ? { scrollTo: link.scrollTo } : undefined
                )}
              >
                <span className={styles.subLinkPrefix}>&rsaquo;</span>
                <span className={styles.subLinkText}>{link.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
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

            {/* Services Section */}
            <div className={styles.pdaHeader}>
              <span className={styles.bracket}>[</span>
              <span className={styles.headerText}>SERVICES</span>
              <span className={styles.bracket}>]</span>
            </div>
            <div className={styles.section}>
              {MENU_CONFIG.services.map((item, idx) => renderItem(item, idx, 'svc'))}
            </div>

            {/* E-Commerce Section */}
            <div className={styles.sectionHeader}>
              <span className={styles.bracket}>[</span>
              <span className={styles.headerText}>E-COMMERCE</span>
              <span className={styles.bracket}>]</span>
            </div>
            <div className={styles.section}>
              {MENU_CONFIG.ecommerce.map((item, idx) => renderItem(item, idx, 'eco'))}
            </div>

            {/* Footer */}
            <div className={styles.pdaFooter}>
              <span className={styles.footerText}>{'// SYNTHCITY DIGILABS //'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
