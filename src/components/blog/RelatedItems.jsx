import React from 'react';
import { Link } from 'react-router-dom';
import { CATALOG_DETAIL_ITEMS } from '../../data/catalogDetailData';
import styles from './RelatedItems.module.css';

const RelatedItems = ({ relatedIds = [] }) => {
  const related = relatedIds
    .map((id) => CATALOG_DETAIL_ITEMS.find((item) => item.id === id))
    .filter(Boolean);

  if (related.length === 0) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Related Items</h2>
      <div className={styles.grid}>
        {related.map((item) => (
          <Link
            key={item.id}
            to={`/downloads/${item.id}`}
            className={styles.miniCard}
          >
            <span className={`${styles.typeBadge} ${styles[item.type] || ''}`}>
              {item.type.toUpperCase()}
            </span>
            <h3 className={styles.miniTitle}>{item.title}</h3>
            <p className={styles.miniDesc}>{item.description}</p>
            <div className={styles.miniMeta}>
              <span>{item.fileSize}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedItems;
