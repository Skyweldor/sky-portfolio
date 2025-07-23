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
import 'bootstrap/dist/css/bootstrap.min.css';
import SiteRoutes from './config/siteRoutes';
import Footer from './components/common/Footer';
import EmojiExplosion from './components/features/emoji/EmojiExplosion';

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
      <SiteRoutes />
      {/*If you want emoji explosions, uncomment:
      {explosions.map((explosion, index) => (
        <EmojiExplosion
          key={index}
          position={explosion}
          onAnimationEnd={() => handleAnimationEnd(explosion)}
        />
      ))}*/}
      <Footer />
    </div>
  );
}

export default App;
