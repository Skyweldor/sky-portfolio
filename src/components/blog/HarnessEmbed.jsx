import React, { useEffect, useRef, useState } from 'react';
import styles from './HarnessEmbed.module.css';

/**
 * Embeds one of the live harnesses, served as a static sub-app out of `public/harness/`.
 *
 * The harnesses are shipped verbatim rather than rewritten as React components: they are
 * deliberately plain three.js with module-level state, and they carry their own
 * three@0.184 (the site itself pins 0.160). An iframe keeps both intact.
 *
 * The frame is only mounted once it scrolls near the viewport — three.js booting three
 * times over would otherwise stall first paint on a post that embeds several.
 *
 * @param src     path under /harness/, e.g. `/harness/animation/anim-test.html`
 * @param title   accessible name for the frame; required
 * @param height  CSS height for the frame; harnesses size to their container
 * @param note    optional line rendered under the frame
 */
const HarnessEmbed = ({ src, title, height = 620, note }) => {
  const holderRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = holderRef.current;
    if (!node) return undefined;

    // No IntersectionObserver (jsdom in tests, very old browsers) — just show it.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    // IntersectionObserver only fires once the page is actually painted. In a context that
    // never paints — a hidden preview pane, a thumbnailer — it stays silent and the viewer
    // is left on "loading harness…" with no way out but the full-screen link. A geometry
    // check at mount covers that without eagerly loading embeds further down the page.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight + 300 && rect.bottom > -300) {
      setVisible(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.frameHolder} ref={holderRef} style={{ height: `${height}px` }}>
        {visible ? (
          <iframe
            src={src}
            title={title}
            className={styles.frame}
            loading="lazy"
            allow="fullscreen"
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderText}>&gt; loading harness&hellip;</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {note && <span className={styles.note}>{note}</span>}
        <a
          className={styles.openLink}
          href={src}
          target="_blank"
          rel="noopener noreferrer"
        >
          open full screen &#8599;
        </a>
      </div>
    </div>
  );
};

export default HarnessEmbed;
