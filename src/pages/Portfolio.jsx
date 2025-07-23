import React from 'react';
import Homepage from '../components/portfolio/Homepage';
import ThemeProvider from '../config/themeContext';
import portfolioTheme from '../themes/portfolioTheme';

export default function Portfolio() {
  return (
    <ThemeProvider theme={portfolioTheme}>
      <Homepage />
    </ThemeProvider>
  );
}
