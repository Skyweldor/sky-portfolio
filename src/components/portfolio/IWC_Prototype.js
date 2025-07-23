import React from 'react';
import { Banner } from '../common/Banner';
import { Skills } from './Skills';
import { Projects } from './Projects';
import { StickerBanner } from '../stickerShop/StickerBanner';
import { StickerCollections } from '../stickerShop/StickerCollections'
import { StickerStore } from '../stickerShop/StickerStore';
import { CartProvider } from '../features/cart/CartContext';
import { CartDisplay } from '../features/cart/CartDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';

function IWCClientTrackerPrototype() {
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

export default IWCClientTrackerPrototype;