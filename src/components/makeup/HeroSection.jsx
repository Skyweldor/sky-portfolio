// HeroSection.jsx
import React from 'react';
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
import './css/HeroSection.css';
import lipstick from './images/lipstick_example_00.png';
import lipstick_processed from './images/lipstick_example_00_processed.png';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const particlesInit = async (main) => {
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets if desired
    await loadFull(main);
  };

  const particlesLoaded = (container) => {
    // Particles loaded successfully
  };

  const particlesOptions = {
    fullScreen: { enable: false },
    particles: {
      number: {
        value: 50, // adjust for density
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#E2B84B", // our metallic gold color
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.8,
        anim: {
          enable: true,
          speed: 2,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "top", // particles drifting upward
        random: true,
        straight: false,
        outMode: "out",
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: false,
        },
        onClick: {
          enable: false,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <header className="hero-section">
      {/* Particle background overlay */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
        className="particle-overlay"
      />
      {/* NAV + LOGO ROW */}
      <div className="hero-nav-row">
        <div className="logo-area">
          <h1 className="shimmer-text">ELEVATE</h1>
          {/* Could be an <img> if you have a logo image */}
        </div>
        <nav className="hero-nav">
          <ul>
            <li><Link to="/makeup">Makeup</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            {/* Additional nav items */}
          </ul>
        </nav>
      </div>

      {/* MAIN HERO CONTENT */}
      <div className="hero-content-wrapper">
        <div className="glass-card">
          <div className="hero-text">
            <h2 className="embossed-text">Your Everyday Glamour</h2>
            <p>Discover our curated makeup kits and essentials.</p>
            <button className="hero-button">Shop Now</button>
          </div>
        </div>

        {/* PRODUCT SNIPPET / CAROUSEL SPOT (could be replaced with a small slider) */}
        <div className="hero-product-snippet glass-card">
          <img
            src={lipstick_processed}
            alt="Featured Lipstick"
            className="featured-product-image"
          />
          <div className="product-info">
            <h3 className="embossed-text">Featured Lipstick</h3>
            <p className="small-desc">Bold, long-lasting color</p>
          </div>
        </div>
      </div>

      {/* SCROLLING TICKER */}
      <div className="ticker-bar">
        <marquee behavior="scroll" direction="left" scrollamount="4">
          <span>★ New Arrivals in Stock ★ Grab Our Limited Edition Kits ★ Free Local Delivery on Orders $50+ ★</span>
        </marquee>
      </div>
    </header>
  );
};

export default HeroSection;
