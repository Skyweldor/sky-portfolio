// KitsCarousel.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './css/KitsCarousel.css'; // local styling
import luxuryKitImg from './images/products/makeup_brushes_palette.jpeg';
import everydayKitImg from './images/products/cosmetics_flatlay.jpeg';
import eyeKitImg from './images/products/eyeshadow_palette.jpeg';

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
            imgSrc: luxuryKitImg,
            altText: 'Luxury Skincare and Makeup Kit — curated selection of premium products',
            description: 'A curated selection of our top-quality skincare and makeup.',
            link: '/makeup/luxury-kit'
        },
        {
            title: 'Everyday Makeup Kit',
            imgSrc: everydayKitImg,
            altText: 'Everyday Makeup Kit — quick and easy daily glam essentials',
            description: 'Quick and easy solutions for daily glam.',
            link: '/makeup/everyday-kit'
        },
        {
            title: 'Eye Essentials Kit',
            imgSrc: eyeKitImg,
            altText: 'Eye Essentials Kit — everything for stunning eye looks',
            description: 'Everything you need for stunning eye looks.',
            link: '/makeup/eye-essentials-kit'
        },
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
                            <img src={kit.imgSrc} alt={kit.altText} className="kit-image" />
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
