# Plan: Blog Landing Page, Content Architecture, and Polish

**Date:** 2026-03-26
**Status:** Draft
**Scope:** Blog hub, Downloads/Catalog naming, placeholder asset resolution, mobile/visual polish

---

## Current State Summary

| Route | What's There | Component |
|---|---|---|
| `/blog` | Placeholder page with two hardcoded dummy posts | `Blog.jsx` -> `BlogPage.js` (legacy) |
| `/blog/kanto-pokedex` | Full terminal-style Pokedex grid (151 entries) | `KantoPokedex.jsx` |
| `/blog/johto-pokedex` | Pokedex grid (100 entries) | `JohtoPokedex.jsx` |
| `/blog/hoenn-pokedex` | Pokedex grid | `HoennPokedex.jsx` |
| `/blog/sinnoh-pokedex` | Route referenced but not wired | Does not exist yet |
| `/blog/unova-pokedex` | Route referenced but not wired | Does not exist yet |
| `/catalog` | 8 download cards (games, assets, tools, docs) | `Catalog.jsx` |
| `/catalog/:id` | Detail pages with 3 layout variants (A/B/C) | `BlogDetail.jsx` |
| `blog-posts/pokemmo-blog-post-1.html` | Standalone HTML blog post (PokeMMO journal) | Not yet integrated into React |

**Key observations:**
- The nav CTA button says "Downloads" and links to `/catalog`. There is no nav link to `/blog` in the current NavBar.
- `BlogPage.js` is a legacy component with zero real content. It doesn't use the site's design system at all.
- The Pokedex pages use Layout C's terminal chrome and live under `/blog/`, which is architecturally correct -- they are companion content for the PokeMMO journal.
- All 8 catalog detail items reference hero images, gallery images, and download URLs that do not exist (`/assets/blog/*.jpg`, `downloadUrl: '#'`).
- Layout B's floating panel loses its negative-margin overlap on mobile since the hero shrinks to 35vh and the panel flattens to margin-top: 0.

---

## 1. Blog Landing Page

### Recommendation: Build a real `/blog` hub page

**Priority: P0**

The current `BlogPage.js` is dead weight. Replace it with a proper hub that surfaces two distinct content categories:

**Section A -- Journal Entries (blog posts)**
- The PokeMMO journal post and any future write-ups.
- Each entry gets a card with: title, date, short excerpt, a category tag ("Journal", "Dev Log", etc.), and a link.
- Render these from a data file (`src/data/blogPostData.js`) so new posts are just data additions.

**Section B -- Pokedex Companion Pages**
- The Kanto/Johto/Hoenn (and eventually Sinnoh/Unova) Pokedex pages.
- Display as a horizontal row of region cards with the region name, generation number, entry count, and a small sprite preview.
- These are reference/companion content, not journal entries, so they should be visually distinct from the blog post cards.

**Layout approach:** Use the terminal panel chrome from Layout C. The blog hub should feel like a terminal file browser:

```
SYNTHCITY://blog
> ls -la

  TYPE        TITLE                              DATE
  [JOURNAL]   First Steps in Kanto               2026-03-15
  [JOURNAL]   Building the Horror Toolkit        2026-03-20

> ls pokedex/

  REGION      GENERATION    ENTRIES    STATUS
  Kanto       I             151        COMPLETE
  Johto       II            100        COMPLETE
  Hoenn       III           135        COMPLETE
  Sinnoh      IV            ---        QUEUED
  Unova       V             ---        QUEUED
```

This keeps the cyberpunk/terminal aesthetic consistent with the Pokedex pages and Layout C, and it makes the blog hub feel like navigating a filesystem rather than a generic blog index.

**Implementation steps:**

1. Create `src/data/blogPostData.js` with an array of post metadata (id, title, date, excerpt, route, category, status).
2. Delete or fully rewrite `src/components/portfolio/BlogPage.js`.
3. Build `src/pages/Blog.jsx` as a new component (replace the current wrapper that imports BlogPage).
4. Use terminal panel chrome (extract the shared terminal chrome into a reusable `TerminalPanel` component from the existing Layout C / Pokedex code -- there is significant duplication right now).
5. Add a "Blog" link to the NavBar alongside the Downloads CTA, or replace the current approach (see Section 2).

**What NOT to do:**
- Do not try to merge blog posts and download cards into one page. They serve different purposes and different audiences.
- Do not use Layout A or Layout B for the blog hub. The terminal aesthetic is the strongest and most distinctive design in the site.

---

## 2. Downloads Section Naming and Navigation

### Recommendation: Keep "Downloads" and "Blog" as separate sections

**Priority: P1**

The current naming is close to right. Here is the specific recommendation:

| Section | Route | Nav Label | What It Contains |
|---|---|---|---|
| Downloads | `/downloads` | "Downloads" | Game demos, asset packs, dev tools, documentation |
| Blog | `/blog` | "Blog" | Journal entries (PokeMMO, dev logs) + Pokedex companion pages |

**Rename `/catalog` to `/downloads`:**
- The page heading already says "Downloads." The route should match.
- Update `App.js` route from `/catalog` to `/downloads`.
- Update `/catalog/:id` to `/downloads/:id`.
- Keep the component file names as-is (renaming files is churn with no user benefit), but update all internal `<Link to="/catalog">` references across:
  - `DownloadCard.jsx` (line 34)
  - `BlogDetailLayoutA.jsx` (line 52)
  - `BlogDetailLayoutB.jsx` (line 48)
  - `BlogDetailLayoutC.jsx` (lines 25, 40, 119)
  - `RelatedItems.jsx` (check for `/catalog/` links)

**Navigation changes:**
- The NavBar currently only has a "Downloads" CTA button on the right side (line 193 of NavBar.js). There is no visible Blog link anywhere in the nav.
- Add "Blog" as a nav link. Two options:
  - **Option A (recommended):** Add "Blog" and "Downloads" as inline links next to Skills/Projects in the left-side `desktopOnlyLinks` div. Remove the standalone CTA button on the right, or keep it as a styled accent link.
  - **Option B:** Keep "Downloads" as the CTA button, add "Blog" as a second link next to it in the `navRight` div.
- For mobile, both links should appear in the collapsed hamburger menu.

**Do NOT merge blog and downloads into one section.** The mental models are different:
- Downloads = "I want to grab a file" (transactional).
- Blog = "I want to read something" (browsing).
- Forcing them together would confuse both audiences.

---

## 3. Placeholder Assets Resolution

### Recommendation: CSS-only hero sections + gradient card thumbnails

**Priority: P0** (the detail pages are currently broken/ugly without images)

The `catalogDetailData.js` references 16 image paths that do not exist. There is no `/assets/blog/` directory at all, and no `/public/assets/blog/` directory either. Here is a concrete approach for each asset type:

### 3a. Hero Images (8 items, each with a `heroImage` field)

**Approach: Replace `<img>` tags with CSS gradient hero sections.**

Each catalog item already has a `type` field (demo, asset, tool, docs) with associated accent colors. Generate a full-width hero section using:

```css
.heroFallback {
  width: 100%;
  height: 300px;
  background: linear-gradient(
    135deg,
    var(--hero-color-1) 0%,
    var(--hero-color-2) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  position: relative;
}

.heroFallback::after {
  /* Grid overlay for cyberpunk texture */
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 234, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 234, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

Map type to gradient colors:
- `demo` -> cyan/dark blue (`#00eaff` to `#001a33`)
- `tool` -> magenta/dark purple (`#ff29ff` to `#1a0033`)
- `asset` -> purple/dark indigo (`#9f00ff` to `#0d001a`)
- `docs` -> blue/dark navy (`#00b3ff` to `#001433`)

**Implementation:** Create a `HeroPlaceholder` component that takes `type` and `title` as props. Render the title text overlaid on the gradient. This is better than broken `<img>` tags and maintains the cyberpunk aesthetic.

All three layout variants (A, B, C) should check: if `heroImage` is falsy or starts with a known placeholder prefix, render `HeroPlaceholder` instead.

### 3b. Gallery Images (8 items, 1-3 gallery images each = ~18 references)

**Approach: Hide the gallery section when images don't exist.**

The gallery sections in all three layouts already conditionally render (`gallery.length > 0`). The problem is the arrays are populated with paths to non-existent files.

Two options:
1. **Quick fix (recommended for now):** Set `gallery: []` in `catalogDetailData.js` for all items. The gallery sections will simply not render. When real screenshots exist, add them back.
2. **CSS placeholder gallery:** Generate small gradient thumbnail cards. This adds visual noise without adding real information -- not worth it.

### 3c. Download URLs (all 8 items have `downloadUrl: '#'`)

**Approach: Change the download button behavior for placeholder items.**

- Add a `downloadAvailable: false` field to items that don't have real downloads.
- When `downloadAvailable` is false, render the download button as disabled with text "Coming Soon" instead of "Download."
- Style the disabled state with reduced opacity and `cursor: not-allowed`.
- This is honest UX. A `#` link that does nothing is worse than a clearly disabled button.

### 3d. Implementation order

1. **P0:** Create `HeroPlaceholder` component.
2. **P0:** Update all three layout components to use `HeroPlaceholder` when no real hero image exists.
3. **P0:** Clear gallery arrays in `catalogDetailData.js`.
4. **P1:** Add `downloadAvailable` flag and disabled download button styling.

---

## 4. Mobile and Visual Polish

### 4a. Default Layout Selection

**Priority: P1**

**Recommendation: Make Layout A ("Neon Longform") the default. Remove the layout switcher for production.**

Rationale:
- Layout A is the most mobile-friendly out of the box. It is a single-column vertical flow with no complex positioning.
- Layout B has a floating glass panel with `margin-top: -60px` overlap that works beautifully on desktop but collapses to `margin-top: 0` on mobile (768px breakpoint), losing its signature visual. It also has a two-column `contentGrid` that stacks on mobile -- functional, but the sidebar loses context when it is pushed below the main content.
- Layout C is visually distinctive but the terminal chrome takes more vertical space on small screens (all the kv-lines, the progress bar, the cursor). It is the best layout aesthetically, but it is the worst for content density on mobile.
- Keep the `?layout=b` and `?layout=c` query params for dev/preview purposes, but do not expose them in the UI. If Layout C's terminal style becomes the site's identity (which I think it should long-term), consider making it the default once the mobile treatment is tightened.

### 4b. Layout B Mobile Fixes

**Priority: P2**

If Layout B is kept as an option:

- **Floating panel overlap:** On mobile, instead of `margin-top: 0`, use `margin-top: -30px` with `border-radius: 12px 12px 0 0` so it still visually connects to the hero.
- **Download button full-width:** Already handled in the existing CSS (`flex-direction: column` on `.panelFooter` at 768px). Good.
- **Content grid stacking:** The sidebar should come BEFORE the about section on mobile so the quick facts (author, size, date) are visible without scrolling past the long description. Use `order: -1` on `.detailsSidebar` at 768px.

### 4c. Layout C Performance

**Priority: P2**

The scanline overlay (`pageWrapper::before`) uses a `position: fixed` pseudo-element with a repeating gradient over the entire viewport. This creates a compositing layer that repaints on every scroll frame.

Current mitigations already in place (good):
- `pointer-events: none` prevents interaction blocking.
- `prefers-reduced-motion: reduce` media query hides the scanlines and cursor animation.

Additional recommendations:
- Add `will-change: transform` to the scanline overlay to hint the browser to promote it to its own compositing layer, reducing repaint cost.
- Consider limiting the scanline overlay to the terminal panels only (not the full page) to reduce the composited area.
- The `z-index: 1000` on the scanline overlay could interfere with modals, tooltips, or the NavBar dropdown. The NavBar uses `position: fixed` with the wrapper class. Verify that the navbar stays above the scanline -- if not, add `z-index: 1001` or higher to the nav wrapper.

### 4d. PokedexGrid Mobile Responsiveness

**Priority: P1**

Current state is decent:
- 768px: `minmax(110px, 1fr)` auto-fill grid. Works.
- 480px: Fixed 3-column grid with smaller sprites (56px). Works.

Remaining issues:
- **Filter bar overflow:** The type filter bar uses `overflow-x: auto` with horizontal scrolling, which is correct. But on phones with 18 type buttons, users may not realize it scrolls. Add a subtle gradient fade on the right edge to indicate scrollable content:
  ```css
  .filterBar::after {
    content: '';
    position: sticky;
    right: 0;
    width: 24px;
    background: linear-gradient(to right, transparent, var(--color-bg-dark));
    flex-shrink: 0;
  }
  ```
- **Search row wrapping:** On very narrow screens (<360px), the search row's flex layout may cause the result count to wrap awkwardly. Hide the result count at 360px or move it below the input.
- **Tap target size:** DexCard click targets are the full card, which is good. The type filter buttons at 480px are `font-size: 8px` with `padding: 3px 7px`, which yields touch targets below the recommended 44x44px minimum. Increase padding to at least `8px 12px` at this breakpoint.

### 4e. Typography and Spacing Consistency

**Priority: P2**

The site uses three font families inconsistently:
- `DotGothic16` -- headings, terminal chrome, pixel-art aesthetic
- `Crimson Pro` -- body text, long descriptions, editorial content
- `Courier New` -- terminal prompts, key-value lines, monospace elements

This is the right set. The inconsistency is in application:

- **Callout label font size:** Layout B uses `font-size: 7px` for `.calloutLabel`, Layout C also uses `7px`. This is too small to read on any device. Increase to `10px` minimum. The label is uppercase with letter-spacing, so 10px will still look compact.
- **Section heading size:** Both Layout B and C use `font-size: 10px` for section headings. This is correct for the terminal aesthetic but pushes the limits of readability. Keep it but ensure `letter-spacing: 0.15em` stays consistent (it does currently).
- **Body text font size:** Layout A uses `19px`, Layout B uses `19px` for body and `15px` for `.panelDesc`, Layout C uses `19px`. Good consistency on body, but the panel description in B is too small relative to the body text. Bump to `16px`.
- **Line height:** Consistently `1.8` across layouts for body text. Good. Keep it.

### 4f. Accessibility

**Priority: P1**

**Contrast issues:**
- `.kvKey` in Layout C uses `color: #00eaff` (cyan) on near-black backgrounds. WCAG AA contrast ratio: approximately 8.5:1. Passes.
- `.calloutText` uses `color: #b0b8e8` on `rgba(0, 10, 30, 0.7)` backgrounds. Approximate ratio: ~7:1. Passes AA.
- `var(--color-text-dark): #b8b8b8` on `var(--color-bg-dark): #000000`. Ratio: ~10:1. Passes.
- **Fail:** Type filter buttons in inactive state use `color: #6b7199` on `rgba(0, 5, 15, 0.6)` background. This is approximately 3.2:1 contrast. Fails WCAG AA (minimum 4.5:1 for normal text). Lighten the inactive color to `#8a90b5` or similar.

**Keyboard navigation:**
- DexCard has `tabIndex={0}` and handles Enter/Space. Good.
- DownloadCard is a `<div>` with no role, tabindex, or keyboard handler. The "View Details" `<Link>` inside it is keyboard-accessible, so the card itself doesn't need to be focusable. But the card has hover effects that suggest interactivity. Either make the entire card a `<Link>` (preferred) or add `role="article"` to clarify it is not interactive itself.
- Type filter buttons are `<button>` elements. Good -- keyboard accessible by default.

**Screen readers:**
- DexCard has `aria-expanded` and `aria-label`. Good.
- Layout C's download bar has `aria-label`. Good.
- Blog hub (when built) should use landmark regions: `<main>`, `<nav>` for filter bars, `<article>` for each post card.
- The terminal "dots" (red/yellow/green) are decorative. They should have `aria-hidden="true"` to avoid screen readers announcing three unlabeled spans.

**Reduced motion:**
- Layout C already respects `prefers-reduced-motion`. Good.
- DexCard respects it. Good.
- Layout A and Layout B do NOT have `prefers-reduced-motion` media queries. Add them to disable hover transforms and transitions.

---

## 5. Shared Component Extraction

**Priority: P2** (not blocking, but reduces future maintenance burden)

The terminal panel chrome (title bar with dots, path, body wrapper) is duplicated across:
- `BlogDetailLayoutC.jsx`
- `KantoPokedex.jsx`
- `JohtoPokedex.jsx`
- `HoennPokedex.jsx`

Extract a reusable `TerminalPanel` component:

```jsx
<TerminalPanel path="SYNTHCITY://pokedex/kanto">
  {/* children */}
</TerminalPanel>
```

This component would render the title bar with dots, the path text, and wrap children in the terminal body div. This is a straightforward extraction with no behavioral changes.

Similarly, the kv-line pattern (key :: value) appears in both Layout C and all Pokedex pages. Extract a `TerminalKVLine` component.

---

## 6. Priority Summary

| Priority | Task | Effort |
|---|---|---|
| **P0** | Build real `/blog` hub page with terminal-style listing | Medium |
| **P0** | Create `HeroPlaceholder` component for missing hero images | Small |
| **P0** | Clear gallery arrays to prevent broken image references | Trivial |
| **P1** | Rename `/catalog` route to `/downloads`, update all internal links | Small |
| **P1** | Add "Blog" link to NavBar | Small |
| **P1** | Create `blogPostData.js` data file with PokeMMO journal metadata | Small |
| **P1** | Integrate PokeMMO blog post HTML as a React component at `/blog/pokemmo-journal-1` | Medium |
| **P1** | Fix type filter button contrast (accessibility) | Trivial |
| **P1** | Add `aria-hidden="true"` to terminal dot spans | Trivial |
| **P1** | Fix PokedexGrid filter bar scroll affordance on mobile | Small |
| **P1** | Add disabled "Coming Soon" state for placeholder download buttons | Small |
| **P2** | Layout B mobile fixes (panel overlap, sidebar order) | Small |
| **P2** | Layout C scanline performance optimization | Small |
| **P2** | Extract `TerminalPanel` shared component | Medium |
| **P2** | Add `prefers-reduced-motion` to Layouts A and B | Trivial |
| **P2** | Typography fixes (callout label size, panel desc size) | Trivial |
| **P2** | Make DownloadCard a full-card `<Link>` for better UX | Small |

---

## 7. File Inventory

Files that will be **created:**
- `src/data/blogPostData.js`
- `src/components/common/TerminalPanel.jsx` (+ `.module.css`)
- `src/components/common/HeroPlaceholder.jsx` (+ `.module.css`)

Files that will be **heavily modified:**
- `src/pages/Blog.jsx` (complete rewrite)
- `src/App.js` (route changes)
- `src/components/common/NavBar.js` (add Blog link)

Files that will be **lightly modified:**
- `src/data/catalogDetailData.js` (clear gallery arrays, add `downloadAvailable` flags)
- `src/components/blog/BlogDetailLayoutA.jsx` (hero placeholder fallback)
- `src/components/blog/BlogDetailLayoutB.jsx` (hero placeholder fallback, mobile fixes)
- `src/components/blog/BlogDetailLayoutC.jsx` (hero placeholder fallback)
- `src/components/catalog/DownloadCard.jsx` (full-card link)
- `src/components/blog/PokedexGrid.module.css` (filter bar scroll affordance, contrast fix)
- `src/components/blog/DexCard.module.css` (filter button touch target size)
- `src/components/blog/BlogDetailLayoutA.module.css` (reduced motion)
- `src/components/blog/BlogDetailLayoutB.module.css` (reduced motion, mobile sidebar order)

Files that will be **deleted:**
- `src/components/portfolio/BlogPage.js` (replaced by new Blog.jsx)
