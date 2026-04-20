// HeroSection.jsx
import React from 'react';
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
import './css/HeroSection.css';
import lipstick from './images/lipstick_example_00.png';
import lipstick_processed from './images/lipstick_example_00_processed.png';
import { Link } from 'react-router-dom';
import { NavGlobe } from '../common/NavGlobe';
import GoldTitle from './GoldTitle';

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
        value: 90,
        density: {
          enable: true,
          value_area: 900,
        },
      },
      color: {
        value: ["#E2B84B", "#EBC9A4", "#F8D8D5", "#FAF8F5"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.15, max: 0.5 },
        anim: {
          enable: true,
          speed: 0.8,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: { min: 10, max: 60 },
        random: true,
      },
      move: {
        enable: true,
        speed: 0.4,
        direction: "none",
        random: true,
        straight: false,
        outMode: "out",
        drift: 0.3,
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
    <header className="hero-section" role="banner">
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
          <NavGlobe size={32} color={0xE2B84B} ringColor={0xEBC9A4} navigateTo="/" />
          <h1 className="shimmer-text">ELEVATE</h1>
        </div>
        <nav className="hero-nav" aria-label="Main navigation">
          <ul>
            <li><Link to="/makeup">Makeup</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            {/* Additional nav items */}
          </ul>
        </nav>
      </div>

      {/* 3D GOLD TITLE — centerpiece */}
      <div className="hero-title-3d">
        <GoldTitle text="ELEVATE" />
      </div>

      {/* HERO CONTENT — below the 3D title */}
      <div className="hero-content-wrapper">
        <div className="glass-card">
          <div className="hero-text">
            <h2 className="embossed-text">Your Everyday Glamour</h2>
            <p>Discover our curated makeup kits and essentials.</p>
            <button className="hero-button primary-cta">Shop Now</button>
          </div>
        </div>

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
      <div className="ticker-bar" role="marquee" aria-label="Store announcements">
        <div className="ticker-track">
          <span>★ New Arrivals in Stock ★ Grab Our Limited Edition Kits ★ Free Local Delivery on Orders $50+ ★ </span>
          <span aria-hidden="true">★ New Arrivals in Stock ★ Grab Our Limited Edition Kits ★ Free Local Delivery on Orders $50+ ★ </span>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
