import React, { useState, useCallback } from 'react';
import PokemonModelViewer from './PokemonModelViewer';
import { useModelDebug } from './ModelDebugPanel';
import { MOVE_TYPE_COLORS, TYPE_COLORS } from '../../data/teamRosterData';
import styles from './TeamRosterCard.module.css';

/* ── Helpers ── */

const STAT_LABELS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const STAT_DISPLAY = { hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE' };
const BAR_LENGTH = 16;
const STAT_MAX = 130;

function statBar(value, max = STAT_MAX, length = BAR_LENGTH) {
  const filled = Math.round((value / max) * length);
  const empty = length - filled;
  return { filled: '█'.repeat(filled), empty: '░'.repeat(empty) };
}

function formatIVs(ivs, ivTotal) {
  const vals = STAT_LABELS.map((s) => ivs[s]);
  return `${vals.join('/')} (${ivTotal})`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '158, 158, 158';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/* ============================================================
   TeamRosterCard — Compact card with hover-reveal detail panel
   Click to lock the overlay open.
   ============================================================ */
const TeamRosterCard = ({ pokemon }) => {
  const { settings, active } = useModelDebug();
  const [locked, setLocked] = useState(false);

  const handleClick = useCallback(() => {
    setLocked((prev) => !prev);
  }, []);

  if (!pokemon) return null;

  const primaryType = pokemon.types[0];
  const typeColor = TYPE_COLORS[primaryType] || '#9e9e9e';
  const hasStats = STAT_LABELS.some((s) => pokemon.stats[s] != null);

  const showTitle = active ? settings.showTitleBar : false;
  const showStrip = active ? settings.showInfoStrip : true;
  const overlayAlpha = active ? settings.overlayOpacity / 100 : 0.99;
  const radius = active ? settings.cardBorderRadius : 8;

  return (
    <div
      className={`${styles.card} ${locked ? styles.cardLocked : ''}`}
      style={{ borderRadius: `${radius}px` }}
      onClick={handleClick}
    >
      {/* ── Title bar ── */}
      {showTitle && (
        <div className={styles.titleBar}>
          <div className={styles.titleBarDots}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <span className={styles.titleBarPath}>
            SYNTHCITY://pokemmo/team/{pokemon.dexNum}_{pokemon.id}
          </span>
        </div>
      )}

      {/* ── Model area (relative container for overlays) ── */}
      <div className={styles.modelArea}>
        <PokemonModelViewer
          modelPath={pokemon.modelPath}
          modelFile={pokemon.modelFile}
          mtlFile={pokemon.mtlFile}
          primaryType={primaryType}
        />

        {/* Always-visible: name + level + types strip */}
        {showStrip && (
          <div className={styles.infoStrip}>
            <div className={styles.nameBlock}>
              <span className={styles.monName}>
                {pokemon.nickname || pokemon.name.toUpperCase()}
              </span>
              <span className={styles.monLevel}>Lv.{pokemon.level}</span>
            </div>
            <div className={styles.typeBadges}>
              {pokemon.types.map((t) => (
                <span
                  key={t}
                  className={styles.typeBadge}
                  style={{
                    color: TYPE_COLORS[t] || '#9e9e9e',
                    borderColor: `rgba(${hexToRgb(TYPE_COLORS[t] || '#9e9e9e')}, 0.5)`,
                    background: `rgba(${hexToRgb(TYPE_COLORS[t] || '#9e9e9e')}, 0.12)`,
                  }}
                >
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hover-reveal / click-lock: detail overlay */}
        <div
          className={styles.detailOverlay}
          style={{ backgroundColor: `rgba(0, 5, 15, ${overlayAlpha})` }}
        >
          <div className={styles.detailInner}>
            {/* Identification — compact */}
            <div className={styles.idGrid}>
              <span className={styles.idKey}>Nature</span>
              <span className={styles.idVal}>
                {pokemon.nature}
                {pokemon.natureEffect && <span className={styles.dim}> ({pokemon.natureEffect})</span>}
              </span>
              <span className={styles.idKey}>Ability</span>
              <span className={styles.idVal}>{pokemon.ability}</span>
              <span className={styles.idKey}>IVs</span>
              <span className={styles.idVal}>{formatIVs(pokemon.ivs, pokemon.ivTotal)}</span>
            </div>

            {/* Moves + Stats side by side */}
            <div className={styles.moveStatRow}>
              {/* Moveset — compact 2×2 */}
              <div className={styles.moveSide}>
                <div className={styles.moveGrid}>
                  {pokemon.moves.map((move, idx) => {
                    const mc = MOVE_TYPE_COLORS[move.type] || '#9e9e9e';
                    return (
                      <div
                        key={idx}
                        className={styles.moveBadge}
                        style={{
                          background: `rgba(${hexToRgb(mc)}, 0.18)`,
                          borderColor: `rgba(${hexToRgb(mc)}, 0.35)`,
                          color: mc,
                        }}
                      >
                        {move.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              {hasStats && (
                <div className={styles.statSide}>
                  {STAT_LABELS.map((key) => {
                    const value = pokemon.stats[key];
                    if (value == null) return null;
                    const bar = statBar(value);
                    return (
                      <div key={key} className={styles.statLine}>
                        <span className={styles.statLabel}>{STAT_DISPLAY[key]}</span>
                        <span className={styles.statBar}>
                          <span style={{ color: typeColor }}>{bar.filled}</span>
                          <span className={styles.barEmpty}>{bar.empty}</span>
                        </span>
                        <span className={styles.statValue}>{value}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Lock indicator */}
            <div className={styles.lockHint}>
              {locked ? '▸ LOCKED — click to dismiss' : '▸ click to lock'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRosterCard;
