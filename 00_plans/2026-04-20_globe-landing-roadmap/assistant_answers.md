# Synth City Digi Labs — Scoping Answers

> **Context correction:** `synthcitydigilabs.com` is the new domain for **this existing `sky-portfolio` project**, not a greenfield build. Most tech-stack / content-model questions are already answered by the repo. `TBD:` marks what still needs your decision.

## 1. Site Purpose & Scope
- **What is the site?** Studio/brand site for SynthCity DigiLabs, built on the existing multi-page portfolio. Sections already present: Globe landing, Portfolio, Catalog, Aetherbound, BeautyCare, StickerShop, MiniGames, Prototype, blog (PokeMMO Journal), Pokédex.
- **Primary goal for visitors?** TBD — land on Globe → explore work → contact? Confirm the funnel.
- **Rough page count at launch?** Already **15+** routes/sub-routes. TBD: which stay under `synthcitydigilabs.com` vs. get trimmed/renamed for the rebrand.

## 2. Tech Stack — *already established*
- **Framework:** **Create React App** (`react-scripts 5`), React 18, React Router 6. TBD: keep CRA or migrate to Vite? (CRA is unmaintained; migration is ~half-day and would noticeably improve dev-server + build speed.)
- **Language:** **JavaScript** (no TS). Keep as-is unless you want to migrate.
- **Styling:** **Bootstrap 5 + react-bootstrap + custom CSS** (see `GlobeLanding.css` etc.). No Tailwind. Keep as-is.
- **3D / visuals:** **three.js + @react-three/fiber + @react-three/drei + tsparticles**. Established.
- **Existing repo:** This one (`sky-portfolio`, git, branch `main`).

## 3. Content Model — *already established*
- **Where does copy live?** **Hardcoded in JSX** for page content; structured data folders for `blog/` and `pokedex/`. No CMS.
- **Blog / devlog:** **Yes** — PokeMMO Journal already live under `src/pages/blog/`. Post 002 shipped recently.
- **Update frequency:** TBD — recent commits suggest monthly-ish; confirm cadence.

## 4. Dynamic Features
- **Contact form?** TBD. No handler in repo yet. If yes, recommend **Cloudflare Pages Function → Resend** (free 3k/mo) or **Formspree**.
- **Newsletter?** TBD — none at launch unless you say otherwise.
- **Auth / gated content?** None. Keep static.
- **Edge functions / APIs?** None currently. Add only if contact form or a dynamic Pokédex query justifies it.

## 5. Design & Assets
- **Existing brand assets?** The `sky-portfolio` aesthetic is already its own brand (globe landing, synthwave hues, 3D showcases). TBD: does "Synth City Digi Labs" get a **new logo + wordmark** or adopt the existing visual language?
- **Aesthetic direction (one sentence):** TBD — lean into the name? Current vibe reads synthwave-adjacent; "Synth City Digi Labs" suggests doubling down on neon/cyberpunk/lab-notebook feel.
- **Reference sites?** TBD.
- **Hero / OG images:** Existing Globe works as hero. **OG images need to be generated** — no `og:image` meta found in the repo at a glance; worth an audit.

## 6. Domain & Infra
- **`package.json` fix needed:** `"homepage": "http://jairdreams.com"` — update to `https://synthcitydigilabs.com` before the next CRA build, or relative paths will point to the wrong host.
- **DNS:** Stays on **Cloudflare**.
- **Redirect direction:** **www → apex** (default).
- **Hosting:** TBD — where is `sky-portfolio` deployed now (GitHub Pages? Netlify? Vercel?) and do we migrate to **Cloudflare Pages** with this rebrand? Recommended: yes, Pages (free, preview deploys, CF Analytics integrated).
- **Email:** TBD — **Cloudflare Email Routing** (free forwarding) recommended unless you need to send from the domain.
- **Staging:** TBD — `staging.synthcitydigilabs.com` on a `staging` branch + CF Pages previews on PRs.

## 7. Analytics & Monitoring
- **Analytics:** **Cloudflare Web Analytics** (free, privacy-friendly). TBD: anything in the repo now? Didn't spot GA/Plausible on a quick scan.
- **Error monitoring:** Skip for a static React build — no backend to watch unless the contact form gets added.
- **Uptime:** **Cloudflare Health Checks** or UptimeRobot free tier.

## 8. SEO & Social
- **sitemap.xml / robots.txt / RSS:** TBD — check `public/`. If missing, add: sitemap (build-time generator), robots.txt (allow all), RSS for the PokeMMO Journal / Lab Notes.
- **Open Graph / Twitter cards:** Needs audit — likely missing per-route OG images. Minimum: set defaults in `public/index.html` and per-page overrides via `react-helmet-async` (not currently a dep — add it).
- **schema.org:** **Organization** on home, **Article** on each blog post, **Person** if you keep a personal About page.

## 9. Performance & A11y Targets
- **Lighthouse:** Target **95+**. There's already a `Lighthouse-Results.md` in this plan folder — use it as the baseline. CRA builds tend to ship big bundles; may need route-level code-splitting for the 3D-heavy pages if scores are low.
- **WCAG:** **AA**.
- **Devices/browsers:** Evergreen Chromium/Firefox/Safari + iOS Safari + Chrome Android.

## 10. Workflow & Team
- **Contributors:** TBD — solo?
- **Version control:** **GitHub** (already a git repo; confirm remote).
- **CI/CD:** If moving to Cloudflare Pages, its previews are enough. Add a GitHub Action for `npm run build` + lint on PRs.
- **Branching:** TBD — currently working on `main` with WIP commits. Recommend: `main` (prod) + `staging` + feature branches.

## 11. Timeline & Milestones
- **Target launch date:** TBD.
- **Hard constraints:** TBD.
- **MVP for rebrand launch (suggested):**
  1. Update `package.json` homepage + any hardcoded `jairdreams.com` refs.
  2. Decide page list — prune or rename for the new brand.
  3. Logo/wordmark for Synth City Digi Labs.
  4. OG images + per-route meta.
  5. sitemap + robots + RSS.
  6. Move hosting to Cloudflare Pages.
  7. DNS cutover.
- **Nice-to-haves:** CRA → Vite migration, contact form, newsletter, Lighthouse tuning per `performance-budget-plan.md`.

## 12. Budget / Limits
- **Cloudflare free tier:** Yes (Pages + Web Analytics + Email Routing + Health Checks all free).
- **Paid services budgeted?** TBD. Likely: domain renewal, Resend (if contact form), Google Workspace (if sending mail from the domain).

---

## Open Decisions Blocking Work
Minimum needed before the rebrand plan is actionable:
1. **§1** — which existing pages stay under `synthcitydigilabs.com`, which get cut.
2. **§2** — CRA stay or Vite migration (blocks §9 perf work either way).
3. **§5** — new logo/wordmark, or reuse current visual language.
4. **§6** — current host, and are we moving to Cloudflare Pages.
5. **§11** — launch target.

Everything else can run on defaults and be revised in place.
