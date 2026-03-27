import React from 'react';
import { Link } from 'react-router-dom';
import { Controller, Archive, Tools, FileEarmarkPdf } from 'react-bootstrap-icons';
import styles from './DownloadCard.module.css';

const ICON_MAP = {
  demo: Controller,
  asset: Archive,
  tool: Tools,
  docs: FileEarmarkPdf,
};

const DownloadCard = ({ id, title, description, tags, fileSize, type }) => {
  const IconComponent = ICON_MAP[type] || Controller;

  return (
    <div className={styles.card}>
      <div className={`${styles.iconArea} ${styles[type] || ''}`}>
        <IconComponent size={28} className={styles.icon} />
      </div>

      <div className={styles.infoArea}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.tagRow}>
          {tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.actionArea}>
        <span className={styles.fileSize}>{fileSize}</span>
        <Link to={`/downloads/${id}`} className={styles.downloadBtn}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default DownloadCard;
