# 02 — Mobile Responsiveness Audit & Fix Plan

**Created:** 2026-03-28
**Scope:** Globe Landing Page, Catalog/Downloads, Blog Landing, Blog Detail, PokeMMO Journal, Pokedex Pages
**Goal:** Ensure all pages beyond the landing page are fully usable on devices from 320px–768px wide.

---

## Current State Summary

The globe landing page itself is in decent shape — time was invested there. But many of the downstream pages have **inconsistent breakpoints**, **hardcoded pixel values**, and **missing media queries** for small phones. The common pattern: a single `max-width: 768px` query exists, but nothing below 480px, and nothing for ultra-narrow devices (320px).

---

## Issues by Page

### 1. Globe Landing (`GlobeLanding.css`)

| Issue | Location | Severity |
|-------|----------|----------|
| ~~`width: 100vw`~~ — Not an issue. Container is `position: fixed` + `overflow: hidden`, so no scrollbar conflict. | Line ~14 | None |
| PDA loading spinner hardcoded at `120px × 120px` with `padding: 40px` — oversized on small phones | Lines ~164-204 | Low |
| Progress bar wrapper `width: 300px` — needs tighter `max-width` on narrow viewports | Line ~289 | Low |
| No mobile-specific media queries for the loading overlay | — | Low |

**Verdict:** Mostly solid. The `100vw` fix is the main thing; loading overlay is cosmetic polish.

---

### 2. Catalog / Downloads (`Catalog.jsx`, `DownloadCard.module.css`)

| Issue | Location | Severity |
|-------|----------|----------|
| Card layout switches to column at 768px — good, but no further optimization below 480px | Lines ~152-179 | Medium |
| `.iconArea` fixed at `60px × 60px` — oversized relative to content on small phones | Line ~23-27 | Low |
| Padding only reduces by 4px on mobile (`20px → 16px`) | Line ~156 | Low |

**Verdict:** Functional on mobile. Minor polish needed.

---

### 3. Blog Landing (`Blog.module.css`)

| Issue | Location | Severity |
|-------|----------|----------|
| Table header grid uses `1fr 100px 100px` — fixed columns can overflow below 400px | Line ~142-147 | High |
| Table row cells with `padding: 10px 8px` may produce touch targets under 44px | — | Medium |
| Two breakpoints exist (768px, 480px) — decent coverage | Lines ~294, ~351 | — |

**Verdict:** The table layout is the main risk. On phones < 400px, those fixed 100px columns eat half the viewport.

---

### 4. Blog Detail Layouts (`BlogDetailLayoutA/B/C.module.css`)

| Issue | Location | Severity |
|-------|----------|----------|
| `.kvLine` has `min-width: 150px` — should shrink further on mobile | LayoutC Line ~129 | Medium |
| Two breakpoints (768px, 480px) exist — good | — | — |
| Flex layout on `.kvLine` could break without explicit `flex-wrap` on ultra-narrow | — | Low |

**Verdict:** Reasonably responsive. The `min-width` on key-value lines is the main tweak.

---

### 5. PokeMMO Journal (`PokeMMOJournal.module.css`)

| Issue | Location | Severity |
|-------|----------|----------|
| Only ONE media query at `max-width: 500px` — needs 768px and 480px breakpoints | Line ~355 | High |
| `.teamGrid` switches to `1fr 1fr` but has no single-column fallback for < 320px | Line ~361 | High |
| Battle log font size is `8px` — effectively unreadable on mobile | Line ~203 | High |
| Wrapper padding `60px 24px 100px` — top/bottom padding excessive on phones | Line ~50-54 | Medium |

**Verdict:** Weakest mobile experience of the bunch. Needs the most work.

---

### 6. PokeMMO Journal 2 / Team Showcase

| Issue | Location | Severity |
|-------|----------|----------|
| Inherits Journal 1 issues if sharing styles | — | High |
| `TeamRosterCard` has two breakpoints (768px, 480px) — good | Lines ~298, ~329 | — |
| `.detailInner` `max-height: 380px` constrains content on short phones | Line ~160 | Medium |

**Verdict:** TeamRosterCard itself is well-handled. Check if Journal 2 page wrapper shares Journal 1's gaps.

---

### 7. Pokedex Pages (`PokedexGrid.module.css`, `DexCard.module.css`)

| Issue | Location | Severity |
|-------|----------|----------|
| Grid uses `auto-fill, minmax(200px, 1fr)` — only 1 card fits at 320px | PokedexGrid ~108 | Low |
| DexCard `.flank` hardcoded at `24px` (18px on mobile) — fixed width wastes space | DexCard ~41 | Low |
| Filter bar has `overflow-x: auto` — good horizontal scroll handling | PokedexGrid ~11 | — |
| Three breakpoints (768px, 480px, and grid's `auto-fill`) — good coverage | — | — |

**Verdict:** Best mobile coverage of the group. Minor tweaks only.

---

### 8. Cross-Cutting: Shared Components

#### NavBar (`navbar.css` / `NavBar.module.css`)
- Padding `18px 40px` is excessive on mobile — should drop to `12px 16px` below 480px
- `.navRight` `min-width: 140px` could crowd content on phones < 400px
- Has breakpoints at 1199px and 768px — missing a 480px tier

#### PageTransition (`PageTransition.jsx`)
- All styles are inline with hardcoded `px` values
- `fontSize: '14px'`, `padding: '40px'` — no responsive adjustments at all
- On phones, the transition overlay content is oversized

#### GlobeMobileMenu (`GlobeMobileMenu.module.css`)
- Panel width `280px` with `max-width: 85vw` — on 320px phones, 85vw = 272px, leaving ~48px visible
- Only one breakpoint at `max-width: 600px`
- Hamburger button positioning and size (44px) is correct

---

## Implementation Plan

### Phase 1 — High-Priority Fixes (Functional breakage)

1. **PokeMMO Journal mobile overhaul**
   - Add `max-width: 768px` breakpoint (reduce wrapper padding, scale headings)
   - Add `max-width: 480px` breakpoint (single-column `.teamGrid`, reduce spacing)
   - Fix battle log font size: `8px` → `clamp(10px, 2.5vw, 12px)`
   - Add `1fr` fallback for `.teamGrid` below 360px

2. **Blog Landing table overflow**
   - Replace fixed `100px` grid columns with `minmax(60px, 100px)` or switch to stacked layout below 480px
   - Increase touch target padding on table rows

3. ~~**Globe Landing `100vw` fix**~~ — Removed. Container uses `position: fixed` + `overflow: hidden`, so `100vw` is correct and intentional.

### Phase 2 — Medium-Priority Fixes (UX polish)

4. **NavBar mobile tightening**
   - Add `max-width: 480px` breakpoint: reduce padding to `12px 16px`, relax `.navRight` min-width

5. **PageTransition responsive pass**
   - Add media-query-aware inline styles or move to CSS module
   - Reduce padding and font size on mobile

6. **Blog Detail `kvLine` adjustment**
   - Reduce `min-width` from `150px` to `100px` on mobile
   - Ensure `flex-wrap: wrap` is explicit

7. **DownloadCard small-phone pass**
   - Add `max-width: 480px` breakpoint for tighter padding and smaller icon area

### Phase 3 — Low-Priority Polish

8. **GlobeMobileMenu panel width** — use `min(280px, 85vw)` for safer small-phone handling
9. **Globe loading overlay** — scale spinner and padding below 480px
10. **DexCard flank** — make width flexible or reduce further on mobile
11. **Standardize breakpoints** across all components to a consistent set: `768px`, `480px`, `360px`

---

## Breakpoint Strategy

Adopt a consistent set across the project:

| Breakpoint | Target |
|------------|--------|
| `max-width: 768px` | Tablets / landscape phones |
| `max-width: 480px` | Standard phones |
| `max-width: 360px` | Ultra-narrow / older phones |

Currently, breakpoints are scattered (`500px`, `600px`, `768px`, `1199px`). Standardizing prevents coverage gaps.

---

## Notes

- The globe landing page and Pokedex pages are in the best shape — prior work paid off there.
- PokeMMO Journal is the top priority since it has the most gaps.
- Blog table layout is a close second — fixed column widths on a data table are a classic mobile pitfall.
- All fixes should be CSS-only where possible to avoid React re-render churn.
