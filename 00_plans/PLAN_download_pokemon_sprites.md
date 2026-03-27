# Plan: Download & Organize All Pokemon Sprites

**Source:** [PokéSprite Gen 8 Overview](https://msikma.github.io/pokesprite/overview/dex-gen8.html)
**Repo:** `msikma/pokesprite` → `pokemon-gen8/regular/`
**Destination:** `blog-posts/sprites/<region>/`
**Total sprites available:** 1,352 (base forms + all variants)

---

## Status: COMPLETE

| # | Region | Dex Range | Sprites | Status |
|---|--------|-----------|---------|--------|
| 1 | Kanto  | #001–#151 | 230     | Done   |
| 2 | Johto  | #152–#251 | 140     | Done   |
| 3 | Hoenn  | #252–#386 | 167     | Done   |
| 4 | Sinnoh | #387–#493 | 146     | Done   |
| 5 | Unova  | #494–#649 | 189     | Done   |
| 6 | Kalos  | #650–#721 | 130     | Done   |
| 7 | Alola  | #722–#809 | 132     | Done   |
| 8 | Galar  | #810–#898 | 190     | Done   |

**Total: 1,324 sprites downloaded (includes base forms + regional/mega/gmax variants)**

---

## Process Per Generation

Each batch follows the same 3-step workflow:

1. **Build Pokedex mapping** — Python dict of `{ 'pokemon-name': dex_number }` for the generation's range
2. **Download sprites** — Query the GitHub Trees API to find all matching filenames (base name + variant prefixes), then fetch each PNG from `raw.githubusercontent.com`
3. **Rename with prefix** — Prepend `{dex_number:03d}_` to each file so sprites sort by Pokedex order (variants share their base form's number)

### Naming Convention

```
{dex_number}_{original-slug}.png

Examples:
  006_charizard.png
  006_charizard-mega-x.png
  006_charizard-gmax.png
  201_unown.png
  201_unown-b.png
```

---

## Folder Structure (Final)

```
blog-posts/sprites/
├── kanto/      # #001–#151  (230 sprites)
├── johto/      # #152–#251  (140 sprites)
├── hoenn/      # #252–#386  (167 sprites)
├── sinnoh/     # #387–#493  (146 sprites)
├── unova/      # #494–#649  (189 sprites)
├── kalos/      # #650–#721  (130 sprites)
├── alola/      # #722–#809  (132 sprites)
└── galar/      # #810–#898  (190 sprites)
```

---

## Notes

- All sprites are small pixel-art PNGs (~200–2,000 bytes each). Full set is under 5 MB total.
- No rate-limit concerns with `raw.githubusercontent.com` for this volume.
- The GitHub Trees API (`recursive=1`) is used instead of the Contents API (which caps at 1,000 entries).
- Variant matching: a sprite belongs to a generation if its filename starts with a base Pokemon name from that generation's range (e.g., `charizard-gmax` matches `charizard` → Gen 1).
