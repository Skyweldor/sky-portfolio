import React, { useState } from 'react';
import styles from './ImageGallery.module.css';

const ImageGallery = ({ images = [], alt = '' }) => {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (images.length === 0) return null;

  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const goPrev = (e) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goNext = (e) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className={styles.scrollRow}>
        {images.map((src, idx) => (
          <button
            key={idx}
            className={styles.thumbBtn}
            onClick={() => openLightbox(idx)}
            aria-label={`View screenshot ${idx + 1}`}
          >
            <img
              src={src}
              alt={`${alt} screenshot ${idx + 1}`}
              className={styles.thumb}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            &times;
          </button>
          {images.length > 1 && (
            <>
              <button className={styles.lightboxPrev} onClick={goPrev} aria-label="Previous image">
                &#8249;
              </button>
              <button className={styles.lightboxNext} onClick={goNext} aria-label="Next image">
                &#8250;
              </button>
            </>
          )}
          <img
            src={images[lightboxIdx]}
            alt={`${alt} full screenshot ${lightboxIdx + 1}`}
            className={styles.lightboxImg}
          />
        </div>
      )}
    </>
  );
};

export default ImageGallery;
