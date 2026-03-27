import React from 'react';
import styles from './HeroPlaceholder.module.css';

const TYPE_CLASSES = {
  demo: styles.demo,
  tool: styles.tool,
  asset: styles.asset,
  docs: styles.docs,
};

const HeroPlaceholder = ({ type = 'demo', title = '' }) => {
  const typeClass = TYPE_CLASSES[type] || TYPE_CLASSES.demo;

  return (
    <div className={`${styles.hero} ${typeClass}`}>
      <div className={styles.gridOverlay} />
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};

export default HeroPlaceholder;
