import React, { createContext, useContext, useLayoutEffect } from 'react';

const ThemeContext = createContext({});
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ theme, children }) {
  useLayoutEffect(() => {
    if (theme) {
      if (theme.colors) {
        Object.entries(theme.colors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key}`, value);
        });
      }
      if (theme.fonts) {
        Object.entries(theme.fonts).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key}`, value);
        });
      }
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
