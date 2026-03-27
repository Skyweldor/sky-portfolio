import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RelatedItems from './RelatedItems';
import ImageGallery from './ImageGallery';
import styles from './BlogDetailLayoutA.module.css';

/**
 * Iteration A: "Neon Longform"
 * Editorial blog-style vertical reading layout.
 */
const BlogDetailLayoutA = ({ item }) => {
  const {
    title,
    description,
    tags = [],
    fileSize,
    downloadUrl,
    type = 'demo',
    heroImage,
    gallery = [],
    longDescription = '',
    features = [],
    changelog = [],
    callouts = [],
    systemRequirements,
    author,
    publishDate,
    relatedItems = [],
  } = item;

  // Split long description on double-newlines for paragraph breaks
  const paragraphs = longDescription
    .split(/\n\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Format publish date for display
  const formattedDate = publishDate
    ? new Date(publishDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <section className={styles.page}>
      <Container>
        {/* --- Back link --- */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Link to="/downloads" className={styles.backLink}>
            &larr; Back to Downloads
          </Link>
        </div>

        {/* --- Header block --- */}
        <header className={styles.header}>
          <div className={styles.metaRow}>
            <span className={`${styles.typeBadge} ${styles[type] || ''}`}>
              {type.toUpperCase()}
            </span>
            {formattedDate && (
              <span className={styles.publishDate}>{formattedDate}</span>
            )}
          </div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.shortDesc}>{description}</p>
          {tags.length > 0 && (
            <div className={styles.tagRow}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className={styles.divider} />

        {/* --- Hero image --- */}
        {heroImage && (
          <>
            <div className={styles.heroWrap}>
              <img
                src={heroImage}
                alt={`${title} hero`}
                className={styles.heroImage}
                loading="lazy"
              />
            </div>
            <hr className={styles.divider} />
          </>
        )}

        {/* --- Gallery --- */}
        {gallery.length > 0 && (
          <>
            <div className={styles.galleryWrap}>
              <ImageGallery images={gallery} alt={title} />
            </div>
            <hr className={styles.divider} />
          </>
        )}

        {/* --- Long description --- */}
        {paragraphs.length > 0 && (
          <>
            <div className={styles.longDescWrap}>
              {paragraphs.map((text, idx) => (
                <p key={idx} className={idx === 0 ? styles.dropCapParagraph : styles.paragraph}>
                  {text}
                </p>
              ))}
            </div>
            <hr className={styles.divider} />
          </>
        )}

        {/* --- Callouts --- */}
        {callouts.length > 0 && (
          <div className={styles.calloutsWrap}>
            {callouts.map((callout, idx) => (
              <div key={idx} className={styles.calloutBox}>
                <span className={styles.calloutLabel}>{callout.label}</span>
                <p className={styles.calloutText}>{callout.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* --- Features --- */}
        {features.length > 0 && (
          <>
            <div className={styles.featuresSection}>
              <h2 className={styles.sectionHeading}>Features</h2>
              <ul className={styles.featureList}>
                {features.map((feat, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            <hr className={styles.divider} />
          </>
        )}

        {/* --- Changelog timeline --- */}
        {changelog.length > 0 && (
          <>
            <div className={styles.changelogSection}>
              <h2 className={styles.sectionHeading}>Changelog</h2>
              <ul className={styles.timeline}>
                {changelog.map((entry, idx) => (
                  <li key={idx} className={styles.timelineEntry}>
                    <div className={styles.versionRow}>
                      <span className={styles.versionLabel}>
                        v{entry.version}
                      </span>
                      <span className={styles.versionDate}>{entry.date}</span>
                    </div>
                    <p className={styles.versionNotes}>{entry.notes}</p>
                  </li>
                ))}
              </ul>
            </div>
            <hr className={styles.divider} />
          </>
        )}

        {/* --- Download CTA --- */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaPanel}>
            <h2 className={styles.ctaTitle}>Download {title}</h2>
            <p className={styles.ctaFileSize}>{fileSize}</p>
            <a
              href={downloadUrl || '#'}
              className={styles.ctaButton}
              download
            >
              Download
            </a>
            {systemRequirements && (
              <p className={styles.ctaSysReq}>{systemRequirements}</p>
            )}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* --- Author byline --- */}
        {author && (
          <>
            <div className={styles.authorRow}>
              <span>by</span>
              <span className={styles.authorName}>{author}</span>
              {formattedDate && <span>&middot; {formattedDate}</span>}
            </div>
            <hr className={styles.divider} />
          </>
        )}

        {/* --- Related Items --- */}
        {relatedItems.length > 0 && (
          <div className={styles.relatedWrap}>
            <RelatedItems relatedIds={relatedItems} />
          </div>
        )}
      </Container>
    </section>
  );
};

export default BlogDetailLayoutA;
