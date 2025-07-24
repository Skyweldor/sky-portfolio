
/**
 * Site-specific configurations for easy extraction
 */

export const siteConfigs = {
  stickers: {
    name: 'SynthCity Stickers',
    description: 'Premium digital sticker collection',
    primaryColor: '#D70000',
    routes: ['/stickers'],
    features: ['cart', 'collections', 'categories'],
    assets: 'src/assets/img/stickers',
    components: 'src/components/stickerShop'
  },
  
  makeup: {
    name: 'Beauty Lab',  
    description: 'Luxury makeup and beauty care',
    primaryColor: '#E2B84B',
    routes: ['/makeup'],
    features: ['product-gallery', 'kits', 'hero-banner'],
    assets: 'src/assets/img/makeup',
    components: 'src/components/beautyCare'
  },
  
  portfolio: {
    name: 'SynthCity DigiLabs',
    description: 'Interactive development portfolio',
    primaryColor: '#00b3ff',
    routes: ['/', '/blog', '/prototype'],
    features: ['projects', 'skills', 'contact'],
    assets: 'src/assets/img',
    components: 'src/components/portfolio'
  }
};

export const getConfigForSite = (siteName) => {
  return siteConfigs[siteName] || siteConfigs.portfolio;
};
