import React from 'react';
import MakeupHomePage from '../components/beautyCare/MakeupHomepage';
import ThemeProvider from '../config/themeContext';
import beautyTheme from '../themes/beautyTheme';

export default function BeautyCare() {
  return (
    <ThemeProvider theme={beautyTheme}>
      <MakeupHomePage />
    </ThemeProvider>
  );
}
