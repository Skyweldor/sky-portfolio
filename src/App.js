import logo from './logo.svg';
import './styles/global.css';
import './styles/components/navbar.css';
import './styles/components/banner.css';
import './styles/components/skills.css';
import './styles/components/projects.css';
import './styles/pages/stickers.css';
import './styles/pages/blog.css';
import './styles/modules/cart.css';
import './styles/modules/aetherbound.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import StickersHomePage from './components/StickersHomePage';
import BlogPage from './components/BlogPage';
import { NavBar } from './components/NavBar';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmojiExplosion from './components/EmojiExplosion';
import IWCClientTrackerPrototype from './components/IWC_Prototype';

// Import your game component
import AetherboundGame from './components/Aetherbound/AetherboundGame';
// Import your new makeup page
import MakeupHomePage from './components/makeup/MakeupHomepage';

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
    <Router>
      <div onClick={handleMouseClick}>
        {/*<NavBar />*/}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/stickers" element={<StickersHomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Original line with IWCClientTrackerPrototype might be redundant if it's using the same path "/" */}
          <Route path="/prototype" element={<IWCClientTrackerPrototype />} />
          {/* New route for Aetherbound game */}
          <Route path="/aetherbound" element={<AetherboundGame />} />
          {/* New route for your makeup microsite */}
          <Route path="/makeup" element={<MakeupHomePage />} />
        </Routes>
        {/*If you want emoji explosions, uncomment:
        {explosions.map((explosion, index) => (
          <EmojiExplosion 
            key={index} 
            position={explosion} 
            onAnimationEnd={() => handleAnimationEnd(explosion)} 
          />
        ))}*/}
      </div>
      <Footer />
    </Router>
  );
}

export default App;
