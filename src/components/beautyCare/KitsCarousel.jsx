// KitsCarousel.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './css/KitsCarousel.css'; // local styling

const KitsCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 1, slidesToScroll: 1 }
            },
        ],
    };

    const kitsData = [
        {
            title: 'Luxury Skincare & Makeup Kit',
            imgSrc: 'path-to-luxury-kit.jpg',
            description: 'A curated selection of our top-quality skincare and makeup.',
            link: '/makeup/luxury-kit'
        },
        {
            title: 'Everyday Makeup Kit',
            imgSrc: 'path-to-everyday-kit.jpg',
            description: 'Quick and easy solutions for daily glam.',
            link: '/makeup/everyday-kit'
        },
        // ... add more kits as needed
    ];

    return (
        <section className="kits-carousel-section">
            <h2 className="carousel-title">
                Top-Selling Kits <span className="subtext">Discover Our Must-Haves</span>
            </h2>
            <Slider {...settings}>
                {kitsData.map((kit, idx) => (
                    <div className="kit-slide" key={idx}>
                        <div className="kit-image-wrapper">
                            <img src={kit.imgSrc} alt={kit.title} className="kit-image" />
                        </div>
                        <div className="kit-card">
                            <h3>{kit.title}</h3>
                            <p>{kit.description}</p>
                            <a href={kit.link} className="carousel-button">Learn More</a>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default KitsCarousel;
