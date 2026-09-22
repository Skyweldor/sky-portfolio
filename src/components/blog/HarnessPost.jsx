import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../common/NavBar';
import TerminalPanel from './TerminalPanel';
import PostBody from './PostBody';
import styles from './HarnessPost.module.css';
import { ROUTES } from '../../config/routes';

/**
 * Shell for the build-harness write-ups. All three posts share this markup exactly —
 * header panel, typed body, footer — so they differ only by their data module.
 */
const HarnessPost = ({ post }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { header, body, footer } = post;
  const titleParts = header.title.split('\n');

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <Container>
        <div className={styles.backLinkRow}>
          <Link to={ROUTES.blog} className={styles.backLink}>
            &larr; Back to Blog
          </Link>
        </div>

        {/* ========== HEADER ========== */}
        <TerminalPanel path={header.path}>
          <div className={styles.blogName}>&#9670; {header.kicker || 'Build Harness'}</div>
          <h1 className={styles.postTitle}>
            {titleParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {part}
              </React.Fragment>
            ))}
          </h1>

          <div className={styles.kvBlock}>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; ENTRY</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>{header.entry}</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DATE</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>{header.date}</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; TAGS</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>
                {header.tags.map((tag) => (
                  <span key={tag} className={styles.tagBadge}>{tag}</span>
                ))}
              </span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; STATUS</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>{header.status}</span>
            </div>
          </div>
        </TerminalPanel>

        {/* ========== BODY ========== */}
        <TerminalPanel path={`${header.path}/transmission`} label="// transmission" wide>
          <PostBody body={body} />
        </TerminalPanel>

        {/* ========== FOOTER ========== */}
        <TerminalPanel path={`${header.path}/end`} label="// transmission_end">
          <footer className={styles.postFooter}>
            <div>
              <div className={styles.nextLabel}>Up next &mdash;</div>
              <div className={styles.nextHint}>{footer.nextLabel}</div>
            </div>
            <div className={styles.metaCount}>
              &#9632; {footer.meta}
              <span>{footer.region}</span>
            </div>
          </footer>
        </TerminalPanel>
      </Container>
    </div>
  );
};

export default HarnessPost;
