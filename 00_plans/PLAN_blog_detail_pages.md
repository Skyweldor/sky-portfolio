# Implementation Plan: Blog Detail Pages for Catalog Items

## Context

The Catalog page (`/catalog`) displays 8 download cards (demos, tools, assets, docs), but clicking a card's "Download" button leads nowhere (`href="#"`). We want each card to link to a **dedicated blog-style detail page** that gives the item a proper write-up — screenshots, feature breakdowns, changelogs, and an actual download CTA.

The existing `/blog` route is a light-background placeholder with hardcoded posts. It will be replaced or repurposed as part of this work.

This plan presents **three visual iterations** of the blog detail page so the team can compare and pick a direction (or mix-and-match elements).

---

## Shared Architecture (All Iterations)

Before diving into visual variants, this section covers the routing, data, and component structure that all three iterations share.

### Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/catalog` | `Catalog.jsx` | Existing card listing (unchanged) |
| `/catalog/:id` | `BlogDetail.jsx` | New detail page for a single item |

- Use React Router's `useParams()` to read `:id`
- Look up the matching item from an extended data source
- 404 fallback if `id` doesn't match any item

### Data Layer — Extended Catalog Data

Extend `catalogData.js` (or create a companion `catalogDetailData.js`) with per-item detail fields:

```js
{
  // --- existing fields ---
  id: 'aetherbound-demo',
  title: 'Aetherbound Demo Build',
  description: '...',
  tags: ['React', 'Browser', 'RPG', 'Demo'],
  fileSize: '12 MB',
  downloadUrl: '#',
  type: 'demo',

  // --- new detail fields ---
  heroImage: '/assets/blog/aetherbound-hero.jpg',
  gallery: [
    '/assets/blog/aetherbound-1.jpg',
    '/assets/blog/aetherbound-2.jpg',
  ],
  longDescription: 'Multiple paragraphs of markdown or JSX content...',
  features: [
    'Creature capture & training system',
    'Rusted Junkyard explorable zone',
    'Turn-based combat prototype',
  ],
  changelog: [
    { version: '0.3.0', date: '2026-02-15', notes: 'Added ProtoMeda encounter' },
    { version: '0.2.0', date: '2026-01-10', notes: 'Combat system overhaul' },
  ],
  systemRequirements: 'Modern browser with WebGL support',
  author: 'Sky',
  publishDate: '2026-03-01',
  relatedItems: ['synthcity-asset-pack', 'camp-carapace-demo'],
}
```

### Card Link Update

In `DownloadCard.jsx`, the existing download button will become a `<Link to={/catalog/${item.id}}>` (React Router), navigating to the detail page instead of triggering a download. The actual download action moves to the detail page itself.

### Shared Layout Shell

All iterations share:
- `NavBar` at top (existing)
- Dark background matching site theme (`var(--color-bg-dark)`)
- A "Back to Downloads" breadcrumb/link at the top of the content area
- Footer omitted (consistent with current Catalog page)

---

## Iteration A: "Neon Longform" — Editorial Blog Layout

### Design Philosophy
Clean, vertical, scroll-driven reading experience. Feels like a polished dev blog post. Emphasis on the written content with supporting visuals.

### Layout (top to bottom)

```
┌──────────────────────────────────────────────┐
│  NavBar                                      │
├──────────────────────────────────────────────┤
│  ← Back to Downloads                         │
├──────────────────────────────────────────────┤
│                                              │
│  [Type Badge: DEMO]        March 1, 2026     │
│                                              │
│  Aetherbound Demo Build                      │
│  ─────────────────────────                   │
│  Short tagline / description                 │
│                                              │
│  [Tag] [Tag] [Tag] [Tag]                     │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │          Hero Image (16:9)           │    │
│  │       max-width: 800px, centered     │    │
│  └──────────────────────────────────────┘    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  Long-form description text                  │
│  (max-width: 680px, centered, comfortable    │
│   reading line-length)                       │
│                                              │
│  Paragraph 1...                              │
│  Paragraph 2...                              │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  Features                                    │
│  ─────────                                   │
│  • Creature capture & training system        │
│  • Rusted Junkyard explorable zone           │
│  • Turn-based combat prototype               │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  Changelog                                   │
│  ─────────                                   │
│  v0.3.0 — Feb 15, 2026                       │
│    Added ProtoMeda encounter                 │
│  v0.2.0 — Jan 10, 2026                       │
│    Combat system overhaul                    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────┐      │
│  │  Download CTA Box (glass panel)    │      │
│  │  [Icon]  12 MB  [⬇ Download Now]  │      │
│  │  System requirements note          │      │
│  └────────────────────────────────────┘      │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  Related Items                               │
│  ─────────────                               │
│  [MiniCard] [MiniCard]                       │
│                                              │
└──────────────────────────────────────────────┘
```

### Styling Notes
- **Typography:** DotGothic16 for headings, Centra for body text. Body text at `clamp(0.95rem, 1.5vw, 1.1rem)` with `line-height: 1.7` for readability.
- **Hero image:** Rounded corners (8px), subtle cyan `box-shadow` glow on hover.
- **Section dividers:** Thin `1px` lines using `rgba(0, 234, 255, 0.15)` — same neon cyan at low opacity.
- **Changelog:** Styled as a vertical timeline with small cyan dots on the left edge.
- **Download CTA:** Glass-panel box (`rgba(0, 10, 30, 0.6)`, `backdrop-filter: blur(12px)`), centered, with the neon download button matching the existing card style.
- **Related items:** Compact horizontal cards reusing `DownloadCard` at a smaller scale.

### Pros
- Familiar blog pattern — users know how to read it
- Great for content-heavy items (docs, guides, toolkits)
- Easy to implement — mostly typography and spacing
- SEO-friendly with clean heading hierarchy

### Cons
- Can feel long/empty for items with sparse content
- No visual "wow factor" compared to a portfolio showcase
- Gallery images require scrolling past text to reach

---

## Iteration B: "Neon Showcase" — Hero-Driven Visual Layout

### Design Philosophy
Full-bleed hero image with a floating info panel. Feels like a product landing page or game store listing. Emphasis on visuals and at-a-glance info.

### Layout (top to bottom)

```
┌──────────────────────────────────────────────┐
│  NavBar                                      │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │                                      │    │
│  │     Full-Width Hero Image            │    │
│  │     (100vw, max-height: 50vh)        │    │
│  │     gradient fade to black at bottom │    │
│  │                                      │    │
│  │  ← Back to Downloads                 │    │
│  │                                      │    │
│  │  ┌─────────────────────────────┐     │    │
│  │  │  Floating Info Panel        │     │    │
│  │  │  (overlaps hero by ~60px)   │     │    │
│  │  │                             │     │    │
│  │  │  [DEMO]                     │     │    │
│  │  │  Aetherbound Demo Build     │     │    │
│  │  │  Short description          │     │    │
│  │  │  [Tag] [Tag] [Tag]          │     │    │
│  │  │                             │     │    │
│  │  │  12 MB  [⬇ Download Now]   │     │    │
│  │  └─────────────────────────────┘     │    │
│  └──────────────────────────────────────┘    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  ┌───────────────┐  ┌───────────────────┐    │
│  │               │  │                   │    │
│  │  About        │  │  Details Sidebar  │    │
│  │  (long desc)  │  │  ─────────────    │    │
│  │               │  │  Author: Sky      │    │
│  │               │  │  Size: 12 MB      │    │
│  │               │  │  Type: Demo       │    │
│  │               │  │  Published: ...   │    │
│  │               │  │  Requirements:... │    │
│  │               │  │                   │    │
│  └───────────────┘  └───────────────────┘    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  Screenshot Gallery (horizontal scroll)      │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐            │
│  │     │ │     │ │     │ │     │            │
│  │     │ │     │ │     │ │     │            │
│  └─────┘ └─────┘ └─────┘ └─────┘            │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  Features              │  Changelog          │
│  ────────              │  ─────────          │
│  • Feature 1           │  v0.3.0 — ...      │
│  • Feature 2           │  v0.2.0 — ...      │
│  • Feature 3           │                     │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  You might also like                         │
│  [MiniCard] [MiniCard]                       │
│                                              │
└──────────────────────────────────────────────┘
```

### Styling Notes
- **Hero:** Full-width image with `linear-gradient(transparent 50%, var(--color-bg-dark) 100%)` overlay at the bottom edge so it bleeds into the dark background.
- **Floating panel:** `position: relative; margin-top: -60px; z-index: 2`. Glass morphism: `background: rgba(0, 10, 30, 0.85)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(0, 234, 255, 0.2)`. Max-width: 700px, centered.
- **Two-column section:** CSS Grid `grid-template-columns: 1fr 280px` at desktop, collapses to single column on mobile.
- **Gallery:** Horizontal scrollable row with `overflow-x: auto`, `scroll-snap-type: x mandatory`. Each thumbnail: 200x130px with rounded corners and cyan border on hover. Optional: click to open a lightbox overlay.
- **Features + Changelog:** Side-by-side columns at desktop, stacked on mobile. Features as bullet list, changelog as compact timeline.

### Pros
- Strong visual impact — feels like a real product page
- Download CTA is immediately visible (no scrolling needed)
- Gallery encourages exploration without leaving the page
- Two-column layout efficiently uses screen real estate

### Cons
- Requires hero images for every item (content dependency)
- More complex responsive behavior (hero overlap, two-column collapse)
- May feel overly "heavy" for simple items like PDF docs

---

## Iteration C: "Neon Terminal" — Dev-Log / Retro-Tech Layout

### Design Philosophy
Leans into the cyberpunk/hacker aesthetic. Content presented in a terminal-like panel with monospace accents, scanline effects, and a command-line feel. Unique to the SynthCity brand.

### Layout (top to bottom)

```
┌──────────────────────────────────────────────┐
│  NavBar                                      │
├──────────────────────────────────────────────┤
│  ← Back to Downloads                         │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ ● ● ●  SYNTHCITY://catalog/aether.. │    │
│  ├──────────────────────────────────────┤    │
│  │                                      │    │
│  │  > ITEM.type     :: DEMO             │    │
│  │  > ITEM.title    :: Aetherbound      │    │
│  │  >                  Demo Build       │    │
│  │  > ITEM.author   :: Sky              │    │
│  │  > ITEM.date     :: 2026-03-01       │    │
│  │  > ITEM.size     :: 12 MB            │    │
│  │  > ITEM.tags     :: [React]          │    │
│  │  >                  [Browser]        │    │
│  │  >                  [RPG] [Demo]     │    │
│  │  >                                   │    │
│  │  > STATUS         :: AVAILABLE       │    │
│  │  > [█████████████████████ DOWNLOAD]  │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  // PREVIEW                          │    │
│  │  ┌────────────────────────────┐      │    │
│  │  │      Hero Image            │      │    │
│  │  │   (scanline CSS overlay)   │      │    │
│  │  └────────────────────────────┘      │    │
│  │                                      │    │
│  │  // DESCRIPTION                      │    │
│  │  > Playable demo of the creature-    │    │
│  │    battling RPG. Explore the Rusted  │    │
│  │    Junkyard, capture ProtoMeda...    │    │
│  │                                      │    │
│  │  // FEATURES                         │    │
│  │  [01] Creature capture & training    │    │
│  │  [02] Rusted Junkyard zone           │    │
│  │  [03] Turn-based combat prototype    │    │
│  │                                      │    │
│  │  // CHANGELOG                        │    │
│  │  ┌──────────────────────────────┐    │    │
│  │  │ v0.3.0 | 2026-02-15         │    │    │
│  │  │ > Added ProtoMeda encounter  │    │    │
│  │  ├──────────────────────────────┤    │    │
│  │  │ v0.2.0 | 2026-01-10         │    │    │
│  │  │ > Combat system overhaul     │    │    │
│  │  └──────────────────────────────┘    │    │
│  │                                      │    │
│  │  // SYSTEM REQUIREMENTS              │    │
│  │  > Modern browser with WebGL         │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  // RELATED_ITEMS                            │
│  [MiniCard] [MiniCard]                       │
│                                              │
└──────────────────────────────────────────────┘
```

### Styling Notes
- **Terminal window:** Dark panel with a fake title bar (three colored dots + path). `background: rgba(0, 5, 15, 0.9)`, `border: 1px solid rgba(0, 234, 255, 0.3)`, `border-radius: 8px`.
- **Monospace accents:** Use `'Courier New', monospace` for labels and metadata keys. Body text stays in Centra for readability. Section headers (`// FEATURES`) use DotGothic16.
- **Scanline overlay on images:** CSS pseudo-element with repeating `linear-gradient(transparent 50%, rgba(0, 0, 0, 0.03) 50%)` at `background-size: 100% 4px`.
- **Download button:** Styled as a terminal progress bar — full-width, filled bar with `[████████████████ DOWNLOAD]` text. On hover, bar pulses with a glow animation.
- **Numbered features:** `[01]`, `[02]`, etc. in cyan monospace, followed by the feature text.
- **Changelog:** Nested bordered boxes, one per version, stacked vertically.
- **Typing cursor:** Optional blinking `█` cursor after the last line of the header block, purely decorative.

### Pros
- Extremely on-brand for SynthCity's cyberpunk identity
- Memorable and distinctive — visitors will remember it
- Works well even without hero images (the terminal layout carries the visual)
- Fun to build and iterate on

### Cons
- Readability trade-off — monospace/terminal aesthetic can feel dense
- May confuse non-technical visitors
- Scanline effects need `prefers-reduced-motion` handling
- Most complex CSS of the three iterations

---

## Comparison Matrix

| Criteria | A: Neon Longform | B: Neon Showcase | C: Neon Terminal |
|----------|-----------------|-----------------|-----------------|
| **Visual impact** | Medium | High | High |
| **Content-heavy items** | Best | Good | Good |
| **Image-light items** | Good | Weak (needs hero) | Best |
| **Brand alignment** | Good | Good | Strongest |
| **Accessibility** | Best | Good | Needs care |
| **Implementation effort** | Low | Medium | Medium-High |
| **Mobile friendliness** | Easy | Moderate | Easy |
| **Unique / memorable** | Low | Medium | Highest |

---

## Recommended Implementation Order

### Phase 1 — Shared Foundation (all iterations need this)
1. **Extend data layer** — add detail fields to `catalogData.js` (or create `catalogDetailData.js`)
2. **Add route** — `/catalog/:id` in `App.js` pointing to a new `BlogDetail.jsx` page
3. **Update DownloadCard** — change the download button to a `<Link>` to `/catalog/${item.id}`
4. **Create BlogDetail.jsx shell** — `useParams()` lookup, 404 handling, NavBar, back-link, theme wrapper
5. **Placeholder assets** — create `/public/assets/blog/` with placeholder hero images (can use colored gradient placeholders initially)

### Phase 2 — Build One Iteration
Pick one iteration to build first as the working prototype. Recommended starting point: **Iteration A** (lowest effort, establishes content structure that B and C build on).

### Phase 3 — Build Remaining Iterations
Build the other two as alternate layout components (e.g., `BlogDetailLayoutA.jsx`, `BlogDetailLayoutB.jsx`, `BlogDetailLayoutC.jsx`). The parent `BlogDetail.jsx` can toggle between them via a query param (`?layout=a`) or a dev-mode toggle for the team to compare.

### Phase 4 — Team Review & Decision
Team reviews all three and picks a direction (or hybrid). Remove the unused layouts and finalize.

---

## New Files (Estimated)

| File | Purpose |
|------|---------|
| `src/pages/BlogDetail.jsx` | Detail page shell (route param lookup, layout switch) |
| `src/components/blog/BlogDetailLayoutA.jsx` | Iteration A: Neon Longform |
| `src/components/blog/BlogDetailLayoutA.module.css` | Styles for Iteration A |
| `src/components/blog/BlogDetailLayoutB.jsx` | Iteration B: Neon Showcase |
| `src/components/blog/BlogDetailLayoutB.module.css` | Styles for Iteration B |
| `src/components/blog/BlogDetailLayoutC.jsx` | Iteration C: Neon Terminal |
| `src/components/blog/BlogDetailLayoutC.module.css` | Styles for Iteration C |
| `src/components/blog/ImageGallery.jsx` | Shared horizontal-scroll gallery (used by B and C) |
| `src/components/blog/RelatedItems.jsx` | Shared "You might also like" section |
| `src/data/catalogDetailData.js` | Extended per-item detail content |
| `public/assets/blog/` | Hero images and screenshots (placeholder initially) |

## Modified Files

| File | Change |
|------|--------|
| `src/App.js` | Add `/catalog/:id` route |
| `src/components/catalog/DownloadCard.jsx` | Button → `<Link>` to detail page |
| `src/data/catalogData.js` | Add `slug` field or keep using `id` for URL matching |

---

## Open Questions for the Team

1. **Naming:** Should the section stay as "Downloads" or rebrand to something like "Dev Log", "Lab Notes", "Archive", or "Releases"?
2. **Content depth:** How much written content will each item realistically have? (This influences whether A or B/C is the better fit.)
3. **Hero images:** Do we have screenshots/art for all 8 items, or should we design for graceful absence?
4. **Download behavior:** Should the actual download happen inline (browser download) or link to an external source (GitHub releases, itch.io, etc.)?
5. **Future growth:** Will new blog posts be added frequently, or is this mostly a static showcase? (Affects whether we need a CMS/markdown pipeline later.)
