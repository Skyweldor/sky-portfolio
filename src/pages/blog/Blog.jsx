import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components/common/NavBar';
import { blogPosts, pokedexRegions } from '../../data/blogPostData';
import styles from './Blog.module.css';

/** Map category / status strings to badge class names. */
const categoryBadgeClass = (cat) => {
  switch (cat) {
    case 'Journal': return styles.badgeJournal;
    case 'Guide':   return styles.badgeGuide;
    default:        return styles.badgeJournal;
  }
};

const statusBadgeClass = (status) => {
  switch (status) {
    case 'COMPLETE':  return styles.badgeComplete;
    case 'PUBLISHED': return styles.badgePublished;
    case 'QUEUED':    return styles.badgeQueued;
    default:          return styles.badgeQueued;
  }
};

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <Container>

        {/* ========== BLOG POSTS PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://blog
            </span>
          </div>

          <div className={styles.terminalBody}>
            <h2 className={styles.sectionHeader}>// journal_entries</h2>

            <div className={styles.commandPrompt}>
              &gt; ls -la<span> ./posts</span>
            </div>

            {/* Column headers */}
            <div className={`${styles.tableHeader} ${styles.tableHeaderPosts}`}>
              <div>Type</div>
              <div>Title</div>
              <div style={{ textAlign: 'right' }}>Date</div>
            </div>

            {/* Rows */}
            {blogPosts.length === 0 ? (
              <div className={styles.emptyState}>&gt; no entries found.</div>
            ) : (
              blogPosts.map((post) => (
                <React.Fragment key={post.id}>
                  <Link
                    to={post.route}
                    className={`${styles.tableRow} ${styles.tableRowPosts}`}
                  >
                    <div>
                      <span className={`${styles.badge} ${categoryBadgeClass(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                    <div className={styles.cellTitle}>{post.title}</div>
                    <div className={styles.cellDate}>{post.date}</div>
                  </Link>
                  <div className={styles.excerptRow}>{post.excerpt}</div>
                </React.Fragment>
              ))
            )}

            <div className={styles.cursorLine}>
              <span className={styles.blinkingCursor}>█</span>
            </div>
          </div>
        </div>

        {/* ========== POKEDEX COMPANION PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://blog/pokedex
            </span>
          </div>

          <div className={styles.terminalBody}>
            <h2 className={styles.sectionHeader}>// pokedex_companion</h2>

            <div className={styles.commandPrompt}>
              &gt; ls<span> pokedex/</span>
            </div>

            {/* Column headers */}
            <div className={`${styles.tableHeader} ${styles.tableHeaderPokedex}`}>
              <div>Region</div>
              <div style={{ textAlign: 'center' }}>Gen</div>
              <div style={{ textAlign: 'center' }}>Entries</div>
              <div style={{ textAlign: 'right' }}>Status</div>
            </div>

            {/* Rows */}
            {pokedexRegions.map((region) => (
              <Link
                key={region.region}
                to={region.route}
                className={`${styles.tableRow} ${styles.tableRowPokedex}`}
              >
                <div className={styles.cellRegion}>{region.region}</div>
                <div className={styles.cellGen}>{region.generation}</div>
                <div className={styles.cellEntries}>{region.entries}</div>
                <div className={styles.cellStatus}>
                  <span className={`${styles.badge} ${statusBadgeClass(region.status)}`}>
                    {region.status}
                  </span>
                </div>
              </Link>
            ))}

            <div className={styles.cursorLine}>
              <span className={styles.blinkingCursor}>█</span>
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default Blog;
