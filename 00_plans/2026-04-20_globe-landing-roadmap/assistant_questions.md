# Synth City Digi Labs — Scoping Questions

## 1. Site Purpose & Scope
- What is the site? (portfolio, studio/brand landing, multi-page site with blog/devlog, web app, other)
- Primary goal for visitors? (view work, contact us, sign up, buy, read)
- Rough page count at launch? (1, 3–5, 6–15, 15+)

## 2. Tech Stack
- Framework preference? (Astro, Next.js, SvelteKit, Remix, Eleventy, plain HTML+Vite, undecided)
- TypeScript or JavaScript?
- Styling? (Tailwind, vanilla CSS, CSS modules, styled-components, other)
- Any existing repo/scaffolding, or greenfield?

## 3. Content Model
- Where does copy/content live? (hardcoded, Markdown/MDX in repo, headless CMS, Notion, Google Docs)
- Any blog, devlog, or "Lab Notes" section planned?
- Is content likely to change weekly, monthly, or rarely?

## 4. Dynamic Features
- Contact form? If yes, where should submissions go? (email, Airtable, Notion, Discord webhook, other)
- Newsletter signup? If yes, which provider? (Buttondown, Beehiiv, ConvertKit, Mailchimp, none yet)
- Any auth, user accounts, or gated content?
- Any need for edge functions / APIs? (search, AI endpoints, form handlers)

## 5. Design & Assets
- Existing brand assets? (logo, typography, color palette, Figma file)
- Aesthetic direction in one sentence? (e.g., "synthwave neon", "brutalist mono", "clean editorial")
- Any reference sites I should match vibe-wise?
- Are hero/OG images ready, or do we need to generate them?

## 6. Domain & Infra
- Confirmed: synthcitydigilabs.com registered on Cloudflare — DNS stays with Cloudflare?
- Want www → apex redirect, or apex → www?
- Email on this domain? (Google Workspace, Fastmail, Proton, forwarding only, none)
- Staging subdomain preferred? (e.g., staging.synthcitydigilabs.com, preview.*)

## 7. Analytics & Monitoring
- Analytics? (Cloudflare Web Analytics, Plausible, Fathom, GA4, none)
- Error monitoring? (Sentry, none)
- Uptime monitoring? (Cloudflare, UptimeRobot, none)

## 8. SEO & Social
- Need sitemap.xml, robots.txt, RSS feed?
- Open Graph / Twitter card defaults ready?
- Any schema.org structured data needs? (Organization, Person, Article)

## 9. Performance & A11y Targets
- Lighthouse targets? (defaulting to 95+ across the board unless told otherwise)
- WCAG compliance target? (AA is default)
- Any specific devices/browsers to optimize for?

## 10. Workflow & Team
- Solo dev, or collaborators contributing?
- Version control host? (GitHub, GitLab, Cloudflare's own)
- CI/CD preference beyond Pages' built-in previews?
- Branching model? (main-only, main + dev, feature branches)

## 11. Timeline & Milestones
- Target launch date?
- Any hard constraints? (event, announcement, client deadline)
- MVP must-haves vs. nice-to-haves?

## 12. Budget / Limits
- Staying on Cloudflare free tier where possible?
- Any paid services already budgeted? (CMS, email, fonts)