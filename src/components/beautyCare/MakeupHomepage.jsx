// src/components/makeup/MakeupHomePage.jsx
import React from 'react';
import HeroBanner from './HeroBanner';
import DividingBar from './DividingBar';
import KitsCarousel from './KitsCarousel';
import FeaturedSplit from './FeaturedSplit';
import HeroSection from './HeroSection';

const MakeupHomePage = () => {
  return (
    <div>
      {/*<HeroBanner />*/}
      <HeroSection />
      {/* Additional sections or components can go here */}
      <DividingBar />
      <KitsCarousel />
      <FeaturedSplit />
      <section style={{ padding: '2rem' }}>
        <h2>Welcome to Our Makeup Collections</h2>
        <p>
          Explore our curated kits, luxurious packaging, and personalized
          purchasing options. Pay via Zelle or meet us in person!
        </p>
      </section>
    </div>
  );
};

export default MakeupHomePage;
