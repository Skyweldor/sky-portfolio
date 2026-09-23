# PS1 Digimon harness — source

Source for the harness served from `public/harness/ps1-digimon/`, live at
`/harness/ps1-digimon/`. Standalone: no blog post, route or index entry links to it.

It browses every Digimon DW1ModelConverter pulled off the *Digimon World* (USA) disc -- 125
of them, from 178 model files -- and every distinct animation they carry. The clips have
no names, only the slot number the game stores them under, so the harness doubles as the
tool for working out what each slot is. Loop range, travel distance, sound cues and
texture swaps are the evidence for that.

Deep links open straight onto a clip: `/harness/ps1-digimon/#GREY/27`. The code names a
file and the slot is that file's own slot. Codes that were merged away still work:
`#EGAB/46` opens Gabumon's `#49`, the same animation.

## One entry per Digimon

The game ships trimmed copies of 53 models for NPC and enemy appearances -- the PS1 had
2 MB of RAM, and a wild Digimon needs far fewer clips than a partner. The asset build folds
each copy into its Digimon:

- **Dropped (32)** when it adds nothing: same mesh, same colours, and every clip a
  byte-identical copy of a main-model clip with the same loop range and blink events. The
  sound cues may be a subset -- 12 NPC copies lack one bank-3 cue the main keeps, never
  the reverse, so the main is the fuller version. Dropped codes and their slot maps are
  listed in the manifest's `dropped`.
- **Kept as a variant (21)** when it has anything of its own: a different shape, a
  different UV mapping, a real recolour (Vegiemon's is a full palette swap), or clips the
  main model lacks (Monzaemon's has 5). The sheet shows a variant row; chips drawn dashed
  play on a different variant, and tapping one switches to it.

**Slot numbers are per file.** An NPC copy often holds the same animation under a different
slot -- its 46-49 are the main model's ~47-61 -- so the merged list keys each clip by its
main-model slot and records every file's own slot in `clips[].on`. Never carry a slot
number from one variant to another.

## Rebuilding

Two independent steps. Assets rarely change; the page changes more often.

```bash
npm install

# 1. assets: 146 GLBs + event sidecars + manifest.json -> public/harness/ps1-digimon/
node tools/build-assets.mjs            # ~95 s; --only ANGE,VEGI --dry-run to measure first
node tools/verify-assets.mjs           # manifest vs files on disk; exits non-zero on mismatch

# 2. page
npm run build                          # emits dist/index.html + dist/assets/ only
```

Then copy `dist/` over `public/harness/ps1-digimon/`. `publicDir` is `false` for the build,
so the models, events and manifest already there are left alone.

`npm run dev` serves the real assets: in dev, `publicDir` points at
`public/harness/ps1-digimon/`. Open the directory URL `/harness/ps1-digimon/`, not
`.../index.html`, which would hit the previously built copy.

The conversion is deterministic — a re-run produces byte-identical GLBs — so re-running it
does not add to git history unless the output actually changed. A full run also deletes
any GLB or sidecar it no longer writes, such as a variant that is now merged away;
`--only` never deletes (it expands to whole Digimon, so a variant is always judged against
its main model).

## Source data

`build-assets.mjs` reads DW1ModelConverter v1.2.0 output from
`rom_hacks/digimon/converted/output/digimon/` on the A: drive, and the code-to-name table
from the converter's README. The parsed table is cached in `tools/name-map.json`, so a
re-run on a machine without that drive still produces labels.

## What the asset build does, and why

491 MB of glTF in, 45.4 MB of GLB out (51.8 MB before the 32 duplicate copies were
merged away), with no lossy mesh or texture work. Nearly all the weight was animation
keyframes and per-accessor glTF bookkeeping; geometry is ~11 MB and the textures only 2 MB.

- **Harvests animation extras first.** Loop range, sound cues and texture-swap events go to
  `manifest.json` and `events/<CODE>.json`. three.js's `GLTFLoader` never copies
  animation-level extras onto `AnimationClip`, so they would be lost at runtime anyway.
  The converter spells the texture-event source X `srxX`; it is normalised to `srcX` here
  and nowhere else.
- **Hoists constants into the rest pose.** 201,042 of 311,517 channels hold the same value
  in every clip of their model (mostly bone offsets). Those become the node's rest transform
  and leave every clip. This is what makes the JSON chunk smaller than the binary one.
- **Drops channels that never leave rest, then simplifies the rest.** A key is dropped only
  if interpolation between the surviving neighbours reproduces *every* key it spans, with
  separate tolerances per path because the units are mixed (translations in raw PS1 units,
  rotations as quaternions, scales near 1). 5.7 M keys become 1.05 M.
- **Bakes the axis and scale** as an inserted root node `DW1_FIX`: 180° about X (PS1 Y
  points down) and a uniform 1/256 (raw units to metres). A parent, not written onto
  existing nodes, because every node's transform is animation-driven.
- **Never runs `gltf-transform optimize`.** Its defaults join and flatten the node
  hierarchy that *is* the rig, simplify the PS1 silhouettes, and recompress the indexed
  atlases. Textures are never recompressed; six are not 256×128.

## Runtime notes

- **Loop ranges** are played by driving `action.time` by hand, not with
  `AnimationUtils.subclip`: the game plays an intro once, then loops only
  `endlessStart..endlessEnd`. 2,070 clips have a loop range; the rest say nothing, and the
  harness says so rather than inventing one.
- **Root motion** is common: 1,159 clips move the root more than a metre, and GREY slot 27
  walks 442 m over 226 s. *In place* (on by default) pins the root's horizontal travel so
  the clip animates on the spot; off, the camera follows the root. The clip line always
  shows the travel distance.
- **Vertical offsets are the source's.** A clip can sit a model lower or higher than the
  clip it opens with (GREY slot 27 has the feet about 0.35 m under the grid mid-walk). The
  harness stands each model on the grid once, on its first clip, and does not re-seat it
  per clip.
- Textures use `NearestFilter` with no mipmaps. BLEND materials (22 across 18 models) can
  show sorting artifacts; the *depth write* toggle trades one set of artifacts for another.
- `window.__t` is a debug handle: `__t.show('GREY', 27)`, `__t.player.seek(113)`.
