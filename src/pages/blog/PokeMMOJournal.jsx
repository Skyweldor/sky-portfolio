import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components/common/NavBar';
import parseInlineMarkup from '../../utils/parseInlineMarkup';
import journal from '../../data/blog/pokemmo-journal-1';
import styles from './PokeMMOJournal.module.css';

const BATTLE_LOG_STYLES = {
  normal: 'logLine',
  highlight: 'logHighlight',
  damage: 'logDamage',
};

const renderSection = (section, index) => {
  switch (section.type) {
    case 'paragraph':
      return (
        <p key={index} className={section.dropCap ? styles.dropCap : undefined}>
          {parseInlineMarkup(section.text)}
        </p>
      );

    case 'sectionLabel':
      return (
        <div key={index} className={styles.sectionLabel}>{section.text}</div>
      );

    case 'battleLog':
      return (
        <div key={index} className={styles.battleLog}>
          {section.lines.map((line, i) => (
            <div key={i} className={styles[BATTLE_LOG_STYLES[line.style] || 'logLine']}>
              {line.text || '\u00a0'}
            </div>
          ))}
        </div>
      );

    case 'callout':
      return (
        <div key={index} className={styles.callout}>
          <div className={styles.calloutLabel}>&#9632; {section.label}</div>
          <p>{parseInlineMarkup(section.text)}</p>
        </div>
      );

    case 'teamGrid':
      return (
        <div key={index} className={styles.teamGrid}>
          {section.members.map((m) => (
            <div key={m.name} className={styles.pokeCard} data-type={m.dataType}>
              <div className={styles.pokeName}>{m.name}</div>
              <div className={styles.pokeLevel}>Lv. {m.level}</div>
              <div className={styles.typeBadges}>
                {m.types.map((t) => (
                  <span key={t} className={`${styles.typeBadge} ${styles[`type${t}`]}`}>{t}</span>
                ))}
              </div>
              <div className={styles.pokeAbility}>{m.ability}</div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

const PokeMMOJournal = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { header, body, footer } = journal;
  const titleParts = header.title.split('\n');

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <div className={styles.wrapper}>
        {/* Back link */}
        <div className={styles.backLinkRow}>
          <Link to="/blog" className={styles.backLink}>
            &larr; Back to Blog
          </Link>
        </div>

        {/* ==================== HEADER ==================== */}
        <header className={styles.blogHeader}>
          <div className={styles.blogName}>&#9670; PokeMMO Journal</div>
          <h1 className={styles.postTitle}>
            {titleParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {part}
              </React.Fragment>
            ))}
          </h1>
          <div className={styles.postMeta}>
            <span className={styles.postDate}>Entry {header.entry} &mdash; {header.date}</span>
            {header.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </header>

        {/* ==================== BODY ==================== */}
        <div className={styles.postBody}>
          {body.map(renderSection)}
        </div>

        {/* ==================== FOOTER ==================== */}
        <footer className={styles.postFooter}>
          <div>
            <div className={styles.nextLabel}>Up next &mdash;</div>
            <div className={styles.nextHint}>{footer.nextLabel}</div>
          </div>
          <div className={styles.badgeCount}>
            &#9632; {footer.badges} BADGES
            <span>{footer.region}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PokeMMOJournal;
