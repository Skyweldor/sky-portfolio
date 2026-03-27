import React, { useState, useMemo } from 'react';
import DexCard from './DexCard';
import styles from './PokedexGrid.module.css';

const TYPE_FILTER_COLORS = {
  Normal:   { color: '#9e9e9e', bg: 'rgba(158,158,158,0.10)', glow: 'rgba(158,158,158,0.15)' },
  Fire:     { color: '#ff6b35', bg: 'rgba(255,107,53,0.10)',  glow: 'rgba(255,107,53,0.15)' },
  Water:    { color: '#5b8cff', bg: 'rgba(91,140,255,0.10)',  glow: 'rgba(91,140,255,0.15)' },
  Grass:    { color: '#8bc34a', bg: 'rgba(139,195,74,0.10)',  glow: 'rgba(139,195,74,0.15)' },
  Electric: { color: '#f5c842', bg: 'rgba(245,200,66,0.10)',  glow: 'rgba(245,200,66,0.15)' },
  Ice:      { color: '#80d8ff', bg: 'rgba(128,216,255,0.10)', glow: 'rgba(128,216,255,0.15)' },
  Fighting: { color: '#d32f2f', bg: 'rgba(211,47,47,0.10)',   glow: 'rgba(211,47,47,0.15)' },
  Poison:   { color: '#ce93d8', bg: 'rgba(171,71,188,0.10)',  glow: 'rgba(171,71,188,0.15)' },
  Ground:   { color: '#d4a574', bg: 'rgba(212,165,116,0.10)', glow: 'rgba(212,165,116,0.15)' },
  Flying:   { color: '#90caf9', bg: 'rgba(128,216,255,0.10)', glow: 'rgba(128,216,255,0.15)' },
  Psychic:  { color: '#ff6090', bg: 'rgba(255,96,144,0.10)',  glow: 'rgba(255,96,144,0.15)' },
  Bug:      { color: '#9ccc65', bg: 'rgba(156,204,101,0.10)', glow: 'rgba(156,204,101,0.15)' },
  Rock:     { color: '#a1887f', bg: 'rgba(161,136,127,0.10)', glow: 'rgba(161,136,127,0.15)' },
  Ghost:    { color: '#7e57c2', bg: 'rgba(126,87,194,0.10)',  glow: 'rgba(126,87,194,0.15)' },
  Dragon:   { color: '#7038f8', bg: 'rgba(112,56,248,0.10)',  glow: 'rgba(112,56,248,0.15)' },
  Steel:    { color: '#b0bec5', bg: 'rgba(176,190,197,0.10)', glow: 'rgba(176,190,197,0.15)' },
  Fairy:    { color: '#f48fb1', bg: 'rgba(244,143,177,0.10)', glow: 'rgba(244,143,177,0.15)' },
};

const PokedexGrid = ({ pokemon, types, natureData }) => {
  const [activeType, setActiveType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = pokemon;

    if (activeType !== 'ALL') {
      result = result.filter((p) => p.types.includes(activeType));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          String(p.id).padStart(3, '0').includes(q)
      );
    }

    return result;
  }, [pokemon, activeType, searchQuery]);

  return (
    <div>
      {/* Type filter bar */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${activeType === 'ALL' ? styles.filterBtnActive : ''}`}
          style={
            activeType === 'ALL'
              ? { '--active-color': '#00eaff', '--active-bg': 'rgba(0,234,255,0.1)', '--active-glow': 'rgba(0,234,255,0.15)' }
              : undefined
          }
          onClick={() => setActiveType('ALL')}
        >
          All
        </button>
        {types.map((type) => {
          const tc = TYPE_FILTER_COLORS[type] || TYPE_FILTER_COLORS.Normal;
          const isActive = activeType === type;
          return (
            <button
              key={type}
              className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
              style={
                isActive
                  ? { '--active-color': tc.color, '--active-bg': tc.bg, '--active-glow': tc.glow }
                  : undefined
              }
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Search + result count */}
      <div className={styles.searchRow}>
        <span className={styles.searchPrompt}>&gt; search:</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="enter pokémon name or dex #..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search Pokémon"
        />
        <span className={styles.resultCount}>
          SHOWING {filtered.length} / {pokemon.length}
        </span>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.length > 0 ? (
          filtered.map((p) => <DexCard key={p.id} pokemon={p} natureInfo={natureData?.[p.id]} />)
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyText}>
              &gt; NO_MATCH_FOUND — try a different query
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexGrid;
