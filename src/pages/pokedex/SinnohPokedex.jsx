import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components/common/NavBar';
import PokedexGrid from '../../components/blog/PokedexGrid';
import RegionNav from '../../components/blog/RegionNav';
import { SINNOH_DEX, SINNOH_TYPES } from '../../data/sinnohDexData';
import { SINNOH_NATURES } from '../../data/sinnohNatureData';
import styles from './SinnohPokedex.module.css';

const SinnohPokedex = () => {
  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <Container>
        {/* Back link */}
        <div className={styles.backLinkRow}>
          <Link to="/blog" className={styles.backLink}>
            &larr; Back to Blog
          </Link>
        </div>

        <RegionNav currentRegion="Sinnoh" />

        {/* ========== TERMINAL HEADER PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://pokedex/sinnoh
            </span>
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.region</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>SINNOH</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.generation</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>IV</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.total_entries</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>107</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.range</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>#387 — #493</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.source</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>PokéSprite / Gen VIII Assets</span>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBar}>
              <span className={styles.progressLabel}>&gt; LOAD_STATUS&nbsp;&nbsp;</span>
              <span className={styles.progressFill}>{'████████████████████████'}</span>
              <span className={styles.progressStatus}>&nbsp;COMPLETE</span>
            </div>

            {/* Blinking cursor */}
            <div className={styles.cursorLine}>
              <span className={styles.blinkingCursor}>█</span>
            </div>
          </div>
        </div>

        {/* ========== DEX GRID PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://pokedex/sinnoh/entries
            </span>
          </div>

          <div className={styles.terminalBody}>
            <h2 className={styles.sectionHeader}>// DEX_ENTRIES</h2>
            <PokedexGrid pokemon={SINNOH_DEX} types={SINNOH_TYPES} natureData={SINNOH_NATURES} />
          </div>
        </div>

        {/* ========== FOOTER PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://pokedex/sys_log
            </span>
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.footerText}>
              <span className={styles.footerHighlight}>&gt;</span> Next region: <span className={styles.footerHighlight}>Unova</span> — 156 entries queued<br />
              <span className={styles.footerHighlight}>&gt;</span> Sprite data sourced from <span className={styles.footerHighlight}>msikma/pokesprite</span><br />
              <span className={styles.footerHighlight}>&gt;</span> Gen VIII rendering format — base forms only
            </div>
            <div className={styles.cursorLine}>
              <span className={styles.blinkingCursor}>█</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SinnohPokedex;
