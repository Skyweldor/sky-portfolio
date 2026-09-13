import React from 'react';
import styles from './TerminalPanel.module.css';

/**
 * The terminal window chrome used across the blog — title bar, three dots, and a
 * `SYNTHCITY://` path label.
 *
 * This markup was previously copy-pasted at every call site (twice in Blog.jsx, three
 * times in PokeMMOJournal2.jsx). The harness posts add a dozen more, so it lives here.
 *
 * @param path    the text shown in the title bar, e.g. `SYNTHCITY://harness/animation`
 * @param label   optional `// section_header` rendered at the top of the body
 * @param wide    opt out of the 900px cap, for panels holding an embedded harness
 */
const TerminalPanel = ({ path, label, wide = false, className = '', children }) => (
  <div className={`${styles.panel} ${wide ? styles.wide : ''} ${className}`.trim()}>
    <div className={styles.titleBar}>
      <div className={styles.titleBarDots}>
        <span className={styles.dotRed} />
        <span className={styles.dotYellow} />
        <span className={styles.dotGreen} />
      </div>
      <span className={styles.titleBarPath}>{path}</span>
    </div>

    <div className={styles.body}>
      {label && <h2 className={styles.sectionHeader}>{label}</h2>}
      {children}
    </div>
  </div>
);

export default TerminalPanel;
