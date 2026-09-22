import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Converts simple inline markup to React elements.
 *   **text**       → <strong>text</strong>
 *   *text*         → <em>text</em>
 *   `text`         → <code>text</code>
 *   [text](/route) → <Link to="/route">text</Link>      (internal)
 *   [text](https:) → <a href target="_blank">text</a>   (external)
 *
 * Code spans are matched before emphasis so that `*` inside a code span is
 * rendered literally rather than being read as an italic delimiter.
 */
const PATTERN = /(`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*)/g;

export default function parseInlineMarkup(text) {
  const parts = [];
  let lastIndex = 0;
  let match;

  PATTERN.lastIndex = 0;

  while ((match = PATTERN.exec(text)) !== null) {
    const [whole, , code, linkText, href, bold, italic] = match;

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (code) {
      parts.push(<code key={match.index}>{code}</code>);
    } else if (linkText) {
      parts.push(
        href.startsWith('/') ? (
          <Link key={match.index} to={href}>{linkText}</Link>
        ) : (
          <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">
            {linkText}
          </a>
        )
      );
    } else if (bold) {
      parts.push(<strong key={match.index}>{bold}</strong>);
    } else if (italic) {
      parts.push(<em key={match.index}>{italic}</em>);
    }

    lastIndex = match.index + whole.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}
