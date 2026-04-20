# 04 — Makeup E-Commerce Site: Session Handoff

**Date:** 2026-03-30
**Status:** 3D gold title tails bug **RESOLVED** — depth slider functional, geometry correct
**Files (3D title):**
- `src/components/beautyCare/GoldTitle.jsx` — React component (current implementation)
- `src/components/beautyCare/css/GoldTitle.css` — styles + debug panel
- `src/components/beautyCare/HeroSection.jsx` — integration point
- `00_plans/makeup-ecommerce/elevated-gold-hero.html` — **new reference prototype** (target visual)
- `00_plans/makeup-ecommerce/dark-gold-3d.html` — original vanilla prototype

---

## Part A: 3D Gold Title

### What Works Now

1. **Tails bug resolved.** Root cause: `TextGeometry` in Three.js r160 silently ignored the `depth` parameter and always used its default of 50. Console logging proved the bounding box Z was always -25 → +25 regardless of depth value. Fix: bypassed `TextGeometry` entirely and use `font.generateShapes()` + `THREE.ExtrudeGeometry` directly, which correctly respects the `depth` option.

2. **Environment map**: `RoomEnvironment` from Three.js examples reliably generates PMREM specular reflections.

3. **Compositing**: Opaque renderer (`alpha: false`) with `scene.background = 0x000000` + CSS `mix-blend-mode: screen` on `.gold-title-canvas canvas`. Black becomes transparent, gold highlights composite additively over the hero.

4. **Debug panel** (toggled with backtick):
   - **Material**: Base color (3 presets), Finish/roughness (3 presets), Env exposure+intensity (3 presets)
   - **Geometry**: Scale, Camera Z, Text Size, Depth — all live. Size/Depth regenerate geometry via `buildTextGeo()`.
   - **Diagnostics**: Wireframe, Flat Red (MeshBasicMaterial), Bevel toggle, Front-only toggle

5. **StrictMode safety**: `init()` clears stale canvases from the container before appending a new one.

---

### Key Differences: Reference Prototype vs Current Implementation

The new reference (`elevated-gold-hero.html`) is the target visual. Key differences to address in future work:

| Aspect | Reference (`elevated-gold-hero.html`) | Current (`GoldTitle.jsx`) | Impact |
|--------|---------------------------------------|---------------------------|--------|
| **Three.js version** | r128 (CDN) | r160 (npm) | API differences — `height` vs `depth`, `FontLoader` location |
| **Geometry creation** | `THREE.TextGeometry` with `height:` param | `font.generateShapes()` + `THREE.ExtrudeGeometry` with `depth:` param | Reference uses `height` (r128 name). Our ExtrudeGeometry bypass works correctly in r160. |
| **Font** | `helvetiker_bold.typeface.json` | `optimer_bold.typeface.json` | Different letterforms — helvetiker is cleaner/more modern |
| **Environment map** | **None** — relies purely on directional lights | `RoomEnvironment` PMREM + explicit `envMap` on material | Reference gets gold from strong lights alone; ours uses env reflections |
| **Light intensity** | Key: 2.5, Rim: 1.5, Ambient: 0.5 | Key: 1.5, Secondary: 0.8, Ambient: 0.3 | Reference lights are ~2x brighter |
| **Material** | `color: 0x3d2200`, no envMap, `envMapIntensity: 3.5` | `color: 0x5a3d10`, explicit envMap, `envMapIntensity: 2.0` | Reference uses darker base; intensity is for hypothetical future envMap |
| **Camera** | FOV 40, z=7 | FOV 38, z=10 | Reference is closer, slightly wider FOV |
| **Text size / depth** | size 0.8, depth 0.15 | size 0.75, depth 0.02 | Reference has more visible extrusion |
| **Bevel** | thickness 0.04, size 0.03, segments 5 | thickness 0.03, size 0.02, segments 8 | Reference bevel is slightly thicker |
| **Centering** | X/Y only via `mesh.position`, no Z centering | All 3 axes via `geometry.translate()` | Reference leaves Z untouched |
| **Rotation wrapper** | `THREE.Group` wrapping the mesh | Direct mesh rotation | Reference rotates the Group, not the mesh |
| **Mouse rotation range** | X: ±0.8 rad, Y: ±0.4 rad, lerp 0.05 | X: ±0.3 rad, Y: ±0.15 rad, lerp 0.04 | Reference has ~2.5x more dramatic rotation |
| **Container** | 500px height, absolutely positioned, `pointer-events: none` | 220px height, flow-positioned | Reference is much taller |
| **Blend mode placement** | `mix-blend-mode: screen` on the **container div** | `mix-blend-mode: screen` on the **canvas element** | Different CSS target |
| **Exposure** | 1.2 | 1.1 | Minor |
| **Depth handling** | Calls `createText()` — removes old Group, builds new one | Swaps `textMesh.geometry` in-place | Reference does full teardown/rebuild per depth change |

### Priority Alignment Actions

To match the reference visual:
1. **Boost light intensities** — key to 2.5, rim to 1.5, ambient to 0.5
2. **Switch font** to `helvetiker_bold` (or test both via debug toggle)
3. **Increase container height** to 400-500px and adjust camera closer (z=7)
4. **Widen mouse rotation range** to ±0.8 / ±0.4
5. **Increase default depth** to 0.15 for visible extrusion
6. **Test without envMap** — the reference has no environment map and the gold still reads well; our PMREM may be adding unnecessary complexity
7. **Darken base color** back to `0x3d2200` once lighting is brighter

---

### The Tails Bug: Post-Mortem

**Symptom:** Every 3D letter had a massive dark extrusion extending to a vanishing point. Changing the Depth slider had zero visual effect. The tails persisted across all debug toggles.

**Diagnosis process:**
1. Tried multiple renderer configurations (alpha vs opaque, setClearColor, mix-blend-mode) — no change to tails
2. Added diagnostic toggles (wireframe, flat red, bevel, front-only) — "flat red" proved tails were **geometry**, not reflections
3. Added console logging to depth handler — confirmed handler was firing, new `TextGeometry` was being created
4. **Key evidence:** Bounding box Z was always `-25.030 → 25.030` regardless of depth value (0.02, 0.22, 0.68, etc.)
5. `-25 → 25` = 50 units total = `TextGeometry`'s **default depth of 50** plus bevel

**Root cause:** `TextGeometry` in Three.js r160 (via `three/examples/jsm/geometries/TextGeometry`) silently ignored the `depth` parameter in its constructor options. Every geometry was created with the default 50-unit extrusion regardless of what we passed.

**Fix:** Replaced `new TextGeometry(text, { depth: v, ... })` with:
```js
const shapes = font.generateShapes(text, size);
new THREE.ExtrudeGeometry(shapes, { depth: v, ... });
```
This is what TextGeometry does internally, but `ExtrudeGeometry` correctly respects the `depth` option. The `buildTextGeo()` helper function encapsulates this.

**Note:** The reference prototype (`elevated-gold-hero.html`) uses r128's `THREE.TextGeometry` with the `height` parameter (the pre-r147 name for `depth`), which works correctly in that version. The parameter rename to `depth` in newer versions appears to have introduced the bug in the examples/jsm version.

---

### Current Defaults in Code

| Parameter | Value | Notes |
|-----------|-------|-------|
| Base color | `0x5a3d10` (medium) | Reference uses `0x3d2200` (darker) |
| Metalness | 1.0 | Same |
| Roughness | 0.15 | Same |
| envMapIntensity | 2.0 | Reference: 3.5 (but no actual envMap) |
| toneMappingExposure | 1.1 | Reference: 1.2 |
| Text size | 0.75 | Reference: 0.8 |
| Depth | 0.02 | Reference: 0.15 |
| Bevel | enabled, thickness 0.03, size 0.02 | Reference: 0.04 / 0.03 |
| Camera Z | 10 | Reference: 7 |
| Scale | 1.0 | |
| Mouse rotation | ±0.3 rad Y, ±0.15 rad X | Reference: ±0.8 / ±0.4 |
| Scene background | `0x000000` (opaque) | Same |
| Compositing | CSS `mix-blend-mode: screen` on canvas | Reference: on container div |
| Env map | RoomEnvironment (sigma 0.04) | Reference: none |

---

## Part B: Broader Makeup Site Implementation Status

### Plan 01 Items Completed

These items from `01-makeup-site-plan.md` were implemented but the plan's Status column was never updated:

| Item | Section | What was done |
|------|---------|---------------|
| Missing kit images | 1.3 | Product images sourced from Pexels, imported in `KitsCarousel.jsx` (`makeup_brushes_palette.jpeg`, `cosmetics_flatlay.jpeg`, `eyeshadow_palette.jpeg`) and `FeaturedSplit.jsx` (`pink_beauty.jpeg`). Descriptive alt text added to each. |
| Broken promo image | 1.1 | Resolved by populating `FeaturedSplit.jsx` with real `pink_beauty.jpeg` image |
| Footer obscured | 2.2 | Footer section in `MakeupHomePage.jsx` has `position: 'relative', zIndex: 1` |
| Debug tint | 7.1 | `HeroSection.css` `.particle-overlay` changed from `rgba(255, 0, 0, 0.1)` to `transparent` |
| CSS variable consolidation | 3.4, 7.3 | `MakeupStyle.css` is the single `:root` source of truth. `--gold` aliased to `--metallic-gold` (`#E2B84B`). Heading/body font vars consolidated. |
| Deprecated marquee | 2.3 | Replaced with CSS `@keyframes tickerScroll` animation + duplicated `<span>` in `HeroSection.jsx` for seamless loop. `role="marquee"` and `aria-label` added. |
| Button standardization | 3.2 | `KitsCarousel.css` carousel buttons → outlined/ghost style. `FeaturedSplit.css` `.split-btn` standardized. `HeroSection.css` hero button uses glass morphism with animated gradient border. |
| Typography | 3.1 | Fonts aligned to Playfair Display (headings) + Montserrat (body) in `MakeupStyle.css` and `beautyTheme.js` |
| Category nav | 5.2 | `DividingBar.jsx` items converted to `<button className="offering-link">` with hover/focus/focus-visible states. `role="navigation"` and `aria-label` on container. |
| Card WCAG contrast | 6.1 | `KitsCarousel.css` `.kit-card` has dark overlay for text contrast |
| Responsiveness | 4.1 | `KitsCarousel.css` — 480px breakpoint. `FeaturedSplit.css` — 768px breakpoint. `HeroSection.css` — 768px and 480px breakpoints. |

### Hero Section Architecture

- **`HeroSection.jsx`** is the active hero (glass morphism + particles + 3D gold title)
- **`HeroBanner.jsx`** is commented out in `MakeupHomePage.jsx` — kept as historical reference
- **tsParticles bokeh overlay**: 90 particles, gold/rose-gold/blush/cream palette, sizes 10-60px, opacity 0.15-0.5, CSS `filter: blur(4px)` on `.particle-overlay`. Visibility may still be low — was flagged but never confirmed resolved.

### Component Stack (top to bottom on page)

1. `HeroSection` — hero with particles, nav, 3D gold title, glass cards, ticker
2. `DividingBar` — maroon category navigation bar
3. `KitsCarousel` — 3-card react-slick carousel with Pexels product images
4. `FeaturedSplit` — split layout promo section with `pink_beauty.jpeg`
5. Footer section (inline in `MakeupHomePage.jsx`)

### Plan 01 Items Still Open

| Priority | Item | Section |
|----------|------|---------|
| P1 | Mobile responsiveness deep pass (beauty care specific) | 4.1 |
| P2 | Hero section layout refinement (card overlap) | 2.1 |
| P2 | Image optimization pipeline (WebP/AVIF, srcset) | 4.2 |
| P2 | CTA hierarchy refinement | 5.1 |
| P2 | Update footer copyright year | 5.4 |
| P3 | Skeleton loaders / CLS prevention | 4.3 |

### Key Decisions Made

- **No fake social proof** — reviews, star ratings, "X sold" badges removed from scope (portfolio project, not live store)
- **No footer expansion** — newsletter signup, payment icons imply a live store
- **Product data stays hardcoded** — no CMS. Fixes are component/props/CSS changes.
- **Beauty care section is currently disabled in main nav** — accessible via direct route `/makeup` but not linked from the globe landing page navbar
