import React from 'react';
import StickersHomePage from '../components/stickerShop/StickersHomePage';
import ThemeProvider from '../config/themeContext';
import stickerTheme from '../themes/stickerTheme';

export default function StickerShop() {
  return (
    <ThemeProvider theme={stickerTheme}>
      <StickersHomePage />
    </ThemeProvider>
  );
}
