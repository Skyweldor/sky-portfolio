# Implementation Plan: Game Dev Subsite — Nav UX & Downloads Page

## Context

The Game Development subsite (`/portfolio`) has three UX issues:
1. **No way to return to the globe landing page** except the browser back button — no visible "home" affordance
2. **Hash-based nav links** (`#skills`, `#projects`) pollute browser history and break when used from other pages like `/catalog`
3. **Downloads page is empty** — just a "Coming Soon" placeholder

This plan addresses all three with minimal disruption to the existing architecture.

---

## Task 1: Globe Button + Nav Restructure

### What changes
- Add a **tiny animated Three.js wireframe globe** (36x36px canvas) to the LEFT of the NavLogo — clicking it navigates to `/`
- **Remove the "Home" link** (redundant with the globe button)
- **Move Skills and Projects** from the absolutely-centered `.navCenter` into the `.brandLeft` group, creating a left-aligned layout:
  `[Globe] [SynthCity DigiLabs Interactive] [Skills] [Projects]`
- Downloads CTA stays on the right
- The globe is **always visible**; the NavLogo retains its scroll-based fade-in at 200px

### New files
| File | Purpose |
|------|---------|
| `src/components/common/NavGlobe.js` | Lightweight Three.js mini globe component |
| `src/components/common/NavGlobe.module.css` | Wrapper styles, hover glow, border-radius |

### NavGlobe component design
- `useRef` canvas, imperative Three.js scene in `useEffect`
- `WebGLRenderer({ alpha: true, antialias: true })` — transparent background
- Single `SphereGeometry(1, 16, 16)` with `MeshBasicMaterial({ color: 0x00ddff, wireframe: true, opacity: 0.7 })`
- Auto-rotation: `mesh.rotation.y -= 0.003` per frame
- No bloom, no particles, no post-processing — keep it light
- Cleanup: `renderer.dispose()`, `cancelAnimationFrame`, geometry/material disposal
- Wrapped in `<div onClick={navigate('/')}>`  with `role="button"`, `aria-label`, `tabIndex={0}`

### NavBar.js modifications (`src/components/common/NavBar.js`)
- Import `NavGlobe` and `useScrollToSection` (from Task 2)
- Replace `Navbar.Brand href="#home"` with a plain `<div>` (use `Navbar.Brand as="div"`)
- Left section now contains: `NavGlobe` → `NavLogo` → Skills button → Projects button
- Center section: only renders in game mode (Inventory/Town/Training)
- Right section: unchanged (Downloads CTA)

### NavBar.module.css modifications (`src/components/common/NavBar.module.css`)
- `.brandLeft`: change from `flex: 0 0 auto; min-width: 140px` to `flex: 0 1 auto; display: flex; align-items: center; gap: 12px`
- `.glowLink`: add `background: none; border: none; cursor: pointer; padding: 8px 12px` for `<button>` elements
- Add `.desktopOnlyLinks` (visible >=1200px) and `.mobileOnlyLinks` (visible <1200px) for responsive link placement
- Mobile (<1200px): Skills/Projects hide from inline brand area, appear inside `Navbar.Collapse`

---

## Task 2: Fix Hash-Based Navigation

### What changes
- Replace `href="#skills"` / `href="#projects"` with `onClick` handlers using `scrollIntoView({ behavior: 'smooth' })`
- No more hash entries in browser history — back button works as expected
- When on a different page (e.g., `/catalog`), clicking Skills or Projects navigates to `/portfolio` and scrolls to the target section after mount

### New file
| File | Purpose |
|------|---------|
| `src/hooks/useScrollToSection.js` | Custom hook for cross-page section navigation |

### Hook logic
```js
const scrollToSection = useCallback((sectionId) => {
  if (location.pathname === '/portfolio') {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    navigate('/portfolio', { state: { scrollTo: sectionId } });
  }
}, [location.pathname, navigate]);
```
- Uses React Router `navigate` with `state` instead of URL hashes
- The existing `scroll-padding-top: 75px` in `global.css:90` handles the fixed-navbar offset

### Homepage.js modifications (`src/components/portfolio/Homepage.js`)
- Add `useEffect` that checks `location.state?.scrollTo` on mount
- Scrolls to the target section with a short delay (100ms) to allow lazy-loaded content to render
- Calls `window.history.replaceState({}, document.title)` after scrolling to prevent re-trigger on back/forward

---

## Task 3: Populate Downloads Page

### What changes
- Replace the "Coming Soon" placeholder with **sample horizontal download cards**
- Each card: icon/thumbnail (left) → title, description, tags (center) → file size + download button (right)
- Cards stack vertically on mobile

### New files
| File | Purpose |
|------|---------|
| `src/components/catalog/DownloadCard.jsx` | Horizontal download card component |
| `src/components/catalog/DownloadCard.module.css` | Card styles (dark panel, neon glow, tags) |
| `src/data/catalogData.js` | Sample card data array |

### Card design
- Dark glass background: `rgba(0, 10, 30, 0.6)`, subtle cyan border
- DotGothic16 title with text-shadow glow, Centra description
- Tags as small pills with purple accent background
- Download button matches existing `.ctaButton` neon style
- Hover: border brightens, subtle box-shadow bloom, translateY(-2px)
- Icons via `react-bootstrap-icons` (already a dependency): `Controller`, `Archive`, `Tools`, `FileEarmarkPdf`

### Sample data (8 items, mixed resource types)
| Title | Type | Tags |
|-------|------|------|
| Aetherbound Demo Build | demo | React, Browser, RPG, Demo |
| Sky's Scared Horror Toolkit | tool | Roblox, Lua, Horror, Engine |
| SynthCity Neon Asset Pack | asset | Unity, Unreal, 3D Assets, Cyberpunk |
| Camp Carapace — Found Footage Demo | demo | Unreal, Windows, Horror, Demo |
| VrBrowserLab Documentation | docs | WebXR, Docs, PDF, React Three Fiber |
| Robo-Battler Dev Tools | tool | Unity, Windows, Mac, Modding |
| Sticker Design Templates | asset | Photoshop, SVG, Print, Templates |
| LanguageLink Curriculum Guide | docs | Unity, Education, PDF, Guide |

### Catalog.jsx modifications (`src/pages/Catalog.jsx`)
- Import `DownloadCard` and `CATALOG_ITEMS`
- Map over data array rendering cards inside a `maxWidth: 900px` container

---

## Implementation Order & Progress

1. ~~**Task 2** (hash navigation fix)~~ — **DONE**
   - Created `src/hooks/useScrollToSection.js`
   - Replaced hash `href="#..."` links with `onClick` + `scrollIntoView` in NavBar.js
   - Added `useEffect` scroll receiver in Homepage.js with `location.state?.scrollTo`
   - Removed "Home" link; NavBar restructured with globe + left-aligned layout in same pass
2. ~~**Task 1** (globe button + nav restructure)~~ — **DONE**
   - NavBar.js layout restructured (completed with Task 2)
   - Created `NavGlobe.js` — Three.js wireframe sphere + equatorial ring, 36px canvas, auto-rotate
   - Created `NavGlobe.module.css` — hover glow, focus-visible outline, reduced-motion support
   - Updated `NavBar.module.css` — left-aligned `.brandLeft` flexbox, `.desktopOnlyLinks`/`.mobileOnlyLinks`, `.glowLink` button reset
3. ~~**Task 3** (downloads cards)~~ — **DONE**
   - Created `src/components/catalog/DownloadCard.jsx` — type-based icon colors (demo/asset/tool/docs)
   - Created `src/components/catalog/DownloadCard.module.css` — horizontal card layout, neon glow, mobile stacking
   - Created `src/data/catalogData.js` — 8 sample items (2 demos, 2 assets, 2 tools, 2 docs)
   - Updated `src/pages/Catalog.jsx` to render card list

**Build verified:** `react-scripts build` succeeds with zero errors.

---

## All Files Touched

**New (6):**
- `src/components/common/NavGlobe.js`
- `src/components/common/NavGlobe.module.css`
- `src/hooks/useScrollToSection.js`
- `src/components/catalog/DownloadCard.jsx`
- `src/components/catalog/DownloadCard.module.css`
- `src/data/catalogData.js`

**Modified (4):**
- `src/components/common/NavBar.js`
- `src/components/common/NavBar.module.css`
- `src/components/portfolio/Homepage.js`
- `src/pages/Catalog.jsx`

---

## Verification

- [ ] **Globe button**: Visible at all times in the navbar. Spinning wireframe globe. Clicking it from `/portfolio` or `/catalog` navigates to `/` (globe landing).
- [ ] **Nav links on `/portfolio`**: Clicking Skills scrolls smoothly to the skills section. Clicking Projects scrolls to projects. Browser back button returns to `/` (not cycling through hash states).
- [ ] **Nav links on `/catalog`**: Clicking Skills navigates to `/portfolio` and auto-scrolls to the skills section.
- [ ] **Downloads page**: `/catalog` shows 8 styled download cards with icons, tags, and download buttons. Cards stack vertically on mobile.
- [ ] **Mobile**: Globe shows next to brand. Skills/Projects appear in hamburger menu. Download cards are touch-friendly with full-width buttons.

---

## Rollback Plan
If any task causes regressions:
1. Revert NavBar.js and NavBar.module.css to restore the original 3-column layout with hash links
2. Remove NavGlobe component and useScrollToSection hook
3. Restore Catalog.jsx placeholder content
