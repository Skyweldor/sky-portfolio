import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RelatedItems from './RelatedItems';
import HeroPlaceholder from '../common/HeroPlaceholder';
import styles from './BlogDetailLayoutC.module.css';

const TYPE_COLORS = {
  demo: '#00eaff',
  asset: '#9f00ff',
  tool: '#ff29ff',
  docs: '#00b3ff',
};

const TYPE_LABELS = {
  demo: 'Demo',
  asset: 'Asset Pack',
  tool: 'Toolkit',
  docs: 'Documentation',
};

const BlogDetailLayoutC = ({ item }) => {
  if (!item) return null;

  const accentColor = TYPE_COLORS[item.type] || '#00eaff';
  const paragraphs = (item.longDescription || '').split('\n\n').filter(Boolean);
  const showPlaceholderHero = !item.heroImage || item.heroImage.startsWith('/assets/blog/');
  const isDownloadDisabled = item.downloadAvailable === false;

  return (
    <div className={styles.pageWrapper}>
      <Container>
        {/* Back link */}
        <div className={styles.backLinkRow}>
          <Link to="/downloads" className={styles.backLink}>
            &larr; Back to Downloads
          </Link>
        </div>

        {/* ========== TERMINAL HEADER PANEL ========== */}
        <div className={styles.terminalPanel}>
          

          <div className={styles.terminalBody}>
            <div className={styles.kvLine}>
              <span className={styles.kvSep}>::&nbsp;</span>
              <span className={styles.kvValue} style={{ color: accentColor }}>
                {item.type.toUpperCase()}
              </span>
              <span className={styles.kvSep}>::&nbsp;</span>
              <span className={styles.kvValue}>{item.fileSize}</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvSep}>::&nbsp;</span>
              <span className={styles.kvValue}>{item.title}</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvSep}>::&nbsp;</span>
              <span className={styles.kvValue}>{item.author}</span>
              <span className={styles.kvSep}>::&nbsp;</span>
              <span className={styles.kvValue}>{item.publishDate}</span>
              <span className={styles.kvSep}>::&nbsp;</span>
              <span className={styles.kvValue}>
                {item.tags.map((tag) => `[${tag}]`).join(' ')}
              </span>
            </div>
            

            
          </div>
        </div>

        {/* ========== DIVIDER ========== */}
        <div className={styles.panelDivider} />

        {/* ========== CONTENT PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.terminalBody}>
            {/* // PREVIEW */}
            <div className={styles.contentSection}>
              <h2 className={styles.sectionHeader}>// PREVIEW</h2>
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
            </div>

            {/* // DESCRIPTION */}
            {paragraphs.length > 0 && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionHeader}>// DESCRIPTION</h2>
                {paragraphs.map((para, idx) => (
                  <p key={idx} className={idx === 0 ? styles.descParagraphFirst : styles.descParagraph}>
                    <span className={idx === 0 ? styles.descTextFirst : undefined}>{para}</span>
                  </p>
                ))}
              </div>
            )}

            {/* // CALLOUTS */}
            {item.callouts && item.callouts.length > 0 && (
              <div className={styles.contentSection}>
                {item.callouts.map((callout, idx) => (
                  <div key={idx} className={styles.calloutBox}>
                    <div className={styles.calloutLabel}>
                      &#9632; {callout.label}
                    </div>
                    <p className={styles.calloutText}>{callout.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* // FEATURES */}
            {item.features && item.features.length > 0 && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionHeader}>// FEATURES</h2>
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
              </div>
            )}

            {/* // CHANGELOG */}
            {item.changelog && item.changelog.length > 0 && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionHeader}>// CHANGELOG</h2>
                <div className={styles.changelogStack}>
                  {item.changelog.map((entry, idx) => (
                    <div key={idx} className={styles.changelogEntry}>
                      <div className={styles.changelogHeader}>
                        <span className={styles.changelogVersion}>
                          v{entry.version}
                        </span>
                        <span className={styles.changelogDate}>
                          {entry.date}
                        </span>
                      </div>
                      <p className={styles.changelogNotes}>
                        {entry.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* // SYSTEM REQUIREMENTS */}
            {item.systemRequirements && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionHeader}>
                  // SYSTEM_REQUIREMENTS
                </h2>
                <p className={styles.sysReqText}>
                  {item.systemRequirements}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========== RELATED ITEMS ========== */}
        {item.relatedItems && item.relatedItems.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.sectionHeader}>// RELATED_ITEMS</h2>
            <RelatedItems relatedIds={item.relatedItems} />
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogDetailLayoutC;
