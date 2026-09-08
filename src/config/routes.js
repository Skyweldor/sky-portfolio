// ---------------------------------------------------------------------------
// Route registry — single source of truth for every in-app URL.
//
// The site is a studio with a portfolio of sub-brands, so each subsidiary owns a
// path prefix. SynthCity DigiLabs Interactive is the only one live at launch;
// StickerLabs, Elevate, and Cirrus Learning get their own roots as they ship,
// which is why the paths are built from a root constant rather than written out.
//
// NOTE: `/blog-posts/...` under public/ is an ASSET directory, not a route. Do not
// let a find-and-replace conflate the two.
// ---------------------------------------------------------------------------

export const INTERACTIVE_ROOT = '/interactive';

export const ROUTES = {
  home: '/',

  // --- SynthCity DigiLabs Interactive ---
  interactive: INTERACTIVE_ROOT,
  blog: `${INTERACTIVE_ROOT}/blog`,
  pokedex: `${INTERACTIVE_ROOT}/blog/pokedex`,
  regionPokedex: (region) => `${INTERACTIVE_ROOT}/blog/${region}-pokedex`,
  pokemmoJournal: (n) => `${INTERACTIVE_ROOT}/blog/pokemmo-journal-${n}`,
  downloads: `${INTERACTIVE_ROOT}/downloads`,
  download: (id) => `${INTERACTIVE_ROOT}/downloads/${id}`,
  aetherbound: `${INTERACTIVE_ROOT}/aetherbound`,
  minigames: `${INTERACTIVE_ROOT}/minigames`,
  prototype: `${INTERACTIVE_ROOT}/prototype`,

  // --- Gated at launch (routes stay registered so direct URLs work for QA) ---
  makeup: '/makeup',
  stickers: '/stickers',
};

/**
 * True on any route owned by SynthCity DigiLabs Interactive. Drives whether the
 * navbar shows the "Interactive" sub-line under the parent wordmark — every other
 * route renders the parent wordmark alone.
 */
export const isInteractiveRoute = (pathname) =>
  pathname === INTERACTIVE_ROOT || pathname.startsWith(`${INTERACTIVE_ROOT}/`);

export default ROUTES;
