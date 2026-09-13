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
import { ROUTES } from './config/routes';
import Footer from './components/common/Footer';
import PageTransition from './components/common/PageTransition';
import { TransitionProvider, useTransition } from './context/TransitionContext';
import { lazy, Suspense } from 'react';

// Lazy load all pages
const GlobeLanding = lazy(() => import('./pages/GlobeLanding'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const StickerShop = lazy(() => import('./pages/StickerShop'));
const Blog = lazy(() => import('./pages/blog/Blog'));
const Prototype = lazy(() => import('./pages/Prototype'));
const Aetherbound = lazy(() => import('./pages/Aetherbound'));
const BeautyCare = lazy(() => import('./pages/BeautyCare'));
const MiniGames = lazy(() => import('./pages/MiniGames'));
const Catalog = lazy(() => import('./pages/Catalog'));
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail'));
const AllPokedex = lazy(() => import('./pages/pokedex/AllPokedex'));
const KantoPokedex = lazy(() => import('./pages/pokedex/KantoPokedex'));
const JohtoPokedex = lazy(() => import('./pages/pokedex/JohtoPokedex'));
const HoennPokedex = lazy(() => import('./pages/pokedex/HoennPokedex'));
const SinnohPokedex = lazy(() => import('./pages/pokedex/SinnohPokedex'));
const UnovaPokedex = lazy(() => import('./pages/pokedex/UnovaPokedex'));
const PokeMMOJournal = lazy(() => import('./pages/blog/PokeMMOJournal'));
const PokeMMOJournal2 = lazy(() => import('./pages/blog/PokeMMOJournal2'));
const AnimationHarness = lazy(() => import('./pages/blog/AnimationHarness'));
const MaterialsHarness = lazy(() => import('./pages/blog/MaterialsHarness'));
const IsoSpriteHarness = lazy(() => import('./pages/blog/IsoSpriteHarness'));

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
  const isMakeupSite = location.pathname.startsWith('/makeup');

  return (
    <>
      {children}
      {!isLandingPage && !isMakeupSite && <Footer />}
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
              <Route path={ROUTES.home} element={<GlobeLanding />} />

              {/* SynthCity DigiLabs Interactive */}
              <Route path={ROUTES.interactive} element={<Portfolio />} />
              <Route path={ROUTES.blog} element={<Blog />} />
              <Route path={ROUTES.pokedex} element={<AllPokedex />} />
              <Route path={ROUTES.regionPokedex('kanto')} element={<KantoPokedex />} />
              <Route path={ROUTES.regionPokedex('johto')} element={<JohtoPokedex />} />
              <Route path={ROUTES.regionPokedex('hoenn')} element={<HoennPokedex />} />
              <Route path={ROUTES.regionPokedex('sinnoh')} element={<SinnohPokedex />} />
              <Route path={ROUTES.regionPokedex('unova')} element={<UnovaPokedex />} />
              <Route path={ROUTES.pokemmoJournal(1)} element={<PokeMMOJournal />} />
              <Route path={ROUTES.pokemmoJournal(2)} element={<PokeMMOJournal2 />} />
              <Route path={ROUTES.animationHarness} element={<AnimationHarness />} />
              <Route path={ROUTES.materialsHarness} element={<MaterialsHarness />} />
              <Route path={ROUTES.isoSpriteHarness} element={<IsoSpriteHarness />} />
              <Route path={ROUTES.downloads} element={<Catalog />} />
              <Route path={ROUTES.download(':id')} element={<BlogDetail />} />
              <Route path={ROUTES.aetherbound} element={<Aetherbound />} />
              <Route path={ROUTES.minigames} element={<MiniGames />} />
              <Route path={ROUTES.prototype} element={<Prototype />} />

              {/* Gated from the globe at launch; direct URLs still resolve */}
              <Route path={ROUTES.makeup} element={<BeautyCare />} />
              <Route path={ROUTES.stickers} element={<StickerShop />} />
            </Routes>
          </Suspense>
        </Layout>
        <GlobalTransition />
      </TransitionProvider>
    </BrowserRouter>
  );
}

export default App;
