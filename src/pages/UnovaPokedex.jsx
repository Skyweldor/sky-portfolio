import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import PokedexGrid from '../components/blog/PokedexGrid';
import RegionNav from '../components/blog/RegionNav';
import { UNOVA_DEX, UNOVA_TYPES } from '../data/unovaDexData';
import styles from './UnovaPokedex.module.css';

const UnovaPokedex = () => {
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

        <RegionNav currentRegion="Unova" />

        {/* ========== TERMINAL HEADER PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://pokedex/unova
            </span>
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.region</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>UNOVA</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.generation</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>V</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.total_entries</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>156</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.range</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>#494 — #649</span>
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
              SYNTHCITY://pokedex/unova/entries
            </span>
          </div>

          <div className={styles.terminalBody}>
            <h2 className={styles.sectionHeader}>// DEX_ENTRIES</h2>
            <PokedexGrid pokemon={UNOVA_DEX} types={UNOVA_TYPES} />
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
              <span className={styles.footerHighlight}>&gt;</span> All PokeMMO regions loaded — <span className={styles.footerHighlight}>649</span> entries indexed<br />
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

export default UnovaPokedex;
