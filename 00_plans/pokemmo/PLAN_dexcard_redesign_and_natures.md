# Plan: DexCard XL Redesign + Kanto Nature Data

**Date:** 2026-03-26
**Status:** Active
**Scope:** Redesign DexCard layout for XL sprites, add vertical text, integrate Kanto nature guide data

---

## Context

- User prefers XL sprites (128px). Current card layout stacks everything vertically (sprite → dex# → name → type badges), which creates too much negative space at larger sizes.
- An Excel file at `blog-posts/kanto_nature_guide.xlsx` contains ideal PokeMMO natures for all 151 Kanto Pokémon.
- The debug sprite-size picker (`?sprite=sm|md|lg|xl`) will remain for now. XL becomes the new default.

---

## 1. DexCard Layout Redesign (All Regions)

### Current layout (vertical stack, centered):
```
┌─────────────────┐
│   ┌─────────┐   │
│   │  SPRITE  │   │
│   └─────────┘   │
│     #001         │
│   Bulbasaur      │
│  [Grass][Poison] │
└─────────────────┘
```

### New layout (horizontal, vertical text on left flank):
```
┌──┬──────────────────┐
│  │   ┌──────────┐   │
│# │   │          │   │
│0 │   │  SPRITE  │   │
│0 │   │  (128px) │   │
│1 │   └──────────┘   │
│  │   BULBASAUR      │
│  │  [Grass][Poison]  │
└──┴──────────────────┘
```

### Design details:

**Left flank (vertical text):**
- Dex number written vertically (`writing-mode: vertical-rl; text-orientation: mixed`)
- Rotated 180° so it reads top-to-bottom: `#001`
- Styled as a thin strip (~20-24px wide) with a subtle left border in the type color
- Font: `Courier New`, ~12px, muted color (#6b7199)
- Background: slightly different shade from card body for visual separation

**Main area (right of flank):**
- Sprite centered, 128px default
- Name below sprite — **increase font to 13px** (from 10px)
- Type badges below name — **increase font to 9px** (from 7px), padding `3px 8px`
- Tighter padding overall: reduce card padding, remove excess margin-bottom on sprite

**Expanded state (click to expand):**
- Category line (existing)
- For Kanto: nature info (role, best nature, alt nature, notes) — see Section 2
- For other regions: just category for now (no nature data yet)

### Files to modify:
- `src/components/blog/DexCard.jsx` — restructure JSX to horizontal layout with left flank
- `src/components/blog/DexCard.module.css` — rewrite layout from flex-column to flex-row + right-side column
- `src/components/blog/PokedexGrid.jsx` — change default size from 'md' to 'xl'
- `src/components/blog/PokedexGrid.module.css` — grid min column update (200px default for XL)

### Responsive behavior:
- At 768px: sprites scale to 96px, flank stays
- At 480px: sprites scale to 68px, flank narrows to 16px, font sizes scale down

---

## 2. Kanto Nature Data Integration

### Data source: `blog-posts/kanto_nature_guide.xlsx`

**Columns in Excel:**
| Column | Example |
|--------|---------|
| # | 1 |
| Pokémon | Bulbasaur |
| Final Form | Venusaur |
| Type | Grass / Poison |
| Role | Sp. Attacker / Tank |
| Best Nature | Modest |
| Boosts | Sp.Atk |
| Lowers | Atk |
| Alt Nature | Timid |
| Alt Boosts | Speed |
| Alt Lowers | Atk |
| Notes | Growth + Giga Drain + Sludge Bomb... |

### Implementation approach:

**Step A: Create `src/data/kantoNatureData.js`**

Parse the Excel → export a lookup object keyed by dex number:

```js
export const KANTO_NATURES = {
  1: {
    role: 'Sp. Attacker / Tank',
    bestNature: 'Modest',
    boosts: 'Sp.Atk',
    lowers: 'Atk',
    altNature: 'Timid',
    altBoosts: 'Speed',
    altLowers: 'Atk',
    notes: 'Growth + Giga Drain + Sludge Bomb. Chlorophyll set prefers Timid.',
  },
  // ... 151 entries
};
```

This is a separate file (not merged into kantoDexData.js) because:
- Nature data is PokeMMO-specific, not general Pokédex data
- Other regions don't have this yet — keeping it separate makes the pattern clear
- DexCard can conditionally import/display it only for Kanto

**Step B: Pass nature data through to DexCard**

- `KantoPokedex.jsx` imports `KANTO_NATURES` and passes it to `PokedexGrid` as a `natureData` prop
- `PokedexGrid` passes the relevant entry to each `DexCard` as `natureInfo={natureData?.[pokemon.id]}`
- `DexCard` renders nature info in the expanded section when available

**Step C: Nature display in expanded card**

When expanded and `natureInfo` exists, show:
```
ROLE: Sp. Attacker / Tank
NATURE: Modest (+Sp.Atk / -Atk)
ALT: Timid (+Speed / -Atk)
─────────────────────
Growth + Giga Drain + Sludge Bomb...
```

Styled as terminal key-value pairs consistent with Layout C aesthetic.

### Files to create:
- `src/data/kantoNatureData.js` — nature lookup object (generated from Excel)

### Files to modify:
- `src/pages/KantoPokedex.jsx` — import and pass nature data
- `src/components/blog/PokedexGrid.jsx` — accept and forward `natureData` prop
- `src/components/blog/DexCard.jsx` — accept and render `natureInfo` prop
- `src/components/blog/DexCard.module.css` — styles for nature info section

---

## 3. Task Breakdown

| # | Task | Owner | Files |
|---|------|-------|-------|
| 1 | Parse Excel → generate `kantoNatureData.js` | Agent A | `src/data/kantoNatureData.js` |
| 2 | Redesign DexCard layout (vertical flank + horizontal) | Agent B | `DexCard.jsx`, `DexCard.module.css` |
| 3 | Update PokedexGrid (default XL, pass natureData) | Agent B | `PokedexGrid.jsx`, `PokedexGrid.module.css` |
| 4 | Wire nature data into KantoPokedex | Agent B | `KantoPokedex.jsx` |
| 5 | Build + verify | Parent | — |

**Dependency:** Task 2-4 can start immediately. Task 1 (data generation) is independent. Final integration needs both done.

---

## 4. What NOT to Do

- Do NOT merge nature data into `kantoDexData.js` — keep it separate
- Do NOT add nature data to other regions yet (only Kanto has the Excel)
- Do NOT remove the debug sprite-size picker — keep it functional, just change the default
- Do NOT delete Layouts A/B code — they are already commented out
