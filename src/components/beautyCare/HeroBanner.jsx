// src/components/makeup/HeroBanner.jsx
import React from 'react';
import './css/HeroBanner.css';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
    return (
        <section className="hero-banner">
            <div className="hero-content">
                <h1 className="hero-title embossed-text shimmer-text">ELEVATE your everyday GLAMOUR</h1>
                <p className="hero-subtitle shimmer-text">
                    Discover our curated makeup kits and essentials.
                </p>
                <button className="hero-button">Shop Now</button>
            </div>
            
        </section>
    );
};

export default HeroBanner;
