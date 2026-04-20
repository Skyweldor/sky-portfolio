import React from 'react';
import { Link } from 'react-router-dom';
import RelatedItems from './RelatedItems';
import HeroPlaceholder from '../common/HeroPlaceholder';
import styles from './BlogDetailLayoutD.module.css';

const TYPE_LABELS = {
  demo: 'Demo',
  asset: 'Asset Pack',
  tool: 'Toolkit',
  docs: 'Documentation',
};

const BlogDetailLayoutD = ({ item }) => {
  if (!item) return null;

  const paragraphs = (item.longDescription || '').split('\n\n').filter(Boolean);
  const showPlaceholderHero = !item.heroImage || item.heroImage.startsWith('/assets/blog/');
  const isDownloadDisabled = item.downloadAvailable === false;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        {/* Back link */}
        <div className={styles.backLinkRow}>
          <Link to="/downloads" className={styles.backLink}>
            &larr; Back to Downloads
          </Link>
        </div>

        {/* ==================== HEADER ==================== */}
        <header className={styles.blogHeader}>
          <div className={styles.blogName}>
            &#9670; {TYPE_LABELS[item.type] || item.type}
          </div>
          <h1 className={styles.postTitle}>{item.title}</h1>
          <div className={styles.postMeta}>
            <span className={styles.metaDate}>
              {item.author} &mdash; {item.publishDate}
            </span>
            {item.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </header>

        {/* ==================== HERO ==================== */}
        {showPlaceholderHero ? (
          <div className={styles.heroWrapper}>
            <HeroPlaceholder type={item.type} title={item.title} />
            <div className={styles.scanlineOverlay} />
          </div>
        ) : (
          <div className={styles.heroWrapper}>
            <img
              src={item.heroImage}
              alt={`${item.title} hero`}
              className={styles.heroImage}
            />
            <div className={styles.scanlineOverlay} />
          </div>
        )}

        {/* ==================== BODY ==================== */}
        <div className={styles.postBody}>
          {paragraphs.map((para, idx) => (
            <p key={idx} className={idx === 0 ? styles.dropCap : undefined}>
              {para}
            </p>
          ))}
        </div>

        {/* ==================== CALLOUTS ==================== */}
        {item.callouts && item.callouts.length > 0 && item.callouts.map((callout, idx) => (
          <div key={idx} className={styles.callout}>
            <div className={styles.calloutLabel}>&#9632; {callout.label}</div>
            <p>{callout.text}</p>
          </div>
        ))}

        {/* ==================== FEATURES ==================== */}
        {item.features && item.features.length > 0 && (
          <>
            <div className={styles.sectionLabel}>Features</div>
            <ul className={styles.featureList}>
              {item.features.map((feat, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <span className={styles.featureNum}>
                    [{String(idx + 1).padStart(2, '0')}]
                  </span>
                  <span className={styles.featureText}>{feat}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ==================== CHANGELOG ==================== */}
        {item.changelog && item.changelog.length > 0 && (
          <>
            <div className={styles.sectionLabel}>Changelog</div>
            <div className={styles.changelogBlock}>
              {item.changelog.map((entry, idx) => (
                <div key={idx}>
                  <div className={styles.changelogLine}>
                    <span className={styles.changelogVersion}>v{entry.version}</span>
                    {' — '}
                    <span className={styles.changelogDate}>{entry.date}</span>
                  </div>
                  <div className={styles.changelogNotes}>
                    &gt; {entry.notes}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ==================== SYSTEM REQUIREMENTS ==================== */}
        {item.systemRequirements && (
          <>
            <div className={styles.sectionLabel}>System Requirements</div>
            <div className={styles.sysReqText}>{item.systemRequirements}</div>
          </>
        )}

        {/* ==================== DOWNLOAD / FOOTER ==================== */}
        <div className={styles.downloadArea}>
          <div className={styles.downloadMeta}>
            {item.fileSize} &bull; {item.type.toUpperCase()}
          </div>
          {isDownloadDisabled ? (
            <span className={`${styles.downloadButton} ${styles.downloadDisabled}`}>
              &#9632; COMING SOON
            </span>
          ) : (
            <a
              href={item.downloadUrl || '#'}
              className={styles.downloadButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              &#9632; DOWNLOAD
            </a>
          )}
        </div>

        {/* ==================== RELATED ITEMS ==================== */}
        {item.relatedItems && item.relatedItems.length > 0 && (
          <div className={styles.relatedSection}>
            <div className={styles.sectionLabel}>Related</div>
            <RelatedItems relatedIds={item.relatedItems} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailLayoutD;
