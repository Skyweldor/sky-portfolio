import React from 'react';
import IWCClientTrackerPrototype from '../components/portfolio/IWC_Prototype';
import ThemeProvider from '../config/themeContext';
import portfolioTheme from '../themes/portfolioTheme';

export default function Prototype() {
  return (
    <ThemeProvider theme={portfolioTheme}>
      <IWCClientTrackerPrototype />
    </ThemeProvider>
  );
}
