
/**
 * Shared utilities for multi-site architecture
 * These functions help with theming, routing, and component management
 */

export const getSiteFromPath = (pathname) => {
  if (pathname.startsWith('/stickers')) return 'stickers';
  if (pathname.startsWith('/makeup')) return 'makeup';
  if (pathname.startsWith('/aetherbound')) return 'aetherbound';
  if (pathname.startsWith('/minigames')) return 'minigames';
  return 'portfolio';
};

export const getThemeForSite = (siteName) => {
  const themeMap = {
    stickers: () => import('../themes/stickerTheme').then(m => m.default),
    makeup: () => import('../themes/beautyTheme').then(m => m.default),
    aetherbound: () => import('../themes/aetherboundTheme').then(m => m.default),
    portfolio: () => import('../themes/portfolioTheme').then(m => m.default)
  };
  
  return themeMap[siteName] || themeMap.portfolio;
};

export const getNavConfigForSite = (siteName) => {
  const navConfigs = {
    stickers: {
      showLogo: true,
      showSearch: false,
      showCart: true,
      logoText: 'SynthCity Stickers'
    },
    makeup: {
      showLogo: true,
      showSearch: true, 
      showCart: false,
      logoText: 'Beauty Lab'
    },
    portfolio: {
      showLogo: true,
      showSearch: false,
      showCart: false,
      logoText: 'SynthCity DigiLabs'
    }
  };
  
  return navConfigs[siteName] || navConfigs.portfolio;
};
