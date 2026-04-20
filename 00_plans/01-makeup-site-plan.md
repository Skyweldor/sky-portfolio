# ELEVATE — Front-End Improvement Plan

**Date:** March 26, 2026 (revised March 28, 2026)
**Scope:** Landing page audit and remediation — originally based on screenshot review, revised with code-level findings

---

## 1. Critical Bugs (Fix Immediately)

### 1.1 Broken Product Image in Promo Banner
The "Explore from 20% Off" section renders a broken `<img>` tag — the alt text "Featured Product" is visible alongside a broken-image icon. The large pink circle appears to be a decorative CSS element that has shifted out of alignment, overlapping the footer content below it.

**Action:**
- Verify the image `src` path is correct and the asset exists in the build.
- Add a fallback/placeholder image via `onerror` or CSS `background-image` so the layout never shows a broken icon.
- Constrain the decorative circle with `overflow: hidden` on the parent container so it cannot bleed into the footer.

### ~~1.2 Duplicate Product Card~~ (Corrected)
**Original finding:** The "Top-Selling Kits" grid appeared to show "Luxury Skincare & Makeup Kit" twice.

**Correction (code review, March 28):** The `kitsData` array in `KitsCarousel.jsx` contains unique entries. The cards *appeared* identical in the screenshot because they all share broken placeholder image paths (`"path-to-luxury-kit.jpg"`, `"path-to-everyday-kit.jpg"`), making them visually indistinguishable. This is not a duplication bug — it is a symptom of 1.3 (missing images). No deduplication needed.

**Action:**
- Resolves automatically when 1.3 is addressed — each card will look distinct once real product images are populated.

### 1.3 Missing Card Images in "Top-Selling Kits"
All three kit cards show large empty space above the text overlay. The product images either failed to load or were never assigned. The cards currently render as ~50% dead space.

**Action:**
- Replace placeholder strings in `KitsCarousel.jsx` (`"path-to-luxury-kit.jpg"`, `"path-to-everyday-kit.jpg"`) and `FeaturedSplit.jsx` (`"path-to-focal-product.jpg"`) with real image paths. Product data is hardcoded in these React components — there is no CMS.
- Add `loading="lazy"` and explicit `width`/`height` attributes to prevent layout shift.
- Consider a skeleton loader or blurred placeholder (`blur-up`) while images load.

---

## 2. Layout & Structural Issues

### 2.1 Hero Section — Overlapping Cards Feel Unintentional
The "Your Everyday Glamour" text card and the "Featured Lipstick" product card overlap each other on a marble background. The overlap reads as a z-index accident rather than a deliberate design choice — neither card has a strong enough drop shadow or offset to sell the layered effect.

**Recommendations:**
- **Option A (Clean separation):** Place the two cards side by side on larger screens (e.g., `grid-template-columns: 1fr 1fr` with a gap). Let the marble texture remain as the section background.
- **Option B (Intentional overlap):** If layering is desired, increase the z-offset, add a pronounced `box-shadow` to the top card, and stagger them with more deliberate asymmetry so it reads as a designed composition.
- In either case, ensure the hero section has a clear single CTA hierarchy — right now "Shop Now" and the lipstick card compete for attention.

### 2.2 Footer Content Obscured
The "Makeup Collections" section text is partially hidden behind the large decorative pink circle element that overflows from the promo section above. The visible text is clipped mid-sentence: *"E... aging, and personalized purchasing options. Pay via Zelle or meet us in person!"*

**Action:**
- Add `position: relative; z-index: 1;` to the footer/collections section so it stacks above the decorative element.
- Add `overflow: hidden` to the promo banner's container to clip the circle within bounds.

### 2.3 Announcement Ticker Clipped + Deprecated Element
The scrolling banner ("★ New Arrivals in Stock ★ Grab Our Lim...") is cut off on the right edge without completing its message. **Code review revealed the ticker uses a literal `<marquee>` HTML element** (`HeroSection.jsx:124`), which is deprecated and has poor accessibility/cross-browser support.

**Action:**
- Replace the `<marquee>` element with a CSS `@keyframes` animation (translateX loop) or a JS-based ticker library.
- Duplicate the text node so the animation loops seamlessly with no visible gap or clipping.
- Add `aria-live="polite"` or a pause-on-hover mechanism for accessibility.

---

## 3. Visual Design & Polish

### 3.1 Typography Hierarchy Needs Tightening
The page uses multiple font weights and sizes without a clear system. "Your Everyday Glamour" uses a serif display font, "Top-Selling Kits" uses a different serif, and body text mixes sans-serif weights.

**Recommendations:**
- Define a strict type scale: one display/heading font (serif) and one body font (sans-serif), with no more than 4–5 size steps.
- Ensure the heading font is consistent across the hero, section titles, and card titles.
- Increase body text size to at least 16px for readability on mobile.

### 3.2 CTA Button Inconsistency
There are at least three different button styles on the page: gold-filled buttons ("Shop Now," "Learn More"), an outlined gold button (one of the "Learn More" variants), and a red/burgundy button ("Explore Now"). This fragments the visual language.

**Recommendations:**
- Standardize on **two button styles max**: a primary (filled, for main CTAs like "Shop Now" and "Explore Now") and a secondary (outlined or ghost, for lower-priority actions like "Learn More").
- Use the brand's gold/tan as the primary button color consistently.
- Ensure all buttons have matching padding, border-radius, font-size, and hover states.

### 3.3 Card Design in "Top-Selling Kits"
The three cards use a tan/beige textured background that looks like a parchment photo. Combined with the missing product images, the cards feel incomplete and low-effort.

**Recommendations:**
- Replace the textured background with a clean, solid or subtle gradient background that lets product photography be the hero.
- Add consistent padding, a subtle border or shadow, and hover interaction (slight scale or shadow lift).
- Ensure text contrast meets WCAG AA — white text on the current tan background may fail contrast checks.

### 3.4 Color Palette Refinement
The site mixes pink marble, dark brown/maroon nav text, gold buttons, beige cards, a dark charcoal announcement bar, and a burgundy "Explore Now" button. The palette is pulling in too many directions.

**Recommendation:** Consolidate to a defined palette of no more than 5 colors:
- Primary: warm rose/blush (from the marble hero)
- Secondary: rich gold/champagne (for CTAs and accents)
- Neutral: soft cream + charcoal (for backgrounds and text)
- Accent: deep burgundy (used sparingly for emphasis)

Define these as CSS custom properties and enforce them site-wide.

---

## 4. Responsiveness & Performance

### 4.1 Mobile Responsiveness Audit Needed
The screenshot appears to be a desktop view. Based on the layout patterns (overlapping absolute-positioned elements, fixed-width cards), this design likely breaks on smaller screens.

**Action:**
- Test at 375px, 768px, and 1024px breakpoints.
- The hero cards should stack vertically on mobile.
- The "Top-Selling Kits" grid should collapse to a single column or horizontal scroll on small screens.
- The announcement ticker should remain readable and not overlap nav elements.

### 4.2 Image Optimization
The hero marble background is likely a large raster image. The lipstick product shot also appears to be high-resolution.

**Action:**
- Serve images in WebP/AVIF with `<picture>` fallbacks.
- Use `srcset` to deliver appropriately sized images per viewport.
- Compress all product images to <200KB.
- Add `loading="lazy"` to all below-the-fold images.

### 4.3 Cumulative Layout Shift (CLS)
Missing images and the broken promo section will cause significant layout shift as content loads or fails to load.

**Action:**
- Reserve explicit `aspect-ratio` or `min-height` on all image containers.
- Use skeleton placeholders for dynamic content areas.

---

## 5. UX & Interaction Improvements

### 5.1 No Clear Primary CTA Path
The hero has "Shop Now," each kit card has "Learn More," and the promo has "Explore Now." The user has no clear singular action to take.

**Recommendation:**
- Make the hero's "Shop Now" the dominant CTA — larger, bolder, higher contrast.
- "Learn More" buttons should be visually subordinate (outlined/ghost style).
- Consider adding a sticky header CTA ("Shop Kits") that persists on scroll.

### 5.2 Category Navigation Bar Underutilized
The dark strip with "Luxury Skincare & Makeup Kit ★ Everyday Makeup Kit ★ …" is clickable navigation but looks like a static label. There's no visual affordance indicating these are links.

**Action:**
- Add hover underlines, color change, or cursor pointer.
- Consider making this a horizontally scrollable pill/tab bar with active state highlighting.
- On mobile, this should scroll horizontally with visible overflow indicators.

### ~~5.3 Missing Social Proof & Trust Signals~~ (Removed — out of scope)
**Removed (March 28):** This is a portfolio project, not a live storefront. Fake reviews, star ratings, "X sold" badges, and shipping policy banners don't demonstrate front-end skill — they just add noise without a real backend to support them. Omitted by agreement.

### 5.4 Footer is Minimal (Scaled back)
The footer only shows "© 2023 by JairDreams. All rights reserved."

**Action:**
- Update the copyright year to 2026 (or make it dynamic).
- ~~Add footer sections: Quick Links, Customer Service, Social Media icons, Newsletter signup, and Payment method icons.~~ — Scaled back: as a portfolio piece, a clean footer is fine. Newsletter signup and payment icons imply a live store. Keep it simple.

---

## 6. Accessibility

### 6.1 Color Contrast
- White text on the tan/beige card backgrounds likely fails WCAG AA (4.5:1 for normal text).
- Gold button text on gold backgrounds may also have insufficient contrast.
- Run the entire page through an automated contrast checker and fix all failures.

### 6.2 Alt Text & Semantics
- The broken image already exposes poor alt text ("Featured Product" is vague). All product images need descriptive alt text (e.g., "Luxury Skincare & Makeup Kit — includes cleanser, moisturizer, foundation, and lipstick").
- Verify the page uses semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- Ensure the ticker banner has `aria-live="polite"` or can be paused for screen readers.

### 6.3 Keyboard Navigation
- Verify all interactive elements (buttons, links, nav items) are focusable and have visible focus indicators.
- The scrolling ticker should be pausable on hover/focus.

---

## 7. Code-Level Findings (Added March 28)

Issues discovered via code review that were not visible in the original screenshot audit.

### 7.1 Debug Tint on Particle Overlay — FIXED
`HeroSection.css:86` had `background: rgba(255, 0, 0, 0.1)` on `.particle-overlay` — a leftover debug style that cast a faint red wash over the entire hero section. **Fixed:** changed to `background: transparent`.

### 7.2 Hero Banner Decision — RESOLVED
Two hero implementations exist: `HeroBanner.jsx` (original concept) and `HeroSection.jsx` (current evolution with glass morphism + particles). Both were enabled for visual comparison. **Decision:** `HeroSection` is the keeper. `HeroBanner` remains in the codebase commented out as a historical reference.

### 7.3 CSS Variable Fragmentation
Color definitions are inconsistent across files:
- `HeroSection.css` defines `--metallic-gold: #E2B84B`, `--rose-gold: #EBC9A4`
- `HeroBanner.css` defines `--gold: #cfa16b` (different shade)
- `beautyTheme.js` defines `'color-primary': '#E2B84B'`

**Action:** Consolidate all color definitions into a single source of truth (either `MakeupStyle.css` custom properties or `beautyTheme.js`) and reference consistently. This overlaps with Section 3.4.

### 7.4 Note on Architecture
This is a **React SPA** (React 18, React Router, React Bootstrap). Product data is hardcoded in component files, not sourced from a CMS or API. All fixes should be framed as component/props/CSS changes, not CMS operations.

---

## 8. Recommended Priority Order

| Priority | Item | Section | Status |
|----------|------|---------|--------|
| P0 | Fix broken promo image + overflow | 1.1 | Open |
| ~~P0~~ | ~~Fix duplicate product card~~ | ~~1.2~~ | Not a bug — see 1.2 correction |
| P0 | Populate missing kit images (replace placeholder strings) | 1.3 | Open |
| P0 | Fix footer content obscured by overflow | 2.2 | Open |
| P0 | Remove debug tint on particle overlay | 7.1 | **Fixed** (March 28) |
| P1 | Consolidate CSS variables (single source of truth) | 3.4, 7.3 | Open |
| P1 | Standardize button styles | 3.2 | Open |
| P1 | Typography system cleanup | 3.1 | Open |
| P1 | Mobile responsiveness pass | 4.1 | Open |
| P1 | Replace deprecated `<marquee>` + fix ticker | 2.3 | Open |
| P1 | Color contrast / accessibility fixes | 6.1, 6.2 | Open |
| P2 | Hero section layout refinement | 2.1 | Open |
| P2 | Image optimization pipeline | 4.2 | Open |
| P2 | Category nav bar interactivity | 5.2 | Open |
| P2 | CTA hierarchy refinement | 5.1 | Open |
| P2 | Update footer copyright year | 5.4 | Open |
| P3 | Skeleton loaders / CLS prevention | 4.3 | Open |
| — | ~~Social proof elements~~ | ~~5.3~~ | Removed — out of scope |
| — | ~~Footer expansion (newsletter, payment icons)~~ | ~~5.4~~ | Removed — out of scope |