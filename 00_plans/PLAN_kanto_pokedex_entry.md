# Plan: Kanto Pokédex — Blog Entry

**Goal:** A visual Pokédex blog entry showcasing all 151 Kanto sprites in the Layout C "Neon Terminal" aesthetic.
**Inspiration:** The PokeMMO journal post (`blog-posts/pokemmo-blog-post-1.html`) for tone/design DNA, and `BlogDetailLayoutC.jsx` for the terminal panel system.

---

## Concept

A standalone blog page styled as a retro terminal Pokédex interface — part reference, part visual showcase. The user lands on what feels like booting up a hacked Pokédex terminal. All 151 base Kanto Pokémon are displayed in a browsable, filterable sprite grid, each card showing the sprite, dex number, name, and type(s). Clicking a card could expand inline details.

This is **not** a catalog detail page — it's a new blog entry type purpose-built for sprite gallery content, reusing Layout C's visual language.

---

## Architecture Decision

**Approach: React page within the existing app** (not standalone HTML)

Rationale:
- Reuses NavBar, routing, transitions, and the existing Layout C design tokens
- Filterable/interactive grid needs JS anyway — React is the right tool
- Future Johto/Hoenn/etc. entries can reuse the same Pokédex component with different data
- Accessible at a route like `/blog/kanto-pokedex`

---

## File Plan

### New Files

| File | Purpose |
|------|---------|
| `src/data/kantoDexData.js` | Array of 151 Pokémon objects (dex#, name, types, sprite path) |
| `src/pages/KantoPokedex.jsx` | Page component — the blog entry itself |
| `src/components/blog/PokedexGrid.jsx` | Reusable sprite grid with filter bar |
| `src/components/blog/DexCard.jsx` | Individual Pokémon card (sprite + info) |
| `src/components/blog/DexCard.module.css` | Card styles |
| `src/components/blog/PokedexGrid.module.css` | Grid + filter bar styles |
| `src/pages/KantoPokedex.module.css` | Page-level layout styles |

### Modified Files

| File | Change |
|------|--------|
| `src/App.js` | Add route: `/blog/kanto-pokedex` → `KantoPokedex` |

---

## Data Shape (`kantoDexData.js`)

```js
export const KANTO_DEX = [
  {
    id: 1,
    name: "Bulbasaur",
    slug: "bulbasaur",
    types: ["Grass", "Poison"],
    sprite: "/blog-posts/sprites/kanto/001_bulbasaur.png",
  },
  // ... 151 entries (base forms only — no megas/gmax/regional)
];

// For type filtering
export const KANTO_TYPES = [
  "Normal","Fire","Water","Grass","Electric","Ice",
  "Fighting","Poison","Ground","Flying","Psychic",
  "Bug","Rock","Ghost","Dragon","Fairy"
];
```

Only base forms (#001–#151, one per dex number). Variants (megas, alola, gmax) are excluded to keep it clean — those can be a future toggle or separate entry.

---

## Page Layout (`KantoPokedex.jsx`)

Structured as a terminal boot sequence, matching Layout C's panel system:

```
┌─────────────────────────────────────────────┐
│  NavBar                                     │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─ TERMINAL PANEL 1: HEADER ────────────┐  │
│  │  ◉ ○ ○  POKEDEX_v1.0 — KANTO         │  │
│  │                                       │  │
│  │  REGION .... Kanto                    │  │
│  │  POKEMON ... 151                      │  │
│  │  SOURCE .... Prof. Oak's Lab          │  │
│  │  STATUS .... [██████████] COMPLETE    │  │
│  │                                       │  │
│  │  > Introductory paragraph in the      │  │
│  │    PokeMMO journal voice. Brief.      │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ TERMINAL PANEL 2: DEX GRID ─────────┐  │
│  │  ◉ ○ ○  DEX_ENTRIES                  │  │
│  │                                       │  │
│  │  [Filter bar: ALL | Fire | Water ...] │  │
│  │  [Search: _____________________ ]     │  │
│  │                                       │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐          │  │
│  │  │ #001 │ │ #002 │ │ #003 │  ...     │  │
│  │  │sprite│ │sprite│ │sprite│          │  │
│  │  │Bulba-│ │Ivy-  │ │Venu- │          │  │
│  │  │saur  │ │saur  │ │saur  │          │  │
│  │  │GRS PS│ │GRS PS│ │GRS PS│          │  │
│  │  └──────┘ └──────┘ └──────┘          │  │
│  │         ... 151 cards ...             │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ TERMINAL PANEL 3: FOOTER ────────────┐  │
│  │  ◉ ○ ○  SYS_LOG                      │  │
│  │                                       │  │
│  │  > Next region: Johto (coming soon)   │  │
│  │  > Sprites sourced from PokéSprite    │  │
│  │  _ (blinking cursor)                  │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Component Details

### DexCard

Each card is a small terminal-styled tile:
- **Sprite** (68×68 rendered, `image-rendering: pixelated` for crisp upscaling)
- **Dex number** — `#001` in `Press Start 2P`, muted color
- **Name** — `Bulbasaur` in accent color
- **Type badges** — small colored pills (reuse existing type color system from pokemmo blog post)
- **Hover effect** — border glow matching primary type color, subtle sprite bounce
- No click interaction in v1 (keep scope tight)

Grid: `auto-fill, minmax(130px, 1fr)` — responsive, ~5-6 per row on desktop, 3 on tablet, 2 on mobile.

### PokedexGrid

- **Type filter bar** — horizontal scroll row of small type buttons. "ALL" selected by default. Click a type to filter. Active button gets type-colored border + glow.
- **Search input** — styled as terminal input (`> search: ___`). Filters by name as you type.
- **Result count** — `SHOWING 151 / 151` updates live as filters apply.
- Smooth CSS transitions when cards filter in/out (opacity + scale).

---

## Type Color Palette

Extend the existing type colors from the PokeMMO blog post to cover all 16 Gen 1 types:

```css
--type-normal:   #9e9e9e;
--type-fire:     #ff6b35;
--type-water:    #5b8cff;
--type-grass:    #8bc34a;
--type-electric: #f5c842;
--type-ice:      #80d8ff;
--type-fighting: #d32f2f;
--type-poison:   #ab47bc;
--type-ground:   #d4a574;
--type-flying:   #80d8ff;
--type-psychic:  #ff6090;
--type-bug:      #9ccc65;
--type-rock:     #a1887f;
--type-ghost:    #7e57c2;
--type-dragon:   #7038f8;
--type-fairy:    #f48fb1;
```

---

## Implementation Order

1. **Data file** — `kantoDexData.js` with all 151 entries + types
2. **DexCard component** — sprite tile with type badges
3. **PokedexGrid component** — grid container + filter bar + search
4. **KantoPokedex page** — terminal panels wrapping the grid, header metadata, intro text
5. **Route** — wire up in `App.js`
6. **Polish** — hover effects, scanlines, responsive breakpoints, reduced-motion support

---

## Scope Boundaries

**In scope:**
- 151 base-form Kanto Pokémon displayed with sprites
- Type filtering + name search
- Layout C terminal aesthetic
- Responsive grid
- Route integration

**Out of scope (future):**
- Click-to-expand card details (moves, stats, abilities)
- Variant toggle (mega/alola/gmax forms)
- Johto/Hoenn/etc. entries (reuse PokedexGrid component later)
- Shiny sprite toggle
- Animated sprite support

---

## Open Questions

1. **Intro text tone** — Match the PokeMMO journal voice (personal, reflective) or keep it more reference/clinical? Leaning toward a short 2-3 sentence journal-style intro, then let the grid speak for itself.
2. **Card click behavior** — Skip for v1, or add a simple expand/tooltip showing one extra detail (e.g., species category like "Seed Pokémon")?
