# PLAN: Team Showcase — 3D Model Gallery Blog Post

**Created:** 2026-03-27
**Status:** DRAFT
**Route:** `/blog/pokemmo-journal-2` (Entry 002)

---

## Overview

A second PokeMMO Journal entry — *"The Team So Far"* — that showcases the player's current six-mon team using interactive 3D model viewers as the centerpiece of each Pokémon's section. Combines the narrative warmth of `pokemmo-blog-post-1.html` with the terminal-chrome UI of Layout C / the Pokédex pages.

The models are the stars. Each Pokémon gets a dedicated card with a live, rotatable 3D viewer (OBJ from Pokemon Quest), stat breakdown, move list, and brief analysis — wrapped in the same cyberpunk terminal aesthetic the site already uses.

---

## Design Vision

### Hybrid Layout: "Terminal Dossier"

Fuses the editorial blog flow of Journal Entry 001 with the structured key-value panels from LayoutC / KantoPokedex. Think of it as a trainer's terminal pulling up classified dossiers on each party member.

**Page structure (top → bottom):**

```
┌──────────────────────────────────────────────┐
│ SYNTHCITY://pokemmo/journal/002              │  ← Header panel
│  > ENTRY.title  :: The Team So Far           │
│  > ENTRY.date   :: March 2026                │
│  > ENTRY.badges  :: 4 / 8                    │
│  > ENTRY.region  :: KANTO                    │
│  > ENTRY.status  :: PUBLISHED                │
│  █                                           │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ SYNTHCITY://pokemmo/journal/002/intro        │  ← Prose panel
│  // TRANSMISSION                             │
│  > [drop-cap editorial paragraphs]           │
│    Short intro (2-3 paragraphs), same        │
│    Crimson Pro serif voice as Entry 001.     │
│    Sets context: post-Erika, 4 badges,       │
│    team has solidified.                       │
└──────────────────────────────────────────────┘

╔══════════════════════════════════════════════╗
║           TEAM ROSTER (×6 cards)             ║
╚══════════════════════════════════════════════╝

For EACH Pokémon (Blastoise → Beedrill → Mr. Mime → Pidgeotto → Onix → Gloom):

┌──────────────────────────────────────────────┐
│ SYNTHCITY://pokemmo/team/009_blastoise       │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────┐          │
│  │                                │          │
│  │    [3D MODEL VIEWER]           │          │
│  │    OBJ + MTL + texture         │          │
│  │    orbit controls, auto-rotate │          │
│  │    dark bg, type-colored rim   │          │
│  │                                │          │
│  └────────────────────────────────┘          │
│                                              │
│  // IDENTIFICATION                           │
│  > MON.name     :: BLASTOISE                 │
│  > MON.level    :: ~37                       │
│  > MON.nature   :: Quirky                    │
│  > MON.ability  :: Torrent                   │
│  > MON.ivs      :: 15/15/15/15/15/15 (90)   │
│  > MON.happiness :: ██████████████████ 100%  │
│                                              │
│  // MOVESET                                  │
│  ┌──────────┬──────────┐                     │
│  │Rain Dance│Aqua Tail │   ← 2×2 grid       │
│  │Icy Wind  │Shell Smsh│     type-colored    │
│  └──────────┴──────────┘                     │
│                                              │
│  // STATS                                    │
│  HP ████████████████████████  113             │
│  ATK ██████████████████       75              │
│  DEF ████████████████████     88              │
│  SPA ██████████████████       76              │
│  SPD ████████████████████     88              │
│  SPE ██████████████████       75              │
│                                              │
│  // FIELD_NOTES                              │
│  > [1-2 paragraphs of analysis, same         │
│    editorial voice from Entry 001]           │
│                                              │
│  █                                           │
└──────────────────────────────────────────────┘

... (repeat for all 6 Pokémon) ...

┌──────────────────────────────────────────────┐
│ SYNTHCITY://pokemmo/journal/002/closing      │  ← Closing panel
│  // TRANSMISSION_END                         │
│  > [1-2 closing paragraphs]                  │
│  > Next → Lt. Surge / S.S. Anne / ???        │
│  ■ 4 / 8 BADGES   [Kanto]                   │
│  █                                           │
└──────────────────────────────────────────────┘
```

---

## 3D Model Strategy

### Source: Pokemon Quest OBJ files

- **Format:** `.obj` + `.mtl` + `.png` texture — the simplest, most web-friendly of the three available sets
- **Why Quest:** Low-poly blocky style loads fast, renders clean, and has a charming aesthetic that fits the site's vibe. XY FBX files would need conversion; Stadium 2 DAE files have complex multi-texture setups. Quest OBJs are plug-and-play.
- **Available models (14 files, all 6 team members + their full lines):**
  - 009_blastoise (+ 007_squirtle, 008_wartortle)
  - 015_beedrill (+ 013_weedle, 014_kakuna)
  - 122_mr-mime
  - 017_pidgeotto (+ 016_pidgey, 018_pidgeot)
  - 095_onix
  - 044_gloom (+ 043_oddish, 045_vileplume)

### Rendering Approach

**Option A — React Three Fiber (recommended)**
- Already have `three` as a dependency (used for the globe landing page)
- Add `@react-three/fiber` + `@react-three/drei` for declarative Three.js in React
- `<Canvas>` + `<OrbitControls>` + OBJ/MTL loader per card
- Lazy-load each viewer with `React.lazy` + `Suspense` to avoid 6 simultaneous canvas boots
- Auto-rotate with user override on drag

**Option B — model-viewer web component**
- Google's `<model-viewer>` supports OBJ → glTF conversion
- Would require a build step to convert OBJ → GLB first
- Simpler code but less control over the cyberpunk styling

**Recommendation: Option A.** We already have Three.js, and R3F gives us full control over lighting, background color, type-colored rim lights, and camera framing per Pokémon.

### Per-Model Viewer Spec

```
- Canvas size: 100% width, ~300px height (responsive)
- Background: match terminal panel bg (#000a19)
- Lighting: ambient (dim) + directional (45° from top-right)
- Rim light: tinted to the Pokémon's primary type color
- Camera: auto-orbit (slow), user can drag to rotate
- Controls: orbit only (no zoom/pan for simplicity)
- Loading: skeleton placeholder with blinking cursor
- Fallback: static PNG texture render if WebGL unavailable
```

---

## Assets Pipeline

### Step 1: Extract & stage models → `public/models/team/`

```
public/
  models/
    team/
      blastoise/
        blastoise.obj
        blastoise.mtl
        blastoise.png
        blastoise-shiny.obj   (optional, fun toggle)
        blastoise-shiny.mtl
        blastoise-shiny.png
      beedrill/
        ...
      mr-mime/
        ...
      pidgeotto/
        ...
      onix/
        ...
      gloom/
        ...
```

Each zip from `blog-posts/models/kanto/pokemon-quest/` gets extracted, renamed to clean lowercase slugs, and placed in `public/models/team/` for static serving.

### Step 2: Verify renders

- Quick smoke test: load each OBJ in a throwaway R3F canvas to check texture mapping, scale, orientation
- Adjust camera distance per model (Onix is long, Mr. Mime is small, etc.)

---

## Component Architecture

### New Files

| File | Purpose |
|------|---------|
| `src/pages/PokeMMOJournal2.jsx` | Page component for Entry 002 |
| `src/pages/PokeMMOJournal2.module.css` | Page-level styles (extends terminal aesthetic) |
| `src/components/blog/TeamRosterCard.jsx` | Reusable team member card with 3D viewer |
| `src/components/blog/TeamRosterCard.module.css` | Card styles (stat bars, move grid, type colors) |
| `src/components/blog/PokemonModelViewer.jsx` | R3F canvas wrapper for loading/displaying OBJ models |
| `src/components/blog/PokemonModelViewer.module.css` | Viewer container styles |
| `src/data/teamRosterData.js` | Static data: all 6 team members' stats, moves, notes, model paths |

### Reused Existing Pieces

- Terminal panel chrome (`.terminalPanel`, `.titleBar`, etc.) — replicate from KantoPokedex/LayoutC CSS
- Section headers with `::after` line
- CRT scanline overlay
- Type badge colors (already defined in DexCard)
- NavBar component
- Back-to-blog link pattern

### Data Shape (`teamRosterData.js`)

```js
export const TEAM_ROSTER = [
  {
    id: 'blastoise',
    dexNum: '009',
    name: 'Blastoise',
    level: 37,
    nature: 'Quirky',
    ability: 'Torrent',
    types: ['water'],
    ivs: { hp: 15, atk: 15, def: 15, spa: 15, spd: 15, spe: 15 },
    ivTotal: 90,
    happiness: 100,
    stats: { hp: 113, atk: 75, def: 88, spa: 76, spd: 88, spe: 75 },
    moves: [
      { name: 'Rain Dance', type: 'water' },
      { name: 'Aqua Tail', type: 'water' },
      { name: 'Icy Wind', type: 'ice' },
      { name: 'Shell Smash', type: 'normal' },
    ],
    modelPath: '/models/team/blastoise/',
    modelFile: 'blastoise.obj',
    notes: `Shell Smash is a massive pickup — +2 Atk, Sp.Atk, and Speed in one turn...`,
  },
  // ... 5 more
];
```

---

## Styling Details

### Type Color Palette (expanded from existing DexCard)

| Type | Color | Usage |
|------|-------|-------|
| Water | `#5b8cff` | Blastoise rim light, move badges, stat accents |
| Bug | `#8bc34a` | Beedrill |
| Poison | `#ab47bc` | Beedrill (secondary), Gloom (secondary) |
| Psychic | `#ff6090` | Mr. Mime |
| Normal | `#9e9e9e` | Pidgeotto |
| Flying | `#80d8ff` | Pidgeotto (secondary) |
| Rock | `#a1887f` | Onix |
| Ground | `#d4a574` | Onix (secondary), Gloom |
| Grass | `#66bb6a` | Gloom |
| Ice | `#80deea` | Icy Wind move badge |
| Fairy | `#f48fb1` | Mr. Mime (secondary) |

### Stat Bar Rendering

- Max stat reference: ~130 (for bar scaling)
- Bar color: type-primary for that Pokémon
- Bar background: `rgba(255,255,255,0.05)`
- Font: Courier New monospace, 12px
- Format: `HP ████████████░░░░░░░░ 113`

### Move Grid

- 2×2 grid of small terminal-style badges
- Each badge tinted to the move's type color
- Hover: slight glow matching type

### Happiness Bar

- Full block characters (█) for filled, empty blocks (░) for remainder
- Green (#28c940) when 100%, gradient for lower values

---

## Implementation Order

### Phase 1: Assets & Data
- [ ] Extract Pokemon Quest zips for the 6 team members → `public/models/team/`
- [ ] Create `teamRosterData.js` with all stat/move/note data
- [ ] Verify OBJ files load correctly in a test R3F canvas

### Phase 2: 3D Viewer Component
- [ ] Install `@react-three/fiber` + `@react-three/drei`
- [ ] Build `PokemonModelViewer.jsx` — loads OBJ+MTL, renders with orbit controls
- [ ] Handle loading state (blinking cursor skeleton)
- [ ] Handle WebGL fallback (static image)
- [ ] Tune lighting and camera per model dimensions

### Phase 3: Team Roster Card
- [ ] Build `TeamRosterCard.jsx` — combines model viewer + stats + moves + notes
- [ ] Style stat bars, move grid, happiness bar
- [ ] Type-colored accents per card

### Phase 4: Journal Page
- [ ] Build `PokeMMOJournal2.jsx` — header panel, intro prose, 6 roster cards, closing
- [ ] Add route to `siteRoutes.js`
- [ ] Add entry to `blogPostData.js`
- [ ] Write intro and closing prose (human voice, matching Entry 001 tone)

### Phase 5: Polish & Performance
- [ ] Lazy-load model viewers (only boot canvas when card scrolls into view)
- [ ] Intersection Observer for viewer activation
- [ ] Test mobile (touch orbit controls, canvas sizing)
- [ ] Responsive breakpoints for stat bars and move grids
- [ ] Reduced motion: disable auto-rotate, hide scanlines

---

## Open Questions

1. **Shiny toggle?** Each Quest zip includes shiny variants. Could add a small toggle per card to swap textures. Fun but scope creep — defer?
2. **Evolution line?** We have full evo lines (Squirtle → Wartortle → Blastoise). Could show a mini gallery or "evolution timeline" per card. Same question — save for v2?
3. **XY / Stadium 2 models?** Higher-fidelity alternatives exist. Could offer a "model source" selector. But Quest's low-poly style is fast and charming. Park this.
4. **Prose authoring:** The intro and closing paragraphs should be human-written to match the voice in Entry 001. I'll draft scaffold text but the user should finalize.

---

## Reference Files

| What | Path |
|------|------|
| Journal Entry 001 (style reference) | `blog-posts/pokemmo-blog-post-1.html` |
| Layout C component | `src/components/blog/BlogDetailLayoutC.jsx` |
| Layout C styles | `src/components/blog/BlogDetailLayoutC.module.css` |
| Kanto Pokédex page | `src/pages/KantoPokedex.jsx` |
| Kanto Pokédex styles | `src/pages/KantoPokedex.module.css` |
| DexCard (type colors) | `src/components/blog/DexCard.jsx` |
| Blog data | `src/data/blogPostData.js` |
| Routes config | `src/config/siteRoutes.js` |
| Quest models (source) | `blog-posts/models/kanto/pokemon-quest/` |
| XY models (backup) | `blog-posts/models/kanto/pokemon-xy/` |
| Stadium 2 models (backup) | `blog-posts/models/kanto/pokemon-stadium-2/` |
