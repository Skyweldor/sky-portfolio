import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RegionNav.module.css';

const REGIONS = [
  { name: 'Kanto', path: '/blog/kanto-pokedex', gen: 'I', count: 151 },
  { name: 'Johto', path: '/blog/johto-pokedex', gen: 'II', count: 100 },
  { name: 'Hoenn', path: '/blog/hoenn-pokedex', gen: 'III', count: 135 },
  { name: 'Sinnoh', path: '/blog/sinnoh-pokedex', gen: 'IV', count: 107 },
  { name: 'Unova', path: '/blog/unova-pokedex', gen: 'V', count: 156 },
];

const RegionNav = ({ currentRegion }) => {
  return (
    <div className={styles.regionNav}>
      <span className={styles.navLabel}>&gt; REGION_NAV&nbsp;&nbsp;</span>
      <div className={styles.regionLinks}>
        {REGIONS.map((region, i) => {
          const isCurrent = region.name.toUpperCase() === currentRegion.toUpperCase();
          return (
            <React.Fragment key={region.name}>
              {i > 0 && <span className={styles.separator}>|</span>}
              {isCurrent ? (
                <span className={styles.currentRegion}>
                  [{region.name.toUpperCase()}]
                </span>
              ) : (
                <Link to={region.path} className={styles.regionLink}>
                  [{region.name.toUpperCase()}]
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RegionNav;
