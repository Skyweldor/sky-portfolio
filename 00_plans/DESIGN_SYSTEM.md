# SynthCity DigiLabs Design System

A comprehensive guide to the branding, design patterns, and visual language for SynthCity DigiLabs Interactive portfolio.

---

## Brand Identity

### Primary Name
- **Brand**: SynthCity DigiLabs
- **Tagline**: Interactive
- **Full Logo Treatment**: "SynthCity DigiLabs" with "Interactive" positioned below-right

### Visual Theme
**Cyberpunk Neon Aesthetic** - A futuristic, digital aesthetic combining dark backgrounds with vibrant neon glows, creating an immersive tech-forward experience.

---

## Color Palette

### Core Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#00b3ff` | Primary cyan - main brand color, links, CTAs, glows |
| `--color-accent` | `#9f00ff` | Violet/Magenta - secondary accent, gradient endpoints |
| `--color-highlight` | `#00eaff` | Bright cyan - emphasis, gradient starts, highlights |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-dark` | `#000000` | Primary backgrounds, sections |
| `--color-bg-panel` | `#121212` | Elevated surfaces, cards, navbar (scrolled) |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-light` | `#ffffff` | Primary text on dark backgrounds |
| `--color-text-dark` | `#b8b8b8` | Secondary/muted text |

### Gradient Definitions

```css
/* Primary Neon Gradient (Cyan → Violet) */
background: linear-gradient(90deg, var(--color-highlight) 0%, var(--color-accent) 100%);

/* Tab/Button Active Gradient (Magenta → Violet) */
background: linear-gradient(90.21deg, #aa367c -5.91%, #4a2fbd 111.58%);

/* Subtitle Glow Colors */
text-shadow: 0 0 6px #ff29ff, 0 0 12px #b000ff, 0 0 24px #7303ff;
```

---

## Typography

### Font Families

| Purpose | Font | Fallback |
|---------|------|----------|
| Headings & Logo | `DotGothic16` | `sans-serif` |
| Body Text | `Centra` | `sans-serif` |
| Luxury/Special | `Playfair Display` | `serif` |

### Font Scale (Responsive with clamp())

| Token | Size Range | Usage |
|-------|------------|-------|
| `--fs-300` | 0.94rem → 0.98rem | Small text, labels |
| `--fs-400` | 1.13rem → 1.31rem | Body text, nav links |
| `--fs-500` | 1.35rem → 1.75rem | Large body, subtitles |
| `--fs-600` | 1.62rem → 2.33rem | Section subtitles |
| `--fs-700` | 1.94rem → 3.11rem | Section headings |
| `--fs-800` | 2.33rem → 4.14rem | Large headings |
| `--fs-900` | 2.8rem → 5.52rem | Hero titles |

### Centra Font Weights
- **400 (Book)**: Body text
- **500 (Medium)**: Emphasized text
- **700 (Bold)**: Headings, buttons

---

## Effects & Treatments

### Neon Glow Effect

The signature SynthCity glow uses layered text-shadows at increasing blur radii:

```css
/* Primary Title Glow (Cyan) */
text-shadow:
    0 0 10px var(--color-primary),
    0 0 20px var(--color-primary),
    0 0 40px var(--color-primary),
    0 0 80px var(--color-primary);

/* Subtitle Glow (Magenta/Violet) */
text-shadow:
    0 0 6px #ff29ff,
    0 0 12px #b000ff,
    0 0 24px #7303ff;

/* Nav Link Glow */
text-shadow:
    0 0 4px var(--color-highlight),
    0 0 8px var(--color-highlight),
    0 0 12px var(--color-accent);
```

### Neon Underline

Used beneath the main logo text:

```css
/* Gradient underline with glow */
height: 4px;
background: linear-gradient(90deg, var(--color-highlight) 0%, var(--color-accent) 100%);
filter: drop-shadow(0 0 6px var(--color-highlight)) drop-shadow(0 0 12px var(--color-accent));
```

### Glass Morphism

Applied to navbar and overlay elements:

```css
background: rgba(0, 0, 0, 0.15);
backdrop-filter: blur(7px) saturate(180%);
-webkit-backdrop-filter: blur(7px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.15);
```

### Hover Transitions

Standard transition timing:
```css
transition: all 0.25s ease;
```

Common hover effects:
- **Buttons**: `transform: translateY(-4px)` + intensified glow
- **Cards**: Height reveal animation (0% → 100%)
- **Links**: Increased text-shadow intensity

---

## Component Patterns

### Logo Component

The SynthCity DigiLabs Interactive logo consists of:
1. **Main Title**: "SynthCity DigiLabs" in DotGothic16 with cyan neon glow
2. **Neon Underline**: Cyan-to-violet gradient bar beneath title
3. **Subtitle**: "Interactive" in DotGothic16 with magenta glow, positioned bottom-right

```
┌─────────────────────────────────────┐
│     SynthCity DigiLabs              │  ← Cyan glow
│     ═══════════════════════════     │  ← Gradient underline
│                      Interactive    │  ← Magenta glow
└─────────────────────────────────────┘
```

### Navigation Bar

**States:**
- **Transparent** (at top): Fully transparent background
- **Glass** (scrolled): Glass morphism with blur

**Features:**
- Fixed position at top
- Scroll progress bar (gradient underline)
- Custom cursor dot effect on hover
- Responsive hamburger menu for mobile

### Project Tabs

**Tab Bar:**
- Rounded container with 10% white background
- 5 equal-width tabs
- Top border on all tabs (50% white opacity)
- Active state: Magenta-violet gradient fill, white border

**Project Cards:**
- Glass morphism overlay on hover
- Text reveal animation (bottom to center)
- Title and description with text-shadow for readability

### Buttons (CTA)

```css
/* Primary CTA Style */
background: transparent;
border: 2px solid var(--color-primary);
border-radius: 6px;
padding: 18px 34px;
font-weight: 700;
letter-spacing: 0.8px;

/* Hover */
transform: translateY(-4px);
box-shadow: 0 0 10px var(--color-primary), 0 0 20px var(--color-primary);
```

---

## Animation Patterns

### Typing Animation
Used for logo reveal:
- 65ms per character
- Subtitle starts 200ms after main title completes

### Float Animation
```css
@keyframes updown {
    0%   { transform: translateY(-20px); }
    50%  { transform: translateY(20px); }
    100% { transform: translateY(-20px); }
}
animation: updown 3s linear infinite;
```

### Scroll Progress
- Uses CSS custom property `--scrollProgress`
- Updates via RAF-throttled scroll listener
- Applied to navbar pseudo-element

---

## Responsive Breakpoints

| Breakpoint | Usage |
|------------|-------|
| `max-width: 427px` | Mobile phones |
| `max-width: 768px` | Tablets, mobile menu |
| `min-width: 1700px` | Large desktop adjustments |

### Mobile Considerations
- Custom cursor hidden on mobile
- Logo subtitle repositioned (static, centered)
- Touch-friendly target sizes (min 44px)
- Reduced motion support for accessibility

---

## Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Background decorations | -4 | Floating color shapes |
| Content | 0 (default) | Main content |
| CTA buttons | 10 | Ensure clickability |
| Navbar | 9999 | Always on top |
| Cursor dot | 10000 | Above navbar |
| Popup overlays | 10001 | Modal close buttons |

---

## File Structure

```
src/
├── styles/
│   ├── global.css              # CSS variables, resets, base styles
│   └── components/
│       ├── navbar.css          # Navigation styles
│       ├── banner.css          # Hero section
│       ├── projects.css        # Project tabs and cards
│       └── skills.css          # Skills carousel
├── themes/
│   ├── portfolioTheme.js       # Main theme config
│   ├── stickerTheme.js         # Sticker shop theme
│   ├── aetherboundTheme.js     # Game theme
│   └── beautyTheme.js          # Beauty section theme
└── assets/
    ├── img/                    # Images, icons, backgrounds
    └── font/                   # Centra font files
```

---

## Usage Guidelines

### Do
- Use CSS variables for all colors
- Apply neon glow effects to key interactive elements
- Maintain dark backgrounds for proper contrast
- Use DotGothic16 for branded headings
- Keep hover effects subtle but responsive

### Don't
- Use pure white (#fff) backgrounds in main portfolio
- Mix font families within single components
- Overuse neon effects (reserve for emphasis)
- Forget mobile responsiveness
- Skip reduced-motion accessibility support

---

*Last Updated: December 2024*
*Version: 1.0*
