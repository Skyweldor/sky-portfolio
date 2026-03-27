import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import PokedexGrid from '../components/blog/PokedexGrid';
import RegionNav from '../components/blog/RegionNav';
import { KANTO_DEX, KANTO_TYPES } from '../data/kantoDexData';
import { KANTO_NATURES } from '../data/kantoNatureData';
import styles from './KantoPokedex.module.css';

const KantoPokedex = () => {
  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <Container>
        {/* Back link + Region nav */}
        <div className={styles.backLinkRow}>
          <Link to="/blog" className={styles.backLink}>
            &larr; Back to Blog
          </Link>
        </div>
        <RegionNav currentRegion="Kanto" />

        {/* ========== TERMINAL HEADER PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://pokedex/kanto
            </span>
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.region</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>KANTO</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.generation</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>I</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.total_entries</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>151</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.range</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>#001 — #151</span>
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
              SYNTHCITY://pokedex/kanto/entries
            </span>
          </div>

          <div className={styles.terminalBody}>
            <h2 className={styles.sectionHeader}>// DEX_ENTRIES</h2>
            <PokedexGrid pokemon={KANTO_DEX} types={KANTO_TYPES} natureData={KANTO_NATURES} />
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

export default KantoPokedex;
