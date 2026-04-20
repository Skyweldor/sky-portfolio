// FeaturedSplit.jsx
import React from 'react';
import './css/FeaturedSplit.css';
import pinkBeauty from './images/products/pink_beauty.jpeg';

const FeaturedSplit = () => {
  return (
    <section className="featured-split">
      <div className="image-col">
        <div className="circle-bg"></div>
        <img
          src={pinkBeauty}
          alt="Featured skincare product — berry white eye serum"
          className="focal-product-img"
        />
      </div>
      <div className="text-col">
        <h2>Explore from 20% Off</h2>
        <p>
          Find your signature kit today and enjoy special pricing. Perfect for gifts or a personal treat!
        </p>
        <a href="/makeup/discounts" className="split-btn">Explore Now</a>
      </div>
    </section>
  );
};

export default FeaturedSplit;
