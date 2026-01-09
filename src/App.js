import './styles/global.css';
import './styles/components/skills.css';
import './styles/components/projects.css';
import './styles/pages/stickers.css';
import './styles/pages/blog.css';
import './styles/modules/cart.css';
import './styles/modules/aetherbound.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/common/Footer';
import PageTransition from './components/common/PageTransition';
import { TransitionProvider, useTransition } from './context/TransitionContext';
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

// Global transition overlay that responds to context
// Only renders when transition is active to avoid any blocking
function GlobalTransition() {
  const { transition } = useTransition();
  // Early return - render nothing when not showing
  if (!transition.show) return null;
  return <PageTransition show={true} text={transition.text} />;
}

// Layout component that conditionally shows footer
function Layout({ children }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {children}
      {!isLandingPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Layout>
          <Suspense fallback={null}>
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
        <GlobalTransition />
      </TransitionProvider>
    </BrowserRouter>
  );
}

export default App;
