# KayKit iso sprites — 183 assets × 2 facings = 366 PNGs

One transparent isometric sprite per asset per facing, rendered from the **base palette
textures** (the plain kit look, not the tiny-texture retexture — retextured sprites are a
later pass and need nothing but a scene swap in the script).

Scope, as requested: every **building, structure, decoration and unit** in the Medieval
Hexagon pack, plus every **ResourceBit**. No tiles, no nature.

This file covers *this output*. The portable method — how to do the same for another kit —
is `../ISO_SPRITE_PIPELINE.md`.

Two top-level folders, identical inside, one per facing:

| | asset front points toward | yaw |
|---|---|---:|
| `bottom_right/` | the bottom-right corner of the frame | 315° |
| `bottom_left/` | the bottom-left corner | 45° |

| set | folder | sprites | size (per facing) |
|---|---|---:|---:|
| Medieval — buildings (Blue) | `<facing>/medieval/buildings/` | 27 | 4.5 MB |
| Medieval — structures | `<facing>/medieval/structures/` | 20 | 2.9 MB |
| Medieval — decorations | `<facing>/medieval/decorations/` | 35 | 5.2 MB |
| Medieval — units (Neutral) | `<facing>/medieval/units/` | 25 | 3.2 MB |
| ResourceBits | `<facing>/resourcebits/` | 76 | 12.4 MB |
| **total** | | **183 × 2 = 366** | **56.7 MB** |

Open `index.html` (or `python -m http.server 5174 --directory kaykit_sprites`, which is
the `sprite-sheet` entry in `.claude/launch.json`) for a labelled, filterable review sheet
with a **FACING** toggle (or the `F` key) that flips the whole page between the two sets,
plus a background toggle for checking alpha edges. It is self-contained — one 2.2 MB file
with the thumbnails embedded, so it also opens on a phone.

## The format

- **512 × 512 PNG, RGBA, straight (unassociated) alpha.** Verified empirically, not
  assumed: on semi-transparent edge pixels the RGB matches the neighbouring opaque RGB at
  a ratio of 1.003 with no correlation to alpha (a premultiplied file would land at the
  mean alpha, 0.71). So load with `premultipliedAlpha: false`.
- **RGB is dilated 8 px into the transparent region**, so filtering and mipmapping cannot
  pull black in from outside the silhouette. Fully-transparent black pixels drop from
  99.7% to 93.5% of the clear area; opaque and semi-transparent pixels are byte-identical
  to the raw render (the dilation pass round-trips through `Non-Color` +
  `CHANNEL_PACKED`, which is what makes that exact).
- **Ground line is constant**: the bottom of every asset sits 30.7 px (6%) above the
  canvas bottom, so sprites do not bob relative to each other in a list.
- Do **not** basis-compress these — hard edges plus alpha, and a missing WASM module
  discards the texture rather than falling back.

## The projection

**True isometric, 35.264° elevation, in two yaws: 315° and 45°.** Elevation never varies;
yaw takes exactly these two values and nothing else.

- **315° and 45° show the same faces of a building** — the ones facing −X and −Y, which is
  where KayKit puts doors and windows. What changes is which half of the frame each lands
  on, so the front reads toward the bottom-right at 315° and toward the bottom-left at 45°.
  Confirmed on the home, church and lumbermill; 135 / 225 show sides and backs and are not
  used.
- **The geometry rotates; the sun mirrors.** The camera turns 90°, so asymmetric assets
  keep their real handedness — the lumbermill's saw stays on the saw's side, which a
  horizontal image flip would reverse. But the key light is **mirrored** for `bottom_left`
  (`lightMirrorX`, rz → −rz), not rotated with the camera.

  This matters more than it sounds. Because both yaws show the same −Y front wall,
  rotating the rig 90° swings the key onto the blank side wall and leaves the doors and
  windows in shadow — that was the first version of this set, and it read as the wrong
  side of the building being lit. Mirroring keeps the front the lit face in both facings.
  Measured on the lumbermill, left-third vs right-third luminance goes 0.371 / 0.444 in
  `bottom_right` and 0.454 / 0.413 in `bottom_left` — the bright side follows the front.

  The consequence is that the key arrives from the upper-left in `bottom_left` and the
  upper-right in `bottom_right`. That is forced, not a choice: lighting a −Y wall means
  lighting it from −Y. A single-sun scene compositing both facings together would want the
  rotated rig instead — set `lightMirrorX` false and re-render.
- Framing is recomputed per facing, so `orthoScale` and `pxPerMeter` differ slightly
  between the two (mean 0.0%, max 3.6% on the widest structures). Read them per sprite.
- The alternative projection is game "2:1" iso at **26.565°** elevation. If the UI ever
  needs that instead, it is `ELEV_DEG` in `tools/iso_sprites.py` and a re-run — about 80
  seconds per facing. Do not mix the two.
- EEVEE, `Standard` view transform (not AgX — palette colours land as authored), fixed
  key/fill sun rig, ambient world at 0.55. Never Workbench: it ignores node trees.

`wall_corner_*` shows its inner curve in both facings — a corner has an inside from every
angle. Gates on `wall_straight_gate` and both fences read clearly either way.

## Framing: per asset, with relative scale kept in the manifest

Each sprite is framed to its own bounding box (86% of the canvas), so every icon fills its
tile. The alternative — one fixed `ortho_scale` for all — preserves relative size but the
spread here is **31×** across the medieval kit alone — the castle at 25 px/m against
`projectile_arrow` at 788 — and **81×** once ResourceBits joins it (`*_Nugget_Small` at
2043 px/m). At a canvas size that makes the castle readable, a small nugget is six pixels.

Nothing is lost by framing individually, because `manifest.json` carries the conversion:

```json
"bottom_right/buildings/lumbermill": {
  "id": "lumbermill", "view": "bottom_right", "yawDeg": 315.0,
  "file": "bottom_right/medieval/buildings/lumbermill.png",
  "worldSizeM": [4.784, 4.162, 5.977], "pxPerMeter": 57.28,
  "orthoScale": 2.55395, "unitM": 3.5, "coverage": 0.2357, "meshes": 3
}
```

Keys are `<facing>/<category>/<id>`, so every asset has two entries.

To draw two sprites at true relative size, scale each by `1 / pxPerMeter`. The review
sheet's **True relative scale** toggle does exactly that, and shows why it is a toggle.

`worldSizeM` is real metres in both kits: medieval is 1 Blender unit = 3.5 m (from the
forest_poc hex pad), ResourceBits is 1 unit = 1.0 m, and the manifest has already
converted. A gold bar is 0.8 m; the castle is 13.9 m tall.

## Names

Filenames are the source asset names with `building_` / `_blue` stripped, so buildings
land on the ids the harness and `hierarchy.json` already use (`lumbermill.png`,
`home_A.png`, `tower_cannon.png`) and should match `plotId` in the PlayCanvas modal —
**verify the plot ids before relying on that**, only `Plot_Home → "home_A"` was ever
confirmed.

Two things to know:

- **`tent` exists twice** — `<facing>/medieval/buildings/tent.png` (the encampment
  building) and `<facing>/medieval/decorations/tent.png` (the prop). The folders keep them
  apart; a flat atlas will need one of them renamed.
- **104 of 183 ids contain uppercase** (`Copper_Bar`, `home_A`, `crate_A_big`). Kept
  as-authored for traceability. Lowercase them at pack time if the pipeline needs it.

## Re-running

```
# in Blender, from kaykit_showcase/kaykit_showcase.blend
SPRITE_SET = "medieval"
exec(open(r"A:\...\kaykit_sprites\tools\iso_sprites.py").read())

# in Blender, from kaykit_forest_resource/kaykit_forest_resource.blend
SPRITE_SET = "resource"
exec(open(r"A:\...\kaykit_sprites\tools\iso_sprites.py").read())
```

Both facings render in one pass: about 100 s for the 107 medieval assets and 70 s for the
76 ResourceBits. That overruns the MCP call timeout — the render keeps going, so watch the
file count on disk rather than re-running. `ONLY = ["lumbermill", ...]` re-renders a
subset; `VIEWS_ONLY = {"bottom_left": {"yawDeg": 45.0, "lightMirrorX": True}}` re-renders
one facing — the value is the full view spec, not a bare yaw.

The script builds its own render scene (`ISO_SPRITE`) from nothing and links the source
objects without copying or moving them, so **neither .blend is modified** — do not save
either file afterwards.

Then `exec(tools/make_thumbs.py)` for the 256 px WebP thumbnails and
`python tools/build_sheet.py` for the review page.

Every render is checked for coverage rather than file size (a black render is not small
on disk — a failed sheet in this project came out at 967 KB). Lowest here is
`units/spear` at 3.5%, which is a spear.

## Not done, deliberately

- **Team colours.** Buildings are Blue only and units are the Neutral set. Red / Yellow /
  Green buildings are the same geometry on a different palette cell, and units add
  `_accent` / `_full` colourways — 4 × 27 + 8 × 25 more assets if the game needs them,
  doubled again by the two facings. One line in `SETS` per collection.
- **Retextured versions.** Point the medieval job at the `RETEX` scene in
  `kaykit_iso/kaykit_retexture.blend` and the resource job at `RETEX_resource`.
- **Atlas packing.** 366 × 512 px will not fit one 2048 atlas — that is 24 atlases at
  full size, or both facings at 128 px in four. Pick the display size first, then downscale from
  these masters; PlayCanvas texture `303882044` / atlas `303882079` is where the existing
  UI sprites live.
- **Tiles and nature**, per the request.

## Files

| | |
|---|---|
| `bottom_right/`, `bottom_left/` | the 366 sprite PNGs, one folder per facing |
| `manifest.json` | projection + per-sprite size, scale, coverage |
| `index.html` | self-contained review sheet (2.2 MB) |
| `_thumbs/` | 256 px WebP, 1.5 MB total, only feeds the sheet |
| `_artifact/sheet.html` | same page as a body-only fragment |
| `tools/iso_sprites.py` | the renderer |
| `tools/make_thumbs.py`, `tools/build_sheet.py` | thumbnails, review page |

Sources: `kaykit_showcase/kaykit_showcase.blend` (`Scene`, untouched master) and
`kaykit_forest_resource/kaykit_forest_resource.blend` (`Scene`). Both hold the original
palette materials — the retextured copies live in their `RETEX*` scenes.
