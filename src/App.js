import './styles/global.css';
import './styles/components/skills.css';
import './styles/components/projects.css';
import './styles/pages/stickers.css';
import './styles/pages/blog.css';
import './styles/modules/cart.css';
import './styles/modules/aetherbound.css';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/common/Footer';
import PageTransition from './components/common/PageTransition';
import EmojiExplosion from './components/features/emoji/EmojiExplosion';
import { lazy, Suspense } from 'react';

// Lazy load all pages
const GlobeLanding = lazy(() => import('./pages/GlobeLanding'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const StickerShop = lazy(() => import('./pages/StickerShop'));
const Blog = lazy(() => import('./pages/Blog'));
const Prototype = lazy(() => import('./pages/Prototype'));
const Aetherbound = lazy(() => import('./pages/Aetherbound'));
const BeautyCare = lazy(() => import('./pages/BeautyCare'));
const MiniGames = lazy(() => import('./pages/MiniGames'));
const Catalog = lazy(() => import('./pages/Catalog'));

// Layout component that conditionally shows footer and handles transitions
function Layout({ children }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <PageTransition key={location.pathname}>
        {children}
      </PageTransition>
      {!isLandingPage && <Footer />}
    </>
  );
}

function App() {
  const [explosions, setExplosions] = useState([]);

  const handleMouseClick = (e) => {
    const newExplosion = {
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY
    };
    setExplosions(prev => [...prev, newExplosion]);
  };

  const handleAnimationEnd = (explosionToRemove) => {
    setExplosions(prev => prev.filter(exp => exp !== explosionToRemove));
  };

  return (
    <div onClick={handleMouseClick}>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<GlobeLanding />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/stickers" element={<StickerShop />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/prototype" element={<Prototype />} />
              <Route path="/aetherbound" element={<Aetherbound />} />
              <Route path="/makeup" element={<BeautyCare />} />
              <Route path="/minigames" element={<MiniGames />} />
              <Route path="/catalog" element={<Catalog />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
      {/*If you want emoji explosions, uncomment:
      {explosions.map((explosion, index) => (
        <EmojiExplosion
          key={index}
          position={explosion}
          onAnimationEnd={() => handleAnimationEnd(explosion)}
        />
      ))}*/}
    </div>
  );
}

export default App;
