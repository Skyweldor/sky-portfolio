import React from 'react';
import parseInlineMarkup from '../../utils/parseInlineMarkup';
import ImageGallery from './ImageGallery';
import HarnessEmbed from './HarnessEmbed';
import styles from './PostBody.module.css';

/**
 * Renders a post body from a typed block array.
 *
 * Generalised from the `renderSection` switch in pages/blog/PokeMMOJournal.jsx. That
 * version's `battleLog` and `teamGrid` blocks stayed behind — they are specific to the
 * PokeMMO journals — and the block types the harness posts need were added instead.
 *
 * Blocks:
 *   paragraph    { text, dropCap? }        **bold** / *italic* via parseInlineMarkup
 *   sectionLabel { text }
 *   callout      { label, text }
 *   quote        { text, cite? }           pulled straight from a source doc
 *   codeBlock    { lang?, caption?, code }
 *   specTable    { caption?, headers[], rows[][] }
 *   figure       { src, alt, caption? }
 *   gallery      { images[], alt, caption? }
 *   harnessEmbed { src, title, height?, note? }
 */
const renderBlock = (block, i) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={i} className={block.dropCap ? styles.dropCap : styles.para}>
          {parseInlineMarkup(block.text)}
        </p>
      );

    case 'sectionLabel':
      return <div key={i} className={styles.sectionLabel}>{block.text}</div>;

    case 'callout':
      return (
        <div key={i} className={styles.callout}>
          <div className={styles.calloutLabel}>&#9632; {block.label}</div>
          <p>{parseInlineMarkup(block.text)}</p>
        </div>
      );

    case 'quote':
      return (
        <blockquote key={i} className={styles.quote}>
          <p>{parseInlineMarkup(block.text)}</p>
          {block.cite && <cite className={styles.cite}>&mdash; {block.cite}</cite>}
        </blockquote>
      );

    case 'codeBlock':
      return (
        <figure key={i} className={styles.codeFigure}>
          <div className={styles.codeHead}>
            <span className={styles.codeLang}>{block.lang || 'text'}</span>
          </div>
          <pre className={styles.code}><code>{block.code}</code></pre>
          {block.caption && (
            <figcaption className={styles.caption}>{parseInlineMarkup(block.caption)}</figcaption>
          )}
        </figure>
      );

    case 'specTable':
      return (
        <figure key={i} className={styles.tableFigure}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {block.headers.map((h, hi) => (
                    <th key={hi} scope="col">{parseInlineMarkup(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>{parseInlineMarkup(String(cell))}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className={styles.caption}>{parseInlineMarkup(block.caption)}</figcaption>
          )}
        </figure>
      );

    case 'figure':
      return (
        <figure key={i} className={styles.figure}>
          <img src={block.src} alt={block.alt} className={styles.figureImg} loading="lazy" />
          {block.caption && (
            <figcaption className={styles.caption}>{parseInlineMarkup(block.caption)}</figcaption>
          )}
        </figure>
      );

    case 'gallery':
      return (
        <figure key={i} className={styles.figure}>
          <ImageGallery images={block.images} alt={block.alt} />
          {block.caption && (
            <figcaption className={styles.caption}>{parseInlineMarkup(block.caption)}</figcaption>
          )}
        </figure>
      );

    case 'harnessEmbed':
      return (
        <HarnessEmbed
          key={i}
          src={block.src}
          title={block.title}
          height={block.height}
          note={block.note}
        />
      );

    default:
      return null;
  }
};

const PostBody = ({ body = [] }) => (
  <div className={styles.postBody}>{body.map(renderBlock)}</div>
);

export default PostBody;
