import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const [transition, setTransition] = useState({
    show: false,
    text: 'Loading...'
  });
  const timerRef = useRef(null);

  const startTransition = useCallback((text = 'Navigating...', duration = 800) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setTransition({ show: true, text });

    // Auto-hide after duration
    timerRef.current = setTimeout(() => {
      setTransition(prev => ({ ...prev, show: false }));
    }, duration);
  }, []);

  const endTransition = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setTransition(prev => ({ ...prev, show: false }));
  }, []);

  return (
    <TransitionContext.Provider value={{ transition, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
