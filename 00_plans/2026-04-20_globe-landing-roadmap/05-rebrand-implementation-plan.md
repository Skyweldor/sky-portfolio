# SynthCity DigiLabs — Rebrand + Vite + Launch Implementation Plan

**Date:** 2026-04-24
**Scope:** Rebrand `sky-portfolio` as **SynthCity DigiLabs**, migrate from Create React App to Vite, deploy to Cloudflare Pages at `synthcitydigilabs.com`, with Game Development as the only active sub-site at launch.
**Companion files:** `05-session-handoff.md` (prior handoff), `assistant_answers.md` (scoping), `performance-budget-plan.md`, `Lighthouse-Results.md`.
**Filename note:** `05-session-handoff.md` already exists in this folder; this plan uses `05-rebrand-implementation-plan.md` to preserve both. Renumber if you prefer a stricter ordering.

---

## 0. Canonical Brand Identity (lock this first)

| Field | Value | Notes |
|-------|-------|-------|
| Parent brand | **SynthCity DigiLabs** | Two words, two groups. Capital S, capital C, capital D, capital L. The studio/lab itself. Used site-wide: `<title>`, site-wide footer, OG defaults, JSON-LD `Organization`, domain, favicon. |
| Tagline (TBD) | — | Pick one before launch. Current placeholder is "Games, Stickers, and More". Something more studio-forward is on the table. |
| Domain | `synthcitydigilabs.com` | Cloudflare-registered. Apex canonical; `www` → apex redirect. |
| Previous name | JairDreams | Never use in production copy after rebrand. |

**Stylization note from the user:** The globe may render the name differently for styling, but the *grouping* ("SynthCity" + "DigiLabs") is canonical. Copy, `<title>`, meta, OG, schema, and alt text all use **SynthCity DigiLabs** with spaces between the two groups.

### 0.1 Subsidiary Hierarchy (locked 2026-04-24)

The site is a **studio with a portfolio of sub-brands**, not a single brand. Naming is intentionally inconsistent: some subsidiaries echo the parent ("SynthCity DigiLabs Interactive", "SynthCity StickerLabs"), others are independent ("Elevate", "Cirrus Learning"). Treat this as a holding-company pattern.

| Globe node | Subsidiary brand | Relation to parent | Route(s) | Launch status |
|------------|------------------|--------------------|----------|---------------|
| Game Development | **SynthCity DigiLabs Interactive** | Direct sub-brand (full parent name + "Interactive") | `/portfolio`, `/portfolio/*`, `/aetherbound`, `/minigames`, `/prototype`, PokeMMO Journal | **Active** |
| Stickers E-Commerce | **SynthCity StickerLabs** | Partial sub-brand (shares "SynthCity" prefix, echoes "Labs" in parent) | `/stickers`, `/stickershop` | Gated |
| Make-Up / Skincare E-Commerce | **Elevate** | Independent brand (no parent naming cue) | `/makeup`, `/beautycare` | Gated |
| Tutoring | **Cirrus Learning** (product: Tutoring) | Independent sub-umbrella | `/tutoring` (future) | Gated |
| Quantitative Finance | **Cirrus Learning** (product: Quant Finance) | Independent sub-umbrella, sibling to Tutoring under Cirrus | `/quant` (future) | Gated |

**Three-tier hierarchy** (the only globe node with this depth):
- Parent: SynthCity DigiLabs
  - Sub-umbrella: **Cirrus Learning** (educational)
    - Product: Tutoring
    - Product: Quantitative Finance

Cirrus Learning is its own brand that contains both education-oriented products. On the globe, these are two separate nodes for discovery, but they share the Cirrus wordmark and site chrome underneath.

**Scoping rule** (where each wordmark appears):

| Wordmark | Scope |
|----------|-------|
| **SynthCity DigiLabs** (parent) | `/` (Globe), Catalog, any cross-brand blog index, About, Contact, 404, site-wide footer, `<title>`, OG default, favicon, JSON-LD `Organization` |
| **SynthCity DigiLabs Interactive** | `/portfolio` + descendant routes only |
| **SynthCity StickerLabs** | `/stickers`, `/stickershop` only (gated) |
| **Elevate** | `/makeup`, `/beautycare` only (gated) |
| **Cirrus Learning** | `/tutoring`, `/quant` (future routes, gated) |

**Stylization note (resolved 2026-04-24):** "SynthCity" with the *h* is canonical in every sub-brand that uses it ("SynthCity DigiLabs", "SynthCity DigiLabs Interactive", "SynthCity StickerLabs"). Earlier "SyntCity" references in chat were typos, not a stylized variant.

**Impact on this plan:**
- `NavLogo.js` currently renders "Interactive" globally — must be scoped to game-dev routes only (see §1 and §3).
- Gated globe nodes can now display **real subsidiary names** in "coming soon" state instead of generic category labels. See §2 for the label-swap option.
- Only two wordmarks are needed at *launch*: parent ("SynthCity DigiLabs") and Interactive sub-lockup. The other three (StickerLabs, Elevate, Cirrus Learning) are deferred until their respective subsites ship.

---

## 1. Current Rebrand Gap Audit

Searches run 2026-04-24. Three code-visible JairDreams instances remain:

| File | Line | Current | Replace with |
|------|------|---------|--------------|
| `package.json` | 4 | `"homepage": "http://jairdreams.com"` | `"homepage": "https://synthcitydigilabs.com"` *(or remove entirely once we move to Vite — Vite doesn't use this field)* |
| `public/index.html` | 27 | `<title>JairDreams \| Games, Stickers, and More</title>` | `<title>SynthCity DigiLabs \| Games, Stickers, and More</title>` *(+ proper meta description + OG tags, see §5)* |
| `src/components/common/Footer.js` | 8 | `© 2023 by JairDreams. All rights reserved.` | `© 2026 SynthCity DigiLabs. All rights reserved.` |

Docs-only (non-blocking, update in a docs pass):

| File | Line | Note |
|------|------|------|
| `README.md` | 139 | "configured for deployment to jairdreams.com" → update to synthcitydigilabs.com |
| `00_plans/01-makeup-site-plan.md` | 153 | Historical doc; update or leave with a dated note |

**Needs scoping fix** (added 2026-04-24 per subsidiary correction):

| File | Current behavior | Required change |
|------|------------------|-----------------|
| `src/components/common/NavLogo.js` | Renders "SynthCity DigiLabs" **+** "Interactive" unconditionally on every page that mounts it | Gate the "Interactive" sub-line behind the existing `isGameMode` prop. Parent brand shows site-wide; "Interactive" only on game-dev routes. |
| `src/components/common/NavBar.js` | Passes `isGameMode` to `NavLogo` from whatever the consuming page supplies | Verify `isGameMode` is `true` only on Interactive routes (`/portfolio`, `/portfolio/*`, `/aetherbound`, `/minigames`, `/prototype`, PokeMMO Journal posts) and `false` everywhere else. May need a small `useLocation` + regex helper if the current logic is off. |

**Minimal `NavLogo` diff:**
```jsx
<div className={containerClasses}>
    <span className={styles.title}>SynthCity DigiLabs</span>
    {isGameMode && <>
        <span className={styles.underline}></span>
        <span className={styles.interactive}>Interactive</span>
    </>}
</div>
```

If future subsidiaries want their own sub-line (e.g., "Cosmetics", "Academy"), generalize the prop later: `subsidiary="interactive" | "cosmetics" | null`. For launch, boolean is fine.

**Already rebranded** (no change needed):
- Brand palette, typography, CSS classes (no "jair" references in styles)

---

## 2. Globe Landing — Gate Non-Launch Routes

**Goal:** Only **Game Development** is active at launch. Every other node is visually present (keeps the globe's density/aesthetic) but non-interactive with a "Coming Soon" affordance.

### Current `GLOBE_CONFIG.serviceLinks` (`src/pages/GlobeLanding.jsx:12`)

```js
{
  'Game Development': '/portfolio',           // KEEP ACTIVE
  'Quantitative Finance': '#',                // already gated
  'Tutoring': '#',                            // already gated
  'Make-Up/Skincare E-Commerce': '/makeup',   // GATE for launch
  'Stickers E-Commerce': '/stickers'          // GATE for launch
}
```

### Change

Introduce a `status` flag so the globe can render inactive nodes distinctly:

```js
const GLOBE_CONFIG = {
  serviceLinks: {
    'Game Development':           { href: '/portfolio', status: 'active' },
    'Quantitative Finance':       { href: '#',          status: 'coming-soon' },
    'Tutoring':                   { href: '#',          status: 'coming-soon' },
    'Make-Up/Skincare E-Commerce':{ href: '/makeup',    status: 'coming-soon' },
    'Stickers E-Commerce':        { href: '/stickers',  status: 'coming-soon' }
  },
  // ...rest unchanged
};
```

Update the 3D label creation loop and `handleNavigate` callback to:
- Read `href` from the object form.
- If `status !== 'active'`, short-circuit navigation (same as the existing `#` guard) and optionally trigger a small toast / tooltip reading "Coming Soon".
- Apply a visual treatment to coming-soon labels: slightly desaturated color (e.g., `#557788` instead of `#00ddff`), lower opacity (~0.55), strip the glow text-shadow. Define a `.css2d-label.coming-soon` variant in the inline `globeStyles` block (`GlobeLanding.jsx:31`).

Also check `GlobeMobileMenu.jsx` — it likely consumes the same config and needs the same desaturated/disabled treatment for coming-soon entries.

**Routes themselves:** Leave the `/makeup` and `/stickers` React Router routes in place. Typing the URL directly still works (useful for internal QA). We're only gating the globe's discovery path.

### 2.1 Label Swap — Category vs. Subsidiary Brand Name

Now that all four subsidiary names are locked (§0.1), the globe labels can use real brand names instead of generic category descriptors. Three options:

**Option A — Keep category labels (current):**
```
Game Development | Quantitative Finance | Tutoring | Make-Up/Skincare E-Commerce | Stickers E-Commerce
```
Pro: descriptive for first-time visitors who don't know the brand names yet. Con: generic, wastes the brand equity of names like "Elevate" and "Cirrus Learning."

**Option B — Brand names only (punchy):**
```
Interactive | Cirrus Learning (Quant) | Cirrus Learning (Tutoring) | Elevate | SynthCity StickerLabs
```
Pro: brand-forward, immediately tells visitors "this studio has real products, not hypotheticals." Con: "Interactive" alone is ambiguous (interactive what?); Cirrus Learning shows twice which is noisy.

**Option C — Brand + category sub-line (recommended):**
Each globe node shows a primary line (brand) and a smaller secondary line (category). Visually richer and solves both problems:
```
SynthCity DigiLabs Interactive    (Games)
SynthCity StickerLabs             (Stickers)
Elevate                           (Cosmetics)
Cirrus Learning                   (Tutoring)
Cirrus Learning                   (Quant Finance)
```
Requires a small change to the CSS2D label renderer in `GlobeLanding.jsx` to stack two lines — achievable by rendering two `<div>` children inside each label root with different font sizes. ~1 hour of work.

**Recommendation:** Option C. It reinforces the holding-company model visually, keeps the active Interactive node self-explanatory, and lets Cirrus Learning show twice without feeling like a glitch (the sub-category differentiates them).

**Follow-on:** If Option C is picked, the `GLOBE_CONFIG` shape becomes:
```js
{
  'interactive': { brand: 'SynthCity DigiLabs Interactive', category: 'Games', href: '/portfolio', status: 'active' },
  'stickerlabs': { brand: 'SynthCity StickerLabs',         category: 'Stickers', href: '/stickers', status: 'coming-soon' },
  'elevate':     { brand: 'Elevate',                       category: 'Cosmetics', href: '/makeup', status: 'coming-soon' },
  'cirrus-tutor':{ brand: 'Cirrus Learning',               category: 'Tutoring', href: '/tutoring', status: 'coming-soon' },
  'cirrus-quant':{ brand: 'Cirrus Learning',               category: 'Quant Finance', href: '/quant', status: 'coming-soon' }
}
```
(Keyed by slug instead of the human label to avoid duplicate-key collisions from two Cirrus entries.)

---

## 3. Logo & Visual Identity

### Where a logo shows up on this site (current reality)
- `NavLogo.js` — typographic only. Currently "SynthCity DigiLabs" + underline + "Interactive" **on every page** (bug — see §1 scoping fix). **No graphical mark.**
- `public/favicon.ico` + `logo192.png` + `logo512.png` — inherited CRA defaults (React atom logo); need replacement.
- `public/manifest.json` — references logo192/512.
- Default OG image for social unfurls — **does not exist yet**.

### Brand marks needed (parent + subsidiaries)

Because the hierarchy is parent + subsidiaries, we actually need **at least two** wordmarks for launch, not one:

| Asset | Scope | Required for launch |
|-------|-------|---------------------|
| **Parent wordmark** ("SynthCity DigiLabs") | Site chrome, favicon, OG default, JSON-LD logo, Globe landing hero | Yes |
| **Interactive sub-lockup** ("SynthCity DigiLabs" + "Interactive") | `/portfolio` and descendant routes only | Yes (already exists in `NavLogo.js`; just needs scoping per §1) |
| Cosmetics / Stickers / Academy / Capital sub-lockups | Their respective subsites | No — deferred until those subsidiaries ship |

The existing `NavLogo` treatment already covers the Interactive lockup. The parent wordmark is effectively the same component with the sub-line suppressed.

### Three tiers of effort (pick one)

**Tier A — Wordmark-only (ship today).** No graphical mark. The existing `NavLogo.js` treatment (monospaced, glowing, underline + "Interactive" sub-line) *is* the logo. Deliverables:
- `brand/wordmark.svg` — paths-outlined SVG of "SynthCity DigiLabs" in the chosen typeface (IBM Plex Mono per current styles, or Eurostile / Orbitron for more synthwave feel).
- Favicon generated by rendering the letters "S" + "D" (or a stylized `//`) as a 32×32 glyph.
- Default OG image (1200×630): wordmark centered over a dark gradient + subtle scanline.
- **Effort:** 1–2 hours with an SVG editor or a tool like [Figma](https://figma.com) / [Boxy SVG](https://boxy-svg.com).

**Tier B — Wordmark + simple glyph (ship within a day or two).** Add a compact mark that can stand alone in a favicon, nav corner, or avatar. Ideas that fit the synthwave/digital-city theme:
- Two stylized skyscraper silhouettes forming a letter **M** or **SD** monogram, neon-outlined against a horizon sun.
- A single glowing cube or isometric prism (digital "lab specimen"), echoes the `Iso-Squares_Game` directory in your workspace.
- A sine-wave / oscilloscope line crossing a city skyline.
- A circuit-trace rendering of the letters "SCDL".
- **Effort:** 3–6 hours, or ~1 hour if you generate candidates with AI (Midjourney / DALL·E prompt: *"minimal synthwave logo glyph, SynthCity DigiLabs monogram, neon cyan on dark, vector-ready, flat, no text"*) then trace/clean.

**Tier C — Full illustrated brand mark (ship next week).** Full illustration + wordmark lockup + vertical/horizontal variants + light/dark. Pairs with a small brand guidelines doc (colors, type scale, spacing rules). **Effort:** 1–3 days; best done post-launch.

### Recommendation for this sprint
**Tier A for launch, upgrade to Tier B within a week.** Reasons:
1. Ships today without blocking the rebrand.
2. The existing `NavLogo` already functions as a competent wordmark — no wasted work.
3. Tier B can be layered on without touching layout (swap favicon + drop a glyph into `NavLogo.js` next to the wordmark).
4. You can learn what the site *feels* like live before committing to a mark.

### Colors & type to codify either way
Codify in `src/styles/_tokens.css` (create if absent) and reference from both the brand SVG and the app:

| Token | Value (suggested) | Usage |
|-------|-------------------|-------|
| `--brand-cyan` | `#00ddff` | Primary label glow (already in `GlobeLanding.jsx`) |
| `--brand-magenta` | `#ff2ea6` | Accent / hover |
| `--brand-ink` | `#05060d` | Background |
| `--brand-mono` | `"IBM Plex Mono", "Courier New", monospace` | Current label font; keep for wordmark |
| `--brand-display` | TBD (Orbitron / Eurostile / Chakra Petch) | Optional display face for headings |

---

## 4. Vite Migration

### Why (for the record)
- `react-scripts` unmaintained since 2022; security audit noise; no React 19 support path.
- Dev server: ~10s cold start → ~200ms.
- Prod build: smaller bundles, faster Pages builds (meaningful on CF's 20-min build cap).
- Standard entry-point model easier to reason about.

### Pre-migration code survey (completed 2026-04-24)

| Concern | Finding | Action needed |
|---------|---------|---------------|
| JSX in `.js` files | `App.js`, `index.js`, most pages/components use `.js` extensions with JSX | Vite's React plugin supports JSX in `.js` via esbuild config. Add `esbuild.loader = { ".js": "jsx" }` in `vite.config.js`. Or rename incrementally. |
| `%PUBLIC_URL%` | Used in `public/index.html` for favicon, apple-touch-icon, manifest | Move `index.html` to project root, replace `%PUBLIC_URL%/foo` with `/foo`. |
| `process.env.PUBLIC_URL` | One usage: `src/components/blog/DexCard.jsx:47` | Replace with plain `pokemon.sprite` (deploy is at root). |
| `process.env.REACT_APP_*` | None found | No action. |
| CRA SVG `ReactComponent as` | None — all SVG imports are URL-style | No `vite-plugin-svgr` needed. |
| Bootstrap / react-bootstrap | Pure ESM-compatible | Works out of the box. |
| @react-three/fiber + drei + three | Vite-native | Works out of the box; may improve due to better tree-shaking. |
| tsparticles | ESM | Works. |
| react-slick + slick-carousel | slick-carousel ships CSS that needs `import "slick-carousel/slick/slick.css"` style imports — check existing imports survive | Should work; verify at first dev run. |
| Tests (`App.test.js`, `setupTests.js`) | Jest-based via CRA | For launch: remove `"test"` script or swap to `vitest` + `@testing-library/jest-dom/vitest`. Not blocking. |
| `reportWebVitals.js` | `web-vitals` package | Works unchanged. |
| ESLint config in `package.json` | `"extends": ["react-app", "react-app/jest"]` | Those presets are tied to CRA. Replace with `eslint-plugin-react` + `eslint-plugin-react-hooks` directly (or skip ESLint config until launch). |

### Migration steps (in order)

1. **Branch:** `git checkout -b rebrand-vite-migration` off current `main` state.
2. **Install Vite + plugin:**
   ```
   npm install --save-dev vite @vitejs/plugin-react
   ```
3. **Remove CRA:**
   ```
   npm uninstall react-scripts
   ```
   (Keep `@testing-library/*` for now; remove only after deciding on Vitest vs. drop.)
4. **Move `public/index.html` → `./index.html`.** Edit it:
   - Replace every `%PUBLIC_URL%/foo` with `/foo` (favicon, apple-touch-icon, manifest).
   - Add the Vite entry script right before `</body>`:
     ```html
     <script type="module" src="/src/index.js"></script>
     ```
   - While editing, also drop in the full rebrand `<title>`, `<meta description>`, and OG tags from §5.
5. **Create `vite.config.js` at project root:**
   ```js
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     server: { port: 3000, open: true },
     build: { outDir: 'build', sourcemap: true },
     esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
     optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } }
   });
   ```
6. **Update `src/components/blog/DexCard.jsx:47`:** replace `process.env.PUBLIC_URL + pokemon.sprite` with `pokemon.sprite`.
7. **Update `package.json` scripts:**
   ```json
   "scripts": {
     "dev": "vite",
     "start": "vite",
     "build": "vite build",
     "preview": "vite preview"
   }
   ```
   Delete `"homepage"` — Vite doesn't use it; Cloudflare Pages handles base path via the `build.outDir` and domain.
8. **Remove CRA-specific ESLint config** from `package.json` (lines 33–38). Leave ESLint unconfigured for now; we'll add flat-config post-launch.
9. **Remove / relocate test infra** (optional for launch):
   - If keeping: `npm install --save-dev vitest jsdom` and convert `App.test.js` + `setupTests.js` to Vitest idioms.
   - If deferring: delete `"test"` script and leave files in place; they'll be unreachable until Vitest is wired up.
10. **First run:**
    ```
    npm run dev
    ```
    Expect 1–3 resolution errors on first boot; fix in place (typical: a missing CSS import side-effect, or a circular import CRA masked).
11. **Production build smoke test:**
    ```
    npm run build && npm run preview
    ```
    Open `http://localhost:4173`, walk every route (Globe, Portfolio, blog posts, Pokédex), confirm nothing 404s.
12. **Commit.** PR into `main`.

### Rollback plan
If anything catastrophic surfaces, `git checkout main` reverts the migration cleanly. CRA build still works from `main` until the migration PR is merged.

---

## 5. SEO & Meta Basics (minimum for launch)

Edit `index.html` (newly at project root after §4 step 4) to replace the CRA defaults:

```html
<title>SynthCity DigiLabs — Games, Stickers, and More</title>
<meta name="description" content="SynthCity DigiLabs is an independent interactive studio building games, sticker collections, and experimental web experiences." />
<meta name="theme-color" content="#05060d" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://synthcitydigilabs.com/" />
<meta property="og:title" content="SynthCity DigiLabs" />
<meta property="og:description" content="Independent interactive studio — games, stickers, experiments." />
<meta property="og:image" content="https://synthcitydigilabs.com/og-default.png" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="SynthCity DigiLabs" />
<meta name="twitter:description" content="Independent interactive studio — games, stickers, experiments." />
<meta name="twitter:image" content="https://synthcitydigilabs.com/og-default.png" />
```

Create `public/og-default.png` (1200×630) per §3 deliverables.

**Per-route meta** (varying `<title>` and `<meta description>` per page) is deferred to post-launch. Plan: install `react-helmet-async`, wrap `<App />` in `<HelmetProvider>`, add a `<Helmet>` per page. Not needed for v1.

**robots.txt:** current `public/robots.txt` is fine (allow all).

**sitemap.xml:** deferred. Post-launch: add a script that walks the React Router config and emits `public/sitemap.xml` at build time.

**RSS:** deferred. Relevant once the PokeMMO Journal / Lab Notes grows past 2–3 posts.

**schema.org:** add a JSON-LD `Organization` block to `index.html` before `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SynthCity DigiLabs",
  "url": "https://synthcitydigilabs.com",
  "logo": "https://synthcitydigilabs.com/logo512.png"
}
</script>
```

---

## 6. Cloudflare Pages Deployment

### Why Pages over Vercel / Netlify / GitHub Pages
- Same vendor as DNS → zero-friction custom domain attachment.
- Free tier: 500 builds/month, unlimited bandwidth, unlimited requests.
- Preview deployments on every PR by default.
- Web Analytics integration with one tick-box.
- Pages Functions available when you want a contact form later.

### One-time setup
1. Push current branch (after Vite migration is on `main`) to GitHub.
2. Cloudflare dashboard → Pages → **Create a project** → Connect to Git → select `sky-portfolio` repo.
3. Build config:
   - Framework preset: **Vite** (or "None" — doesn't matter; we set commands manually)
   - Build command: `npm run build`
   - Build output directory: `build`
   - Root directory: `/`
   - Environment variables: none for launch
   - Node version: set `NODE_VERSION = 20` in environment variables (Pages default is old)
4. First deploy lands at `sky-portfolio-XXXX.pages.dev`. Smoke-test that URL before attaching the domain.
5. Pages → project → **Custom domains** → Add `synthcitydigilabs.com` and `www.synthcitydigilabs.com`.
6. In Cloudflare DNS (same dashboard): Pages auto-creates the CNAME records. Verify `synthcitydigilabs.com` points to the Pages project. Add a 301 redirect rule `www.synthcitydigilabs.com/*` → `https://synthcitydigilabs.com/$1`.
7. Enable **Cloudflare Web Analytics** — Pages project settings → Analytics → toggle on. No JS snippet needed if enabled via Pages.

### Single-page-app routing gotcha
React Router needs all paths to fall back to `index.html`. Create `public/_redirects` (or `./public/_redirects` — Pages reads it from the build output root):

```
/*  /index.html  200
```

Without this, hard-refreshing `/portfolio` or sharing a deep link returns 404. This is the single most common launch-day bug for SPAs on Pages/Netlify.

### DNS cutover
The domain is already on Cloudflare, so cutover is adding the Pages custom domain binding. Propagation is seconds, not hours. No TTL wait.

---

## 7. Launch-Day Checklist (ordered)

Tick these in order. Everything above this point is background; this is the runbook.

**Pre-flight (local branch, no network impact):**
- [ ] Branch from `main`: `rebrand-vite-launch`.
- [ ] Update `src/components/common/Footer.js:8` → `© 2026 SynthCity DigiLabs. All rights reserved.`
- [ ] **Gate `NavLogo` "Interactive" sub-line behind `isGameMode`** (per §1 scoping fix). Verify every non-game-dev route shows parent-only wordmark.
- [ ] **Audit `NavBar.js` `isGameMode` logic** — confirm it's `true` only on `/portfolio`, `/portfolio/*`, `/aetherbound`, `/minigames`, `/prototype`, and PokeMMO Journal blog routes. False everywhere else.
- [ ] Update `public/index.html` `<title>` + meta tags + JSON-LD per §5. (If doing Vite first, apply to root `index.html`.)
- [ ] Update `package.json` homepage (or delete if Vite migration done).
- [ ] Update `README.md:139` and `00_plans/01-makeup-site-plan.md:153` for consistency.
- [ ] Refactor `GLOBE_CONFIG.serviceLinks` per §2, add `.coming-soon` CSS variant, verify `GlobeMobileMenu.jsx` also renders the gated state.
- [ ] Drop `public/og-default.png` (1200×630) in place.
- [ ] Replace `public/favicon.ico`, `logo192.png`, `logo512.png` with brand assets (Tier A or B from §3). Favicon uses the **parent** mark, not Interactive.
- [ ] Add `public/_redirects` with SPA fallback.
- [ ] Add `Organization` JSON-LD to `index.html` (schema name: "SynthCity DigiLabs", **not** "Interactive").

**Vite migration (§4):**
- [ ] Execute steps 1–12. `npm run build && npm run preview` must pass.

**Local smoke test:**
- [ ] `npm run preview` → walk every active route, confirm:
  - [ ] Globe loads, Game Development navigates to Portfolio.
  - [ ] Tutoring, Quantitative Finance, Make-Up, Stickers render as coming-soon (desaturated, no-op on click).
  - [ ] Portfolio page, blog index, blog post detail (PokeMMO Journal 002), Pokédex pages all render.
  - [ ] **NavLogo shows "Interactive" sub-line ONLY on game-dev routes.** Globe, Catalog, Makeup preview, Stickers preview, any non-game blog: parent wordmark only.
  - [ ] Footer shows new copyright (parent name, not Interactive).
  - [ ] Tab title reads "SynthCity DigiLabs …" (parent).
  - [ ] View-source: `<meta description>` and OG tags present; no "create-react-app" copy anywhere.
  - [ ] Favicon is the new mark (parent brand), not the CRA React atom.

**Deploy:**
- [ ] Merge branch to `main`.
- [ ] Push. CF Pages auto-builds.
- [ ] Verify `*.pages.dev` URL works end-to-end (repeat smoke test).
- [ ] Attach custom domains (apex + www).
- [ ] Verify `https://synthcitydigilabs.com` loads with valid TLS.
- [ ] Verify `https://www.synthcitydigilabs.com` → 301 → apex.
- [ ] Hit a deep link cold (`/portfolio`) in a fresh browser — confirm `_redirects` works.
- [ ] Share to self via Slack/Discord/Twitter, confirm OG image unfurls.

**Post-deploy (same day):**
- [ ] Enable CF Web Analytics.
- [ ] Save deploy URL + build-log link somewhere you can find it.
- [ ] Tag the launch commit: `git tag v1.0.0-launch && git push --tags`.

---

## 8. Weekend Polish (post-launch, non-blocking)

Order by user-visible impact:
1. **Per-route OG images + titles** via `react-helmet-async`. Biggest SEO/social win. ~2 hours.
2. **Sitemap generator** at build time. ~30 min with `vite-plugin-sitemap` or a custom Node script walking the router config.
3. **RSS feed** for PokeMMO Journal / Lab Notes. ~1 hour.
4. **Final blog edits** (PokeMMO Journal 002 polish, any drafts).
5. **Lighthouse tuning** per `performance-budget-plan.md` — route-level code-splitting for 3D-heavy pages (Globe, Portfolio's three.js bits).
6. **Tier B logo upgrade** (§3) if you want a graphical mark.
7. **Contact form** via a Pages Function → Resend (free 3k/mo). Adds a POST endpoint without leaving the Pages vendor.
8. **Remove the `"homepage"` field permanently** and delete the unused `react-scripts` / CRA ESLint config if not already done during §4.

---

## 9. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Vite build surfaces hidden CRA-isms (circular imports, implicit JSX-in-.js, missing CSS side-effect imports) | Medium | Medium (1–3 hrs of fixes) | Do Vite migration on a branch; rollback is `git checkout main`. |
| `public/_redirects` forgotten → deep-link 404s on Pages | High if missed | High (broken shared links) | Explicit checklist item. Test a deep link cold before announcing. |
| OG image missing → link unfurls look broken on social | Medium | Medium (bad first impression) | Include `og-default.png` in pre-flight checklist. |
| Old `jairdreams.com` host (if any) still serving stale site when people share the new domain | Low | Low | You said "no current host"; if an old deploy exists anywhere, point its DNS at the new site or tear it down. |
| CRA `react-scripts` leaves behind deprecated deps that npm audit flags on CF build | Low | Low (log noise only) | Clean `node_modules` + `package-lock.json` after `npm uninstall react-scripts`, reinstall fresh. |
| 3D assets (globe, three.js scenes) build to larger bundles than Vite's default chunking handles gracefully | Medium | Medium (slow first paint) | Post-launch: add manual `build.rollupOptions.output.manualChunks` for three.js. Not blocking launch. |
| Brand name typed as "Synth City Digi Labs" (4 words) somewhere during the rebrand | Medium | Low (visual inconsistency) | Single grep pass post-edit: `rg -i "synth ?city ?digi ?labs"` should return only "SynthCity DigiLabs". |
| "Interactive" sub-line leaks onto non-game-dev pages (site looks like the whole studio is the game dev subsidiary) | High if scoping check skipped | High (branding confusion, undermines subsidiary model) | Explicit checklist items under pre-flight and smoke test. Visit every top-level route and confirm parent vs. subsidiary wordmark renders correctly. |

---

## 10. Open Questions (answer before or during sprint)

1. **Tier A or Tier B logo for launch?** Default: Tier A (ship today). Tier B within a week.
2. **Tagline** — keep "Games, Stickers, and More", or write something more studio-forward?
3. **Display typeface** — stay with IBM Plex Mono for everything, or adopt a display face (Orbitron / Eurostile / Chakra Petch) for H1/H2?
4. **Tutoring / Quant Finance — ever coming?** If they're aspirational rather than planned, consider dropping from the globe entirely vs. permanent "coming soon." Not blocking launch.
5. **Email on domain** — Cloudflare Email Routing to your existing inbox (free), or Google Workspace ($6/mo)? Only matters if you need to send *from* `@synthcitydigilabs.com` at launch.
6. **Globe label treatment** — Option A (categories), B (brand names only), or C (brand + category sub-line)? See §2.1. Recommendation: **C**.
7. **Parent vs. Interactive in footer** — current plan: footer always shows parent ("© 2026 SynthCity DigiLabs"). Alternative: footer switches subsidiary name on Interactive routes ("© 2026 SynthCity DigiLabs Interactive, a SynthCity DigiLabs studio"). The first is cleaner for launch; the second reinforces the parent/subsidiary model but is more work. Default: first.
8. **Cirrus Learning identity** — is Cirrus Learning a *wholly-owned subsidiary* of SynthCity DigiLabs (its parent organization, appears in the JSON-LD `Organization.subOrganization` array), or a *sibling brand* you happen to run that just lives on this domain for convenience? Matters for schema.org and future About-page copy. No impact on launch (Cirrus is gated) but worth locking before you write About copy.

---

## 11. One-Paragraph TL;DR

Rebrand **sky-portfolio** → **SynthCity DigiLabs** (parent studio) with **SynthCity DigiLabs Interactive** as the only active subsidiary at launch: find-and-replace three JairDreams references (`package.json`, `public/index.html`, `Footer.js`), **scope the `NavLogo` "Interactive" sub-line to game-dev routes only** so non-game pages show just the parent wordmark, gate the four non-Interactive globe nodes behind a "coming soon" state, drop in a Tier A parent wordmark + favicon + default OG image, migrate from CRA to Vite on a branch (code survey is clean — one `process.env.PUBLIC_URL` usage, no SVG `ReactComponent` patterns, no `REACT_APP_*` env vars), deploy to Cloudflare Pages at `synthcitydigilabs.com` with a `_redirects` SPA fallback and `www → apex` 301, flip Web Analytics on, then spend the weekend on per-route meta, sitemap, RSS, and Lighthouse tuning.
