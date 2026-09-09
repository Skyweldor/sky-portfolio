import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components/common/NavBar';
import PokedexGrid from '../../components/blog/PokedexGrid';
import styles from './KantoPokedex.module.css';
import { ROUTES } from '../../config/routes';

// Region order drives nav ordering and the [All] concatenation order.
const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova'];

// Per-region loader. Lazy-imports data only when the region's data is needed,
// so the unified page's initial JS chunk doesn't ship ~5k lines of dex data.
const REGION_LOADERS = {
  Kanto: async () => {
    const [dex, nat] = await Promise.all([
      import('../../data/kantoDexData'),
      import('../../data/kantoNatureData'),
    ]);
    return { pokemon: dex.KANTO_DEX, types: dex.KANTO_TYPES, natures: nat.KANTO_NATURES };
  },
  Johto: async () => {
    const [dex, nat] = await Promise.all([
      import('../../data/johtoDexData'),
      import('../../data/johtoNatureData'),
    ]);
    return { pokemon: dex.JOHTO_DEX, types: dex.JOHTO_TYPES, natures: nat.JOHTO_NATURES };
  },
  Hoenn: async () => {
    const [dex, nat] = await Promise.all([
      import('../../data/hoennDexData'),
      import('../../data/hoennNatureData'),
    ]);
    return { pokemon: dex.HOENN_DEX, types: dex.HOENN_TYPES, natures: nat.HOENN_NATURES };
  },
  Sinnoh: async () => {
    const [dex, nat] = await Promise.all([
      import('../../data/sinnohDexData'),
      import('../../data/sinnohNatureData'),
    ]);
    return { pokemon: dex.SINNOH_DEX, types: dex.SINNOH_TYPES, natures: nat.SINNOH_NATURES };
  },
  Unova: async () => {
    const [dex, nat] = await Promise.all([
      import('../../data/unovaDexData'),
      import('../../data/unovaNatureData'),
    ]);
    return { pokemon: dex.UNOVA_DEX, types: dex.UNOVA_TYPES, natures: nat.UNOVA_NATURES };
  },
};

const REGION_META = {
  Kanto:  { gen: 'I',   range: '#001 — #151' },
  Johto:  { gen: 'II',  range: '#152 — #251' },
  Hoenn:  { gen: 'III', range: '#252 — #386' },
  Sinnoh: { gen: 'IV',  range: '#387 — #493' },
  Unova:  { gen: 'V',   range: '#494 — #649' },
};

const AllPokedex = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  // Cache loaded region data so switching regions doesn't re-fetch.
  const [loaded, setLoaded] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Determine which regions need to be loaded for the current selection.
  const requiredRegions = useMemo(
    () => (selectedRegion === 'All' ? REGIONS : [selectedRegion]),
    [selectedRegion]
  );

  useEffect(() => {
    let cancelled = false;
    const missing = requiredRegions.filter((r) => !loaded[r]);
    if (missing.length === 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    Promise.all(missing.map((r) => REGION_LOADERS[r]().then((data) => [r, data])))
      .then((entries) => {
        if (cancelled) return;
        setLoaded((prev) => {
          const next = { ...prev };
          entries.forEach(([r, data]) => { next[r] = data; });
          return next;
        });
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error('Failed to load region data', err);
        setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [requiredRegions, loaded]);

  // Combined view: pokemon array, type union, merged nature data.
  const view = useMemo(() => {
    const regions = requiredRegions.filter((r) => loaded[r]);
    if (regions.length === 0) return { pokemon: [], types: [], natures: {} };
    const pokemon = regions.flatMap((r) => loaded[r].pokemon);
    const typeSet = new Set();
    regions.forEach((r) => loaded[r].types.forEach((t) => typeSet.add(t)));
    const natures = regions.reduce((acc, r) => ({ ...acc, ...loaded[r].natures }), {});
    return { pokemon, types: Array.from(typeSet), natures };
  }, [requiredRegions, loaded]);

  const totalCount = view.pokemon.length;
  const headerLabel = selectedRegion === 'All' ? 'ALL REGIONS' : selectedRegion.toUpperCase();
  const headerGen = selectedRegion === 'All' ? 'I — V' : REGION_META[selectedRegion].gen;
  const headerRange = selectedRegion === 'All' ? '#001 — #649' : REGION_META[selectedRegion].range;

  const handleSelect = useCallback((region) => {
    setSelectedRegion(region);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <Container>
        <div className={styles.backLinkRow}>
          <Link to={ROUTES.blog} className={styles.backLink}>
            &larr; Back to Blog
          </Link>
        </div>

        {/* In-page region nav: [All] + 5 regions, state-driven (no route change) */}
        <div className={styles.backLinkRow} style={{ marginTop: 12, gap: 12, flexWrap: 'wrap' }}>
          <span className={styles.backLink} style={{ cursor: 'default' }}>&gt; REGION_NAV</span>
          {['All', ...REGIONS].map((region, i) => {
            const isCurrent = region === selectedRegion;
            return (
              <React.Fragment key={region}>
                <button
                  type="button"
                  onClick={() => handleSelect(region)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: isCurrent ? 'default' : 'pointer',
                    padding: '0 4px',
                    fontFamily: '"Courier New", monospace',
                    fontSize: 13,
                    fontWeight: isCurrent ? 700 : 400,
                    color: isCurrent ? '#00eaff' : '#b8b8b8',
                    textShadow: isCurrent ? '0 0 10px rgba(0,234,255,0.4)' : 'none',
                    letterSpacing: '0.5px',
                  }}
                >
                  [{region.toUpperCase()}]
                </button>
                {i < REGIONS.length && <span style={{ color: '#3a3f5c' }}>|</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* ========== TERMINAL HEADER PANEL ========== */}
        <div className={styles.terminalPanel}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.titleBarPath}>
              SYNTHCITY://pokedex/{selectedRegion.toLowerCase()}
            </span>
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.region</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>{headerLabel}</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.generation</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>{headerGen}</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.total_entries</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>{isLoading ? '...' : totalCount}</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.range</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>{headerRange}</span>
            </div>
            <div className={styles.kvLine}>
              <span className={styles.kvKey}>&gt; DEX.source</span>
              <span className={styles.kvSep}>&nbsp;::&nbsp;</span>
              <span className={styles.kvValue}>PokéSprite / Gen VIII Assets</span>
            </div>

            <div className={styles.progressBar}>
              <span className={styles.progressLabel}>&gt; LOAD_STATUS&nbsp;&nbsp;</span>
              <span className={styles.progressFill}>
                {isLoading ? '████████░░░░░░░░░░░░░░░░' : '████████████████████████'}
              </span>
              <span className={styles.progressStatus}>
                &nbsp;{isLoading ? 'LOADING...' : 'COMPLETE'}
              </span>
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
              SYNTHCITY://pokedex/{selectedRegion.toLowerCase()}/entries
            </span>
          </div>

          <div className={styles.terminalBody}>
            <h2 className={styles.sectionHeader}>{'// DEX_ENTRIES'}</h2>
            {isLoading && totalCount === 0 ? (
              <div style={{ padding: '24px 0', color: '#7a8aa8', fontFamily: 'monospace' }}>
                &gt; FETCHING_REGION_DATA...
              </div>
            ) : (
              <PokedexGrid
                pokemon={view.pokemon}
                types={view.types}
                natureData={view.natures}
              />
            )}
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
              <span className={styles.footerHighlight}>&gt;</span> Region data lazy-loaded on selection
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AllPokedex;
