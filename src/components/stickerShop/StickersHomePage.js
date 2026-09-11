import React from 'react';
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