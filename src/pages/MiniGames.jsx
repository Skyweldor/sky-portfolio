import React from 'react';
import ThemeProvider from '../config/themeContext';
import portfolioTheme from '../themes/portfolioTheme';

export default function MiniGames() {
  return (
    <ThemeProvider theme={portfolioTheme}>
      <div>Mini games coming soon.</div>
    </ThemeProvider>
  );
}
