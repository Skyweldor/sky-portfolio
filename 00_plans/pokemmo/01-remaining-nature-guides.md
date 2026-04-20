# Plan: Remaining Region Nature Guide Integration

**Date:** 2026-04-05
**Status:** Pending
**Scope:** Parse Johto / Hoenn / Sinnoh / Unova nature guide spreadsheets into JS data files and wire them into each region's Pokedex page — mirroring the existing Kanto implementation.

---

## Context

The Kanto nature guide is fully implemented end-to-end:

1. **Excel** — `blog-posts/ideal-nature-guides/kanto_nature_guide.xlsx` (151 entries, 12 columns)
2. **JS data** — `src/data/kantoNatureData.js` exports `KANTO_NATURES`, a lookup object keyed by dex number
3. **Page wiring** — `KantoPokedex.jsx` imports the data and passes it as `natureData` to `PokedexGrid`
4. **Display** — `PokedexGrid` and `DexCard` already handle `natureData`/`natureInfo` generically via props (role, best nature, alt nature, notes)

The four remaining guides already have fully populated xlsx files (no gaps, all columns filled):

| Region | File | Dex Range | Rows |
|--------|------|-----------|------|
| Johto  | `johto_nature_guide.xlsx`  | #152–#251 | 100 |
| Hoenn  | `hoenn_nature_guide.xlsx`  | #252–#386 | 135 |
| Sinnoh | `sinnoh_nature_guide.xlsx` | #387–#493 | 107 |
| Unova  | `unova_nature_guide.xlsx`  | #494–#649 | 156 |

No downstream component changes are needed — `PokedexGrid` and `DexCard` already support the `natureData`/`natureInfo` prop pattern.

---

## Steps

### Step 1 — Generate JS data files (4 files)

Parse each xlsx and output a JS module matching the `kantoNatureData.js` format:

| Source xlsx | Output file | Export name |
|-------------|-------------|-------------|
| `johto_nature_guide.xlsx`  | `src/data/johtoNatureData.js`  | `JOHTO_NATURES`  |
| `hoenn_nature_guide.xlsx`  | `src/data/hoennNatureData.js`  | `HOENN_NATURES`  |
| `sinnoh_nature_guide.xlsx` | `src/data/sinnohNatureData.js` | `SINNOH_NATURES` |
| `unova_nature_guide.xlsx`  | `src/data/unovaNatureData.js`  | `UNOVA_NATURES`  |

Each entry follows this shape (identical to Kanto):

```js
<dexNumber>: {
  role: '...',
  bestNature: '...',
  boosts: '...',
  lowers: '...',
  altNature: '...',
  altBoosts: '...',
  altLowers: '...',
  notes: '...',
},
```

Can be done with a Python script using `openpyxl` to read the xlsx and write the JS, or by hand — the Kanto file was generated from the same column layout.

### Step 2 — Wire data into each Pokedex page (4 files)

Add the import + pass `natureData` in each page, following the Kanto pattern:

| Page file | Import | Prop addition |
|-----------|--------|---------------|
| `src/pages/JohtoPokedex.jsx`  | `import { JOHTO_NATURES } from '../data/johtoNatureData'`  | `natureData={JOHTO_NATURES}`  |
| `src/pages/HoennPokedex.jsx`  | `import { HOENN_NATURES } from '../data/hoennNatureData'`  | `natureData={HOENN_NATURES}`  |
| `src/pages/SinnohPokedex.jsx` | `import { SINNOH_NATURES } from '../data/sinnohNatureData'` | `natureData={SINNOH_NATURES}` |
| `src/pages/UnovaPokedex.jsx`  | `import { UNOVA_NATURES } from '../data/unovaNatureData'`  | `natureData={UNOVA_NATURES}`  |

### Step 3 — Build + verify

- `npm run build` — confirm no import errors or bundle issues
- Spot-check each region's Pokedex page in browser: expand a DexCard and confirm nature info renders (role, best/alt nature, notes)

---

## Files to create

- `src/data/johtoNatureData.js`
- `src/data/hoennNatureData.js`
- `src/data/sinnohNatureData.js`
- `src/data/unovaNatureData.js`

## Files to modify

- `src/pages/JohtoPokedex.jsx`
- `src/pages/HoennPokedex.jsx`
- `src/pages/SinnohPokedex.jsx`
- `src/pages/UnovaPokedex.jsx`

## Files unchanged

- `src/components/blog/PokedexGrid.jsx` — already accepts `natureData` prop
- `src/components/blog/DexCard.jsx` — already renders `natureInfo` when present

---

## Task Breakdown

| # | Task | Depends on |
|---|------|------------|
| 1 | Generate `johtoNatureData.js` from xlsx  | — |
| 2 | Generate `hoennNatureData.js` from xlsx  | — |
| 3 | Generate `sinnohNatureData.js` from xlsx | — |
| 4 | Generate `unovaNatureData.js` from xlsx  | — |
| 5 | Wire `JOHTO_NATURES` into `JohtoPokedex.jsx`   | 1 |
| 6 | Wire `HOENN_NATURES` into `HoennPokedex.jsx`   | 2 |
| 7 | Wire `SINNOH_NATURES` into `SinnohPokedex.jsx` | 3 |
| 8 | Wire `UNOVA_NATURES` into `UnovaPokedex.jsx`   | 4 |
| 9 | Build + visual verification | 5–8 |

Tasks 1–4 are fully independent and can run in parallel.
Tasks 5–8 are each a one-line import + one-line prop addition.
