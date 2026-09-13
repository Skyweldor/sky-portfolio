# Medabot iso sprites

Isometric sprites for **22 Medabots**, built so that parts from different bots **stack into
custom builds**. Three sets, each in two mirrored facings:

| set | what | framing | count |
|---|---|---|---|
| `body` | the whole bot | **shared camera** | 44 |
| `regular` | each part alone, as a layer | **shared camera** | 220 |
| `portrait` | each part alone, as a showcase | framed on the part | 132 |

**396 sprites, 512 px, 53.3 MB.** Parts are **head, arms, legs**, and every bot is **aligned at the
neck** so that any head seats on any body — see *Alignment*.

Open [`index.html`](index.html) to review. It opens on a **build-a-bot composer**: pick any head, arms and
legs, where the pickers are the portraits and the stage stacks the regular layers. Below that is a
catalogue of all three sets. `R` randomises a build and `F` flips the facing. It is also published as an
Artifact: <https://claude.ai/code/artifact/9c1b7fad-c9f7-4837-867d-983ad3d0ff19>

**State, decisions and next steps:** [`../MEDABOT_HANDOFF.md`](../MEDABOT_HANDOFF.md).
Method: [`../ISO_SPRITE_PIPELINE.md`](../ISO_SPRITE_PIPELINE.md), Stage 10.
Sibling set: [`../digimon_sprites/`](../digimon_sprites/README.md).

```
medabot_sprites/
├─ bottom_right/body/<Bot>.png
├─ bottom_right/regular/{head,arms,legs,arms_back,arms_front}/<Bot>.png
├─ bottom_right/portrait/{head,arms,legs}/<Bot>.png
├─ bottom_left/…                          same tree, mirrored facing
├─ manifest.json                          every number a consumer needs
├─ scene_meta.json                        per-bot build facts, joints, alignment move
├─ convert_report.json                    the 9 rip conversions and their self-checks
├─ medabot_iso.blend                      22 bots as head / legs / arms_px / arms_nx, aligned
├─ _thumbs/…  index.html  _artifact/      the review sheet
├─ _review/                               part maps, mixed builds, contact strips
└─ tools/                                 the whole pipeline, re-runnable
```

## Roster and sources

| | bots | from |
|---|---|---|
| original 13 | Arcbeetle, Aviking, Black-Stag, Blakbeetle, Metabee, Multikolor, Peppercat, Phoenix, Rhinorush, Roks, Tinpet (Female), Tinpet (Male), Totalizer | `mons_sized/medabots/`, unchanged |
| **re-converted** | Baroncastle | its rip. The old GLB lost both arms in conversion and is kept in `mons_sized/medabots/_quarantine/` |
| **new 8** | Attack-Tyrano, Brass, Dr__Bokchoy, Hippopo, Krosserdog, Neutranurse, Nin-Ninja, Octoclam | GameCube *Medabots Infinity* rips in `new_blender/medabots/` |

The 9 conversions (`tools/convert_rips.py`) reuse `build_digimon_glbs.py`, since these are the same
Models Resource OBJ rips. The script adds a sizing step to the convention every existing Medabot GLB was
measured to follow:

- bounding-box height exactly **1.213 m**, with feet at 0 and centred;
- metallic 0, roughness 0.5, double-sided, NEAREST texture sampling.

Every output passes a re-import self-check: height, floor, centring, all three parts, and textures with
pixels.

Not included: the six Medal GLBs; Rokusho, a rigged single-mesh *ReArise* rip with no part materials; and
the game repo's own copies, which still carry the armless Baroncastle and an empty Neutranurse.

## Parts

Three, by the user's call — which is also how Medabots divides a bot:

| part | is | notes |
|---|---|---|
| **head** | the rip's `head_*` mesh | kept as the source game cut it; on several bots it runs down through the chest armour |
| **arms** | every `*arm*` mesh, both sides | Blakbeetle's left arm is two meshes; Tinpet Male ships both arms as one |
| **legs** | everything else | torso and legs together (`body_*`, `legs_*`, `RefRep_*_Body`, feet, Rhinorush's wheels) |

Parts are assigned by **material name**. Arms are stored as one object per side of the body. Exact
duplicate meshes are dropped, and `build_scene.py` checks every bot's vertex count and bounds through the
rebuild.

## Alignment

**Why.** `mons_sized` sized and centred each bot by its bounding box. Tails pushed bodies forward and horns
pulled them back, so the point where the head meets the body scattered **0.61 m front to back** and 0.23 m
in height. A head from one bot floated off another bot's body.

**What.** `tools/align.py` measures each bot's **neck**: the centroid of the 8% of head vertices nearest the
body, which is where the head actually touches it. `build_scene.py` then translates the whole bot, unscaled,
so that point lands on `REFERENCE_NECK`. That constant is **Tinpet (Male)'s neck** — the frame every
Medabot is built on. It was measured once, is frozen as a constant, and is never re-derived, so adding bots
can never move the ones already aligned.

**Result.** Every neck lands on the reference to **0.00 px**. Two things are accepted costs:

- **Feet no longer share a floor.** They sit between −0.025 m (Hippopo, whose neck is higher than
  Tinpet's) and +0.231 m (Rhinorush) relative to Tinpet's. Full-body sprites are registered to the parts,
  not to one ground line.
- **Arms keep their own anatomy.** Across all 462 arm/legs pairings, a bot's shoulders sit a median
  **0.103 m (28 px)** from another bot's, and the worst pair misses by 0.270 m (Brass arms on Arcbeetle
  legs). Snapping every pair would need per-combination socket offsets, which nothing here models.
  `_review/mixed_builds.png` shows 24 random builds.

Option S (rescale each bot so necks share a height, feet grounded) was considered and not taken, because it
breaks the 1.213 m convention. So was option X (slide level only), which leaves heads ±0.12 m off.

## Stacking parts into a build

Every `body` and `regular` sprite in a facing goes through **one camera**, computed from every bot in the
scene, so a build is just PNGs drawn at 0,0:

```
for a build with head H, arms A, legs L in facing V:
    slot  = manifest.projection.armsBackAfter[V][A]      # null, "legs" or "head"
    order = ["arms_back", "legs", "head", "arms_front"]  # then move arms_back after `slot`
    draw  V/regular/<layer>/<bot>.png  for each layer in order, bot = A for the arm layers
```

**Arms are one part but two layers.** From a 3/4 view one arm is usually behind the body and the other in
front of it. `arms_back` and `arms_front` are assigned by camera depth, per facing, and `regular/arms`
holds both, for a picker.

**The slot of the back arm is measured.** Shoulder-mounted weapons put even the far arm in front of the
body, so the back arm is drawn after the legs for Arcbeetle, Metabee and Rhinorush in bottom_right, and for
Rhinorush in bottom_left. In a **mixed** build, use the slot of the bot the **arms** came from.

`trimRect` (x0, y0, x1, y1 from the top-left, exclusive) gives each layer's tight box, so an atlas can pack
the mostly-empty canvases and still place them by offset.

## Format

| | |
|---|---|
| Projection | true isometric, **35.264°** elevation |
| Facings | `bottom_right` yaw **315°**, `bottom_left` yaw **45°**; the sun mirrors, never rotates |
| Shared camera | ortho **1.91676 m** (bottom_right) / **1.92338 m** (bottom_left), i.e. 267.1 / 266.2 px/m |
| Portraits | the part fills 84% of its canvas, centred |
| Resolution | 512 × 512 PNG, RGBA, 8-bit |
| Alpha | **straight**, measured. Load with `premultipliedAlpha: false` |
| Edges | RGB dilated 8 iterations into the transparent region |
| Colour | `Standard` view transform |

## Verified

`tools/verify.py`, all passing on the full roster:

| check | result |
|---|---|
| facings hold the same sprites | `set(a) ^ set(b)` empty |
| count matches the part list | 396 files = 396 manifest rows = 396 expected |
| every render has real pixels | lowest coverage 0.92% (a Tinpet `arms_back`, a thin frame arm) |
| registration | one ortho scale per facing across every body and regular sprite |
| restack | a bot's own layers rebuild its full-body silhouette with **0.000%** alpha error, on all 44 |
| draw order | 199 overlapping layer pairs, **0** where the full render disagrees |
| **every neck on the reference** | worst **0.00 px** |
| feet / arm fit | reported: see *Alignment* |
| sun mirrors | 20 of 22 bots swap their lit side; Black-Stag and Metabee are too symmetric to show it |
| dilation | opaque pixels round-trip byte-exact |
| straight alpha | ratio 1.003 at mean alpha 0.499 |

Shade differs from the full render on up to 3.85% of pixels (Totalizer), because a part rendered alone
receives no shadow from the part beside it. In a mixed build, a shadow cast by an absent part would be
wrong.

## Rebuilding

```bash
B="C:/Program Files/Blender Foundation/Blender 5.1/blender.exe"
"$B" -b --factory-startup -P tools/convert_rips.py    # only when adding rips; --only <Id>
"$B" -b --factory-startup -P tools/build_scene.py     # 22 GLBs -> aligned medabot_iso.blend, 2 s
"$B" -b medabot_iso.blend -P tools/medabot_sprites.py # 396 sprites, ~195 s
"$B" -b --factory-startup -P tools/make_thumbs.py
"$B" -b --factory-startup -P tools/verify.py
"$B" -b --factory-startup -P tools/mixed_builds.py    # _review/mixed/, then tile with contact.py
python tools/build_sheet.py
```

`medabot_sprites.py` takes `--only`, `--sets`, `--views`, `--out` and `--manifest 0`. A partial run stays
registered only while the set of bots is unchanged, because the camera comes from every bot in the scene.
`--recomposite` re-derives the restack check, the arm slots and the part maps from the PNGs on disk.

**Adding a bot** takes three steps:

1. Unpack the rip into `new_blender/medabots/_x/`.
2. Run `convert_rips.py -- --only <Name>`.
3. Re-run the chain above.

The new bot aligns to the frozen reference, the camera is recomputed, and every sprite is re-rendered, so
old and new stay registered.

## Deliberately not here

- **Joint sockets** for the arms — see *Alignment*.
- **A grounded full-body variant** for roster displays, with every bot's feet on one line. Possible, but it
  would no longer stack with the parts.
- **Atlas packing** — `trimRect` is there for it; the display size is not decided.
- The Medals, Rokusho, and the game repo's copies.
