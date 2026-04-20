import React from 'react';
import './css/HeroBanner.css';

const DividingBar = () => {
    return (
        <section className="dividing-bar">
            <div className="offerings-bar" role="navigation" aria-label="Product categories">
                <button className="offering-link" onClick={() => {}}><span>Luxury Skincare &amp; Makeup Kit</span></button>
                <span>✶</span>
                <button className="offering-link" onClick={() => {}}><span>Everyday Makeup Kit</span></button>
                <span>✶</span>
                <button className="offering-link" onClick={() => {}}><span>Lipstick Variety Kit</span></button>
                <span>✶</span>
                <button className="offering-link" onClick={() => {}}><span>Eye Essentials Kit</span></button>
                <span>✶</span>
                <button className="offering-link" onClick={() => {}}><span className="shimmer-text">Skincare Duo</span></button>
            </div>
        </section>
    )
};

export default DividingBar;
