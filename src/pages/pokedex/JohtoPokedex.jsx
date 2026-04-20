import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components/common/NavBar';
import PokedexGrid from '../../components/blog/PokedexGrid';
import RegionNav from '../../components/blog/RegionNav';
import { JOHTO_DEX, JOHTO_TYPES } from '../../data/johtoDexData';
import { JOHTO_NATURES } from '../../data/johtoNatureData';
import styles from './JohtoPokedex.module.css';

const JohtoPokedex = () => {
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

        <RegionNav currentRegion="Johto" />

        {/* ========== TERMINAL HEADER PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://pokedex/johto
            </span>
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.region</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>JOHTO</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.generation</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>II</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.total_entries</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>100</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.range</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>#152 — #251</span>
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
              SYNTHCITY://pokedex/johto/entries
            </span>
          </div>

          <div className={styles.terminalBody}>
            <h2 className={styles.sectionHeader}>// DEX_ENTRIES</h2>
            <PokedexGrid pokemon={JOHTO_DEX} types={JOHTO_TYPES} natureData={JOHTO_NATURES} />
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
              <span className={styles.footerHighlight}>&gt;</span> Next region: <span className={styles.footerHighlight}>Hoenn</span> — 135 entries queued<br />
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

export default JohtoPokedex;
