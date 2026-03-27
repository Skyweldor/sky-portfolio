import React from 'react';
import styles from './DexCard.module.css';

const TYPE_COLORS = {
  Normal:   { color: '#9e9e9e', bg: 'rgba(158,158,158,0.12)', border: 'rgba(158,158,158,0.25)' },
  Fire:     { color: '#ff6b35', bg: 'rgba(255,107,53,0.12)',  border: 'rgba(255,107,53,0.25)' },
  Water:    { color: '#5b8cff', bg: 'rgba(91,140,255,0.12)',  border: 'rgba(91,140,255,0.25)' },
  Grass:    { color: '#8bc34a', bg: 'rgba(139,195,74,0.12)',  border: 'rgba(139,195,74,0.25)' },
  Electric: { color: '#f5c842', bg: 'rgba(245,200,66,0.12)',  border: 'rgba(245,200,66,0.25)' },
  Ice:      { color: '#80d8ff', bg: 'rgba(128,216,255,0.12)', border: 'rgba(128,216,255,0.25)' },
  Fighting: { color: '#d32f2f', bg: 'rgba(211,47,47,0.12)',   border: 'rgba(211,47,47,0.25)' },
  Poison:   { color: '#ce93d8', bg: 'rgba(171,71,188,0.12)',  border: 'rgba(171,71,188,0.25)' },
  Ground:   { color: '#d4a574', bg: 'rgba(212,165,116,0.12)', border: 'rgba(212,165,116,0.25)' },
  Flying:   { color: '#90caf9', bg: 'rgba(128,216,255,0.12)', border: 'rgba(128,216,255,0.25)' },
  Psychic:  { color: '#ff6090', bg: 'rgba(255,96,144,0.12)',  border: 'rgba(255,96,144,0.25)' },
  Bug:      { color: '#9ccc65', bg: 'rgba(156,204,101,0.12)', border: 'rgba(156,204,101,0.25)' },
  Rock:     { color: '#a1887f', bg: 'rgba(161,136,127,0.12)', border: 'rgba(161,136,127,0.25)' },
  Ghost:    { color: '#7e57c2', bg: 'rgba(126,87,194,0.12)',  border: 'rgba(126,87,194,0.25)' },
  Dragon:   { color: '#7038f8', bg: 'rgba(112,56,248,0.12)',  border: 'rgba(112,56,248,0.25)' },
  Steel:    { color: '#b0bec5', bg: 'rgba(176,190,197,0.12)', border: 'rgba(176,190,197,0.25)' },
  Fairy:    { color: '#f48fb1', bg: 'rgba(244,143,177,0.12)', border: 'rgba(244,143,177,0.25)' },
};

const DexCard = ({ pokemon, natureInfo }) => {
  const primaryType = pokemon.types[0];
  const primaryColor = TYPE_COLORS[primaryType]?.color || '#00eaff';

  return (
    <div
      className={styles.card}
      style={{ '--type-color': primaryColor }}
      aria-label={`${pokemon.name}, #${String(pokemon.id).padStart(3, '0')}`}
    >
      {/* Left flank — vertical dex number + name */}
      <div className={styles.flank}>
        <span className={styles.flankName}>{pokemon.name}</span>
        <span className={styles.dexNumber}>
          #{String(pokemon.id).padStart(3, '0')}
        </span>
      </div>

      {/* Main card body — sprite + type badges */}
      <div className={styles.cardBody}>
        <div className={styles.spriteWrapper}>
          <img
            className={styles.sprite}
            src={process.env.PUBLIC_URL + pokemon.sprite}
            alt={pokemon.name}
            loading="lazy"
          />
        </div>

        <div className={styles.typeBadges}>
          {pokemon.types.map((type) => {
            const tc = TYPE_COLORS[type] || TYPE_COLORS.Normal;
            return (
              <span
                key={type}
                className={styles.typeBadge}
                style={{
                  '--badge-color': tc.color,
                  '--badge-bg': tc.bg,
                  '--badge-border': tc.border,
                }}
              >
                {type}
              </span>
            );
          })}
        </div>
      </div>

      {/* Hover tooltip for nature info */}
      {natureInfo && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.tooltipHeader}>{pokemon.name}</div>
          <div className={styles.tooltipDivider} />
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipKey}>ROLE</span>
            <span className={styles.tooltipValue}>{natureInfo.role}</span>
          </div>
          {natureInfo.bestNature && (
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipKey}>NATURE</span>
              <span className={styles.tooltipValue}>
                {natureInfo.bestNature}
                <span className={styles.tooltipBoost}> +{natureInfo.boosts}</span>
                <span className={styles.tooltipLower}> -{natureInfo.lowers}</span>
              </span>
            </div>
          )}
          {natureInfo.altNature && (
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipKey}>ALT</span>
              <span className={styles.tooltipValue}>
                {natureInfo.altNature}
                <span className={styles.tooltipBoost}> +{natureInfo.altBoosts}</span>
                <span className={styles.tooltipLower}> -{natureInfo.altLowers}</span>
              </span>
            </div>
          )}
          {natureInfo.notes && (
            <>
              <div className={styles.tooltipDivider} />
              <div className={styles.tooltipNotes}>{natureInfo.notes}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DexCard;
