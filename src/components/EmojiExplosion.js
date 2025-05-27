import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './EmojiExplosion.css';

const EmojiExplosion = ({ position, onAnimationEnd }) => {
  const initialEmojis = ['😀', '😍', '🎉', '❤️', '🌟', '🚀'];
  
  // State to store the randomized emojis
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    // Shuffle the emojis array for random order only once when the component mounts
    setEmojis(initialEmojis.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    const timer = setTimeout(onAnimationEnd, 1000); // Lengthened the timeout to 1.2 seconds
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const explosionElement = (
    <div className="emoji-explosion" style={{ top: position.y, left: position.x }}>
      {emojis.map((emoji, index) => (
        <span key={index} className={`emoji emoji-${index}`}>
          {emoji}
        </span>
      ))}
    </div>
  );

  // Use React Portal to render the explosion at the root level
  return ReactDOM.createPortal(explosionElement, document.body);
};

export default EmojiExplosion;
