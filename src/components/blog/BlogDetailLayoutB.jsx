import React from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from './ImageGallery';
import RelatedItems from './RelatedItems';
import styles from './BlogDetailLayoutB.module.css';

const BlogDetailLayoutB = ({ item }) => {
  if (!item) return null;

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
    systemRequirements,
    author,
    publishDate,
    relatedItems = [],
    callouts = [],
  } = item;

  /* Split long description on double-newlines into paragraphs */
  const paragraphs = longDescription
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  /* Format publish date for display */
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className={styles.page}>
      {/* ---- 1. Full-width Hero ---- */}
      <div className={styles.heroWrap}>
        <Link to="/downloads" className={styles.backLink}>
          &larr; Back to Downloads
        </Link>
        {heroImage && (
          <img
            src={heroImage}
            alt={`${title} hero`}
            className={styles.heroImage}
          />
        )}
      </div>

      {/* ---- 2. Floating Info Panel ---- */}
      <div className={styles.floatingPanel}>
        <span className={`${styles.typeBadge} ${styles[type] || ''}`}>
          {type.toUpperCase()}
        </span>

        <h1 className={styles.panelTitle}>{title}</h1>
        <p className={styles.panelDesc}>{description}</p>

        {tags.length > 0 && (
          <div className={styles.panelTags}>
            {tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div className={styles.panelFooter}>
          {fileSize && (
            <span className={styles.fileSize}>Size: {fileSize}</span>
          )}
          {downloadUrl && (
            <a
              href={downloadUrl}
              className={styles.downloadBtn}
              download
              rel="noopener noreferrer"
            >
              Download
            </a>
          )}
        </div>
      </div>

      {/* ---- 3. Two-column: About + Details Sidebar ---- */}
      <div className={styles.contentGrid}>
        <div className={styles.aboutSection}>
          <h2 className={styles.sectionHeading}>About</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? styles.dropCapParagraph : styles.bodyParagraph}>{p}</p>
          ))}

          {callouts.length > 0 && callouts.map((callout, i) => (
            <div key={i} className={styles.calloutBox}>
              <span className={styles.calloutLabel}>{callout.label}</span>
              <p className={styles.calloutText}>{callout.text}</p>
            </div>
          ))}
        </div>

        <aside className={styles.detailsSidebar}>
          <h2 className={styles.sectionHeading}>Details</h2>

          {author && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Author</span>
              <span className={styles.detailValue}>{author}</span>
            </div>
          )}

          {fileSize && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Size</span>
              <span className={styles.detailValue}>{fileSize}</span>
            </div>
          )}

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Type</span>
            <span className={styles.detailValue}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>

          {formattedDate && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Published</span>
              <span className={styles.detailValue}>{formattedDate}</span>
            </div>
          )}

          {systemRequirements && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>System Requirements</span>
              <span className={styles.detailValue}>{systemRequirements}</span>
            </div>
          )}
        </aside>
      </div>

      {/* ---- 4. Screenshot Gallery ---- */}
      {gallery.length > 0 && (
        <div className={styles.gallerySection}>
          <h2 className={styles.sectionHeading}>Screenshots</h2>
          <ImageGallery images={gallery} alt={title} />
        </div>
      )}

      {/* ---- 5. Features + Changelog ---- */}
      {(features.length > 0 || changelog.length > 0) && (
        <div className={styles.dualGrid}>
          {features.length > 0 && (
            <div>
              <h2 className={styles.sectionHeading}>Features</h2>
              <ul className={styles.featureList}>
                {features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {changelog.length > 0 && (
            <div>
              <h2 className={styles.sectionHeading}>Changelog</h2>
              {changelog.map((entry, i) => (
                <div key={i} className={styles.changelogEntry}>
                  <span className={styles.changelogVersion}>
                    v{entry.version}
                  </span>
                  {entry.date && (
                    <span className={styles.changelogDate}>{entry.date}</span>
                  )}
                  {entry.notes && (
                    <p className={styles.changelogNotes}>{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- 6. Related Items ---- */}
      {relatedItems.length > 0 && (
        <div className={styles.relatedSection}>
          <RelatedItems relatedIds={relatedItems} />
        </div>
      )}
    </div>
  );
};

export default BlogDetailLayoutB;
