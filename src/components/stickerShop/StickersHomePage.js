import React from 'react';
import { Banner } from '../common/Banner';
import { Skills } from '../portfolio/Skills';
import { Projects } from '../portfolio/Projects';
import { StickerBanner } from './StickerBanner';
import { StickerCollections } from './StickerCollections'
import { StickerStore } from './StickerStore';
import { CartProvider } from '../features/cart/CartContext';
import { CartDisplay } from '../features/cart/CartDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';

function StickersHomePage() {
  return (
    <CartProvider>
      <div className="App">
        <StickerBanner />
        <StickerCollections />
        <StickerStore />
        {/* ... other components specific to the StickersHomePage ... */}
        <div style={{ position: 'fixed', bottom: 0, right: 0, width: '300px' }}>
          <CartDisplay />
        </div>
      </div>
    </CartProvider>
  );
}

export default StickersHomePage;

const BannerStickers = () => {
  return (
    <div className="banner-stickers">
      <Banner />
      {/* ... any other modifications or additions for the stickers banner ... */}
    </div>
  );
}