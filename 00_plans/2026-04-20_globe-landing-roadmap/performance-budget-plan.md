# Globe Landing — Performance Budget Plan

_Created 2026-04-21. Picks up after the loading-screen redesign session of the same day. Based on Lighthouse run captured in `Lighthouse-Results.md` (same folder)._

---

## Why this plan exists

During the loader redesign we added a deliberate ~800ms "Ready" hold before the overlay fades. The question came up: does that hurt discovery/conversion? Ran Lighthouse to find out. The hold turned out to be irrelevant — the real perf problems are elsewhere. This plan captures those problems and what to do about them, so the next session can pick up without re-deriving context.

---

## Lighthouse snapshot (mobile, throttled)

Source: `Lighthouse-Results.md`, same folder. Device: Mobile. Network: simulated slow 4G. Run against the dev server state immediately after the loader redesign (commit needed after the redesign; see "Session state" below).

| Metric | Value | Score | Google threshold | Verdict |
|---|---|---|---|---|
| First Contentful Paint (FCP) | 1.7s | 0.91 | <1.8s good | **Good** |
| Largest Contentful Paint (LCP) | **5.1s** | 0.25 | <2.5s good, >4s poor | **Poor** |
| Speed Index | 3.6s | 0.87 | <3.4s good | Good |
| Total Blocking Time (TBT) | 640ms | 0.46 | <200ms good, >600ms poor | Borderline poor |
| Max Potential FID | 370ms | — | — | Borderline |
| Time to Interactive (TTI) | **8.3s** | 0.40 | <3.8s good | **Poor** |
| Cumulative Layout Shift (CLS) | 0.003 | 1.00 | <0.1 good | Excellent |

### Diagnostic findings (from the same report)

- **Main-thread work:** 7.3s total (line 283 of Lighthouse-Results.md)
- **Long tasks:** 5.4s cumulative across 7 tasks >50ms (lines 353, 1296)
- **Total network payload:** 950 KiB (line 2849)
- **Est. savings flagged by Lighthouse:**
  - 237 KiB prunable → would save ~750ms LCP (lines 3005-3011)
  - 285 KiB prunable → ~150ms LCP (lines 3073-3079)
  - 284 KiB prunable → ~750ms (lines 3134-3136)
  - 227 KiB additional flagged (line 2922)

---

## Key finding: the 800ms hold is a non-issue

LCP captures the largest paint event during initial load. In this page, that's the globe sphere becoming visible once Three.js finishes initializing — measured around 5.1s. By that time, the loader overlay is still covering it (fade hasn't started), and the "Ready" hold happens *after* LCP has been captured. Trimming the hold to 0ms would not move LCP.

**Decision:** keep the 800ms. It's craft polish with zero cost on the SEO-critical metric.

---

## Real bottlenecks (in priority order)

### 1. JS bundle size — 950 KiB total, ~1 MiB of prunable JS flagged

Lighthouse identified three separate opportunities totaling ~750 KiB that could realistically be pruned. Candidates to investigate:

- **Three.js and its jsm/ extras** — already loaded via dynamic imports (see `src/pages/GlobeLanding.jsx:149-157`), good. But verify tree-shaking is actually working and we're not pulling the full Three.js build.
- **Post-processing passes** (`EffectComposer`, `UnrealBloomPass`, `ShaderPass`, `RenderPass`) — bloom is heavy. Consider whether bloom is visible enough on mobile to justify the cost, or whether a mobile branch skips it.
- **`FontLoader` + `TextGeometry`** — used for the 3D equatorial text. If we can render that text as CSS2D labels instead (already have the infra from `CSS2DRenderer`), we drop the TextGeometry cost.
- **Unused route code** — check whether Portfolio, Catalog, Sticker Shop, etc. chunks are loading eagerly via `siteRoutes.js`. They should all be `lazy()` and deferred until their route is hit.

### 2. Three.js init cost — 7.3s main-thread

Even after bundle-trimming, the actual globe construction is expensive:

- Globe mesh generation
- Particle system
- Bloom composer setup
- CSS2D label creation (5 services × DOM nodes each)

**Options:**
- **Progressive reveal:** show a static globe placeholder (2D image or simplified Three.js) during init, then swap in the full animated globe in the background. User never sees the full 7s gap.
- **Idle-time init:** use `requestIdleCallback` for non-critical setup (particles, bloom) so FCP→LCP gap shrinks.
- **Device-tiered config:** the existing `detectQualityTier()` at `src/pages/GlobeLanding.jsx:171` already grades devices. Verify the low-end path actually skips enough work — if it's still building the full scene, that's the fix.

### 3. Preconnect / preload for fonts

IBM Plex Mono + VT323 are loaded via `fonts.googleapis.com` link tag injected at runtime (`GlobeLanding.jsx:120-124`). This blocks on DNS + TCP to Google Fonts. Move to:
- `<link rel="preconnect">` in `public/index.html`
- Or self-host the two font files (woff2) and serve from own origin

Small win (~100-200ms FCP on cold visits), but cheap to do.

---

## Plan of attack (suggested sequencing)

### Phase 1 — Measure baseline better (30 min)
Before cutting anything, confirm what's actually in the bundle:
- Run `npm run build` then `npx source-map-explorer 'build/static/js/*.js'` to get a visual bundle breakdown
- Confirm which chunk Three.js lives in and whether route-level code-splitting is working
- Capture screenshot of treemap for the plan

### Phase 2 — Low-risk wins (1-2 hours)
- Add `<link rel="preconnect" href="https://fonts.googleapis.com">` to `public/index.html`
- Verify all routes in `src/config/siteRoutes.js` use `React.lazy()` — patch any that don't
- Check that `siteRoutes.js` itself doesn't statically import any heavy page components
- Re-run Lighthouse, compare LCP/TTI/TBT

### Phase 3 — Three.js tuning (half day+)
- Audit `detectQualityTier()` logic on `src/pages/GlobeLanding.jsx:171` — is the low-tier path meaningfully lighter?
- Add a mobile branch that skips `UnrealBloomPass` entirely; test visually
- Replace `TextGeometry` equatorial labels with `CSS2DRenderer` labels if visual parity is acceptable
- Consider deferring particle system init to `requestIdleCallback` after globe paints

### Phase 4 — Optional: progressive reveal
If LCP is still >2.5s after Phase 3, introduce a placeholder (static image or simplified geometry) so LCP catches the placeholder instead of the full globe. Biggest behavioral change, saved for last.

---

## Success criteria

Target values for re-test (mobile, same throttling):

- LCP: ≤ 2.5s (currently 5.1s — cut in half)
- TTI: ≤ 5s (currently 8.3s)
- TBT: ≤ 300ms (currently 640ms)
- Performance score: 80+ (need to capture current overall score; not extracted yet)
- CLS: keep at current 0.003

If Phase 2 alone gets us to LCP < 3.5s, Phases 3-4 become optional polish.

---

## What NOT to touch

- **The 800ms "Ready" hold** in `src/pages/GlobeLanding.jsx:789`. Zero impact on LCP, keeps craft polish.
- **The loader redesign itself.** Chamfered frame, stepped fill, segmented dividers, site-font status text, corner branding — all finalized this session.
- **CLS source.** It's 0.003, essentially perfect. Don't introduce layout shifts for perf "fixes."

---

## Session state (handoff)

**Last touched files this session:**
- `src/pages/GlobeLanding.jsx` — phase text consolidated, stepped text swap, 800ms hold timing
- `src/pages/GlobeLanding.css` — loader redesign (status font, chamfered frame, stepped fill)

**Git status at plan creation:** loader redesign work is uncommitted. Recommend committing before starting perf work so perf changes are isolable. Last clean checkpoint is `ab9db3d` (2026-04-20).

**Lighthouse run to reference:** `Lighthouse-Results.md` in this same folder. Raw JSON; key metrics extracted above but full audit details (diagnostics, opportunities) are in the source file if deeper triage is needed.

**Open question for next session:**
- Do we care about SEO for this page specifically, or is it mostly a referral destination? (Affects whether Phase 3-4 is worth the investment.)
- Is there appetite for replacing the bloom effect on mobile, or is the visual non-negotiable?
