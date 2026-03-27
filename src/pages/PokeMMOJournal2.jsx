import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import TeamRosterCard from '../components/blog/TeamRosterCard';
import { ModelDebugProvider, useModelDebug } from '../components/blog/ModelDebugPanel';
import { TEAM_ROSTER } from '../data/teamRosterData';
import styles from './PokeMMOJournal2.module.css';

/* ── Roster grid — consumes debug context for layout settings ── */
const RosterGrid = () => {
  const { settings, active } = useModelDebug();

  const cols = active ? settings.gridColumns : 3;
  const gap = active ? settings.gridGap : 36;
  const maxW = active ? settings.rosterMaxWidth : 900;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${gap}px`,
    maxWidth: `${maxW}px`,
    margin: '0 auto 32px',
  };

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
                <span className={styles.kvValue}>The Team So Far</span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.date</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>March 2026</span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.badges</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>4 / 8</span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.region</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>KANTO</span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; ENTRY.tag</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>
                  <span className={styles.tagBadge}>Journal</span>
                  <span className={styles.tagBadge}>Team</span>
                  <span className={styles.tagBadge}>Analysis</span>
                </span>
              </div>
              <div className={styles.kvLine}>
                <span className={styles.kvKey}>&gt; STATUS</span>
                <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
                <span className={styles.kvValue}>PUBLISHED</span>
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

              <p className={styles.introTextFirst}>
                <span className={styles.descPrompt}>&gt;&nbsp;</span>
                <span className={styles.introDropCap}>
                  Four badges in, and the team has stopped feeling like a collection of individual catches. Somewhere between the Rocket Hideout and Celadon City, the roster solidified — not all at once, but in the way these things tend to happen: gradually, then suddenly obvious. Blastoise is the anchor now, not just "my starter." Beedrill isn't the spite pick from Viridian Forest anymore — it's the physical sweeper that cleans up after Onix softens the field. Every member has a role, and every role has a reason.
                </span>
              </p>

              <p className={styles.introText}>
                <span className={styles.descPrompt}>&gt;&nbsp;</span>
                That shift matters more than it sounds. Early on you're just catching whatever seems useful and hoping the levels sort themselves out. But by the mid-game, a team either has identity or it doesn't. Gloom isn't just "the Grass-type" — it's the status specialist who poisons walls and paralyzes sweepers so Beedrill can Agility past them. Mr. Mime isn't filler — it's the Substitute user that walls Poison-types and buys turns nobody else can afford. Pidgeotto is the one that refuses to go down, stalling with Roost and Sand-Attack until something breaks. The roles emerged from the matchups, not the other way around.
              </p>

              <p className={styles.introText}>
                <span className={styles.descPrompt}>&gt;&nbsp;</span>
                This entry is a pause to take stock. Six team members, four badges, and the mid-game stretching out ahead. Who's on the roster, what they bring, and where they stand — laid out in full, with the 3D models and the numbers to back it up.
              </p>

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

              <p className={styles.closingText}>
                <span className={styles.descPrompt}>&gt;&nbsp;</span>
                Six members, six roles, one team. The identity didn't come from planning — it came from playing. From noticing that Beedrill always cleaned up what Onix started, that Gloom's Toxic bought time Blastoise needed to set up Rain Dance, that Mr. Mime could wall things nothing else on the roster could touch. The synergies wrote themselves across dozens of trainer battles and gym attempts. That's the part of PokeMMO that the stat sheets don't capture — how a team starts to feel like a team.
              </p>

              <p className={styles.closingText}>
                <span className={styles.descPrompt}>&gt;&nbsp;</span>
                Up ahead: Cerulean City revisited, the road to Vermilion, and maybe the S.S. Anne if the story takes us there. The models shown above are from Pok&eacute;mon Quest (Nintendo, 2018) — the voxel aesthetic felt right for the terminal format. The actual in-game sprites are Gen III FireRed, as always.
              </p>

              <footer className={styles.postFooter}>
                <div>
                  <div className={styles.nextLabel}>Up next &mdash;</div>
                  <div className={styles.nextHint}>Cerulean City &amp; the Road to Vermilion</div>
                </div>
                <div className={styles.badgeCount}>
                  &#9632; 4 / 8 BADGES
                  <span>Kanto</span>
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
