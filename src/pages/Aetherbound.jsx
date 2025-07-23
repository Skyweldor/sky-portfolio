import React from 'react';
import AetherboundGame from '../components/aetherbound/AetherboundGame';
import ThemeProvider from '../config/themeContext';
import aetherboundTheme from '../themes/aetherboundTheme';

export default function Aetherbound() {
  return (
    <ThemeProvider theme={aetherboundTheme}>
      <AetherboundGame />
    </ThemeProvider>
  );
}
