import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components/common/NavBar';
import TeamRosterCard from '../../components/blog/TeamRosterCard';
import { ModelDebugProvider, useModelDebug } from '../../components/blog/ModelDebugPanel';
import { TEAM_ROSTER } from '../../data/teamRosterData';
import journal from '../../data/blog/pokemmo-journal-2';
import styles from './PokeMMOJournal2.module.css';

/* ── Roster grid — consumes debug context for layout settings ── */
const RosterGrid = () => {
  const { settings, active } = useModelDebug();

  const cols = active ? settings.gridColumns : 3;
  const gap = active ? settings.gridGap : 36;
  const maxW = active ? settings.rosterMaxWidth : 900;

  return (
    <div className={styles.rosterSection} style={{ maxWidth: `${maxW}px`, margin: '0 auto 32px' }}>
      <h2 className={styles.sectionHeader}>// TEAM_ROSTER</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${gap}px` }}>
        {TEAM_ROSTER.map((pokemon) => (
          <TeamRosterCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

const PokeMMOJournal2 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { header, intro, closing, footer } = journal;

  return (
    <ModelDebugProvider>
      <div className={styles.pageWrapper}>
        <NavBar />
        <Container>
          {/* Back link */}
          <div className={styles.backLinkRow}>
            <Link to="/blog" className={styles.backLink}>
              &larr; Back to Blog
            </Link>
          </div>

          {/* ========== HEADER TERMINAL PANEL ========== */}
          <div className={styles.terminalPanel}>
            <div className={styles.titleBar}>
              <div className={styles.titleBarDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.titleBarPath}>
                SYNTHCITY://pokemmo/journal/002
              </span>
            </div>

            <div className={styles.terminalBody}>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.title</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>{header.title}</span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.date</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>{header.date}</span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.badges</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>{header.badges}</span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.region</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>{header.region}</span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.tag</span>
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

              <div className={styles.cursorLine}>
                <span className={styles.blinkingCursor}>█</span>
              </div>
            </div>
          </div>

          {/* ========== INTRO PROSE PANEL ========== */}
          <div className={styles.terminalPanel}>
            <div className={styles.titleBar}>
              <div className={styles.titleBarDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.titleBarPath}>
                SYNTHCITY://pokemmo/journal/002/transmission
              </span>
            </div>

            <div className={styles.terminalBody}>
              <h2 className={styles.sectionHeader}>// TRANSMISSION</h2>

              {intro.map((text, i) => (
                <p key={i} className={i === 0 ? styles.introTextFirst : styles.introText}>
                  <span className={styles.descPrompt}>&gt;&nbsp;</span>
                  {i === 0
                    ? <span className={styles.introDropCap}>{text}</span>
                    : text
                  }
                </p>
              ))}

              <div className={styles.cursorLine}>
                <span className={styles.blinkingCursor}>█</span>
              </div>
            </div>
          </div>

          {/* ========== TEAM ROSTER ========== */}
          <RosterGrid />

          {/* ========== CLOSING PANEL ========== */}
          <div className={styles.terminalPanel}>
            <div className={styles.titleBar}>
              <div className={styles.titleBarDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.titleBarPath}>
                SYNTHCITY://pokemmo/journal/002/end
              </span>
            </div>

            <div className={styles.terminalBody}>
              <h2 className={styles.sectionHeader}>// TRANSMISSION_END</h2>

              {closing.map((text, i) => (
                <p key={i} className={styles.closingText}>
                  <span className={styles.descPrompt}>&gt;&nbsp;</span>
                  {text}
                </p>
              ))}

              <footer className={styles.postFooter}>
                <div>
                  <div className={styles.nextLabel}>Up next &mdash;</div>
                  <div className={styles.nextHint}>{footer.nextLabel}</div>
                </div>
                <div className={styles.badgeCount}>
                  &#9632; {footer.badges} BADGES
                  <span>{footer.region}</span>
                </div>
              </footer>

              <div className={styles.cursorLine}>
                <span className={styles.blinkingCursor}>█</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </ModelDebugProvider>
  );
};

export default PokeMMOJournal2;
