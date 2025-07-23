import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Portfolio = lazy(() => import('../pages/Portfolio'));
const StickerShop = lazy(() => import('../pages/StickerShop'));
const Blog = lazy(() => import('../pages/Blog'));
const Prototype = lazy(() => import('../pages/Prototype'));
const Aetherbound = lazy(() => import('../pages/Aetherbound'));
const BeautyCare = lazy(() => import('../pages/BeautyCare'));
const MiniGames = lazy(() => import('../pages/MiniGames'));

export default function SiteRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/stickers" element={<StickerShop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/prototype" element={<Prototype />} />
          <Route path="/aetherbound" element={<Aetherbound />} />
          <Route path="/makeup" element={<BeautyCare />} />
          <Route path="/minigames" element={<MiniGames />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
