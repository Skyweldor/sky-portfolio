# Medabot iso sprites

Isometric sprites for **44 Medabots in two series**, built so that parts from different bots
**stack into custom builds**. Three sets, each in two mirrored facings:

| set | what | framing | count |
|---|---|---|---|
| `body` | the whole bot | **shared camera** | 88 |
| `regular` | each part alone, as a layer | **shared camera** | 440 |
| `portrait` | each part alone, as a showcase | framed on the part | 264 |

**792 sprites, 512 px, 103 MB.** Parts are **head, arms, legs**. Three fixed constants in
`tools/align.py` make the parts interchangeable:

- every bot is at **one game scale**;
- every bot is **aligned at the neck**, so any head seats on any body;
- every bot renders through **one frozen camera**, so adding bots never moves a sprite already made.

See *Size and alignment*.

| series | bots | sprites | added |
|---|---|---|---|
| **1** | 22 | 396 | 2026-09-11 |
| **2** | 22 | 396 | 2026-10-08; Oceana 2026-10-09 |

`tools/roster.py` holds the series, and every manifest row carries its bot's `series`.

Open [`index.html`](index.html) to review. It opens on a **build-a-bot composer**: pick any head,
arms and legs, where the pickers are the portraits and the stage stacks the regular layers. Below
that is a catalogue of all three sets.
- **Series:** pickers and catalogue are grouped by series, with a Both / Series 1 / Series 2 filter.
- **Keys:** `R` randomises a build, `M` mixes the two series, `F` flips the facing.
- **Build codes:** every build has a code, `head.arms.legs` ids (e.g.
  `Knight_Armor.Metabee.Pretty_Prime`). It can be copied, pasted back in, or put after the
  artifact link as `#Knight_Armor.Metabee.Pretty_Prime`.

The sheet is published as an Artifact: <https://claude.ai/artifact/LH4Bq8FFFxrb5CSokmNRNG>. The copy
on the public website (`sky-portfolio`) still shows the old Series 1.

**State, decisions and next steps:** [`../MEDABOT_HANDOFF.md`](../MEDABOT_HANDOFF.md).
Method: [`../ISO_SPRITE_PIPELINE.md`](../ISO_SPRITE_PIPELINE.md), Stage 10.
Sibling set: [`../digimon_sprites/`](../digimon_sprites/README.md).

```
medabot_sprites/
├─ bottom_right/body/<Bot>.png
├─ bottom_right/regular/{head,arms,legs,arms_back,arms_front}/<Bot>.png
├─ bottom_right/portrait/{head,arms,legs}/<Bot>.png
├─ bottom_left/…                          same tree, mirrored facing
├─ manifest.json                          every number a consumer needs, and each row's series
├─ scene_meta.json                        per-bot build facts: game scale, joints, alignment move
├─ convert_report.json                    the 31 rip conversions and their self-checks
├─ medabot_iso.blend                      44 bots as head / legs / arms_px / arms_nx, scaled and aligned
├─ _thumbs/…  index.html  _artifact/      the review sheet / harness, grouped by series
├─ _review/                               part maps, mixed builds, contact strips; series2/ for Series 2
└─ tools/                                 the whole pipeline, re-runnable
```

## Roster and sources

| | bots | from |
|---|---|---|
| original 13 | Arcbeetle, Aviking, Black-Stag, Blakbeetle, Metabee, Multikolor, Peppercat, Phoenix, Rhinorush, Roks, Tinpet (Female), Tinpet (Male), Totalizer | `mons_sized/medabots/`; rips in the game repo's `_source_rips/` |
| **re-converted** | Baroncastle | its rip. The old GLB lost both arms in conversion and is kept in `mons_sized/medabots/_quarantine/` |
| **new 8** | Attack-Tyrano, Brass, Dr__Bokchoy, Hippopo, Krosserdog, Neutranurse, Nin-Ninja, Octoclam | GameCube *Medabots Infinity* rips in `new_blender/medabots/` |
| **Series 2** (22) | Aimflash, Belzelga, Boarbooster, Botafly, Bustroyer, Cordy, Drakonfly, Flyfalcon, Fossilkat, Gorem-2, Kingpharaoh, Knight_Armor, Maxsnake, Mega-Emperor, Oceana, Pingen, Poison_Copy, Potatobug, Pretty_Prime, Saldron, Spidar, Uglyduck | *Medabots Infinity* rips in `new_blender/medabots/new-medabots/`, unpacked to `medabots/_x/` |

The first three rows are Series 1. Three Series 2 ids differ from their download labels, by the
user's call (2026-10-08): **Potatobug** ("Jaxy (Potatobug)"), **Aimflash** ("Max (Aimflash)") and
**Poison_Copy** (the download misspells it "Posion Copy"). `roster.RENAMED` keeps the mapping.

The 31 conversions (`tools/convert_rips.py`) reuse `build_digimon_glbs.py`, since these are the same
Models Resource OBJ rips. They write GLBs in the `mons_sized` convention every Medabot GLB follows:

- bounding-box height exactly **1.213 m**, with feet at 0 and centred;
- metallic 0, roughness 0.5, double-sided, NEAREST texture sampling.

Every output passes a re-import self-check: height, floor, centring, all three parts, and textures with
pixels. That 1.213 m is **not** the size the sprites use; see *Size and alignment*.

Not included: the six Medal GLBs; Rokusho, a rigged single-mesh *ReArise* rip with no part materials; and
the game repo's own copies, which still carry the armless Baroncastle and an empty Neutranurse.

## Parts

Three, by the user's call — which is also how Medabots divides a bot:

| part | is | notes |
|---|---|---|
| **head** | the rip's `head_*` mesh | kept as the source game cut it; on several bots it runs down through the chest armour or carries a neck piece (Knight_Armor, Flyfalcon) |
| **arms** | every `*arm*` mesh, both sides | Blakbeetle's left arm is two meshes; Tinpet Male ships both arms as one |
| **legs** | everything else | torso and legs together (`body_*`, `legs_*`, `RefRep_*_Body`, feet, Rhinorush's and Potatobug's wheels, Oceana's tail) |

Parts are assigned by **material name**. Arms are stored as one object per side of the body. Exact
duplicate meshes are dropped, and `build_scene.py` checks every bot's vertex count and bounds through the
rebuild.

The rips' own cuts carry over into Series 2, which has four of note:

- **Botafly** ships its arms, wings and horn as one mesh, so its arms part brings the wings.
- **Aimflash**'s left arm is a shoulder cannon.
- **Saldron**'s head carries a second head-textured piece on the same object, so it stays head.
- **Mega-Emperor**'s head includes tall antennae.

## Size and alignment

**One game scale (2026-10-09).** The rips share one scale and one frame:
- in raw OBJ coordinates every neck sits on the same body axis, about 2 cm front to back;
- raw head heights agree, at a median of 1.72 rip units.

The `mons_sized` rule (bounding box = 1.213 m) instead scaled each bot by `1.213 / its rip height`. That
shrank bots with a spike, tail or antennae (Saldron to 0.72× its game size) and enlarged squat ones
(Spidar to 1.56×), and it was why some heads rode high on other bodies. `build_scene.py` now multiplies each
GLB by `align.game_scale(bot) = RIP_HEIGHT[bot] / RIP_HEIGHT["Tinpet__Male"]`. Every bot is therefore at the
scale of the reference frame, from Spidar ×0.640 to Saldron ×1.385. Tinpet (Male) is untouched at exactly
×1, and with it the neck reference and the camera.

**Neck alignment.** `tools/align.py` measures each bot's **neck**: the centroid of the 8% of head vertices
nearest the body, which is where the head actually touches it. `build_scene.py` then translates the
whole (scaled) bot so that point lands on `REFERENCE_NECK`. That constant is **Tinpet (Male)'s neck**,
the frame every Medabot is built on. It was measured once and is never re-derived.

**The camera is frozen too (2026-10-08).** The shared camera was first fitted to Series 1's union
(`SHARED_FILL` 0.90, `SHARED_BOTTOM` 0.05). It is now the constant `align.FROZEN_CAMERA`: per facing, the
ortho scale and canvas centre, plus the camera's distance and clip range. The distance and clip range move
no pixel, but EEVEE's shading drifts a few levels with them. A bot must land at least `FIT_MARGIN_PX`
(1 px, beyond the reach of EEVEE's 1.5 px pixel filter) inside the canvas, or `medabot_sprites.py` stops
before rendering anything. At game scale the tightest bots are Mega-Emperor (19.4 px, bottom_right) and
Oceana (20.4 px, bottom_left).

**Result.** Every neck lands on the reference to **0.00 px**, on all 44 bots. Two things are accepted costs:

- **Feet do not share a floor.** They sit between −0.388 m (Saldron, whose tail spike hangs below) and
  +0.374 m (Botafly) relative to Tinpet's. Full-body sprites are registered to the parts, not to one
  ground line.
- **Arms keep their own anatomy.** Across all 1,892 arm/legs pairings, a bot's shoulders sit a median
  **0.089 m (24 px)** from another bot's, against 0.108 m at the old bounding-box sizes. Snapping every
  pair would need socket offsets (the tycoon GDD's ticket A-08 has a plan for it).

| arms from → legs from | pairings | median shoulder miss | worst |
|---|---|---|---|
| Series 1 → Series 1 | 462 | 0.089 m (24 px) | 0.289 m, Krosserdog arms on Arcbeetle |
| Series 1 → Series 2 | 484 | 0.091 m (24 px) | 0.344 m, Attack-Tyrano arms on Aimflash |
| Series 2 → Series 1 | 484 | 0.091 m (24 px) | 0.344 m, Aimflash arms on Attack-Tyrano |
| Series 2 → Series 2 | 462 | 0.087 m (23 px) | 0.326 m, Saldron arms on Aimflash |

Aimflash's shoulder cannon fits other bots worst (median 0.300 m), then Arcbeetle's (0.257 m).

Option S (rescale each bot so necks share a height, feet grounded) was considered and not taken. So was
option X (slide level only), which leaves heads ±0.12 m off.

## Stacking parts into a build

Every `body` and `regular` sprite in a facing goes through **one camera**, the frozen one, so a build is just
PNGs drawn at 0,0:

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
body, so the back arm is drawn after the legs:
- in bottom_right, for Arcbeetle, Knight_Armor, Metabee, Potatobug, Rhinorush and Saldron;
- in bottom_left, for Knight_Armor, Rhinorush and Saldron.

In a **mixed** build, use the slot of the bot the **arms** came from.

`trimRect` (x0, y0, x1, y1 from the top-left, exclusive) gives each layer's tight box, so an atlas can pack
the mostly-empty canvases and still place them by offset.

## Format

| | |
|---|---|
| Projection | true isometric, **35.264°** elevation |
| Facings | `bottom_right` yaw **315°**, `bottom_left` yaw **45°**; the sun mirrors, never rotates |
| Scale | one game scale, Tinpet (Male) = the `mons_sized` 1.213 m (0.2756 m per rip unit) |
| Shared camera | **frozen** (`align.FROZEN_CAMERA`): ortho **1.91676 m** (bottom_right) / **1.92338 m** (bottom_left), i.e. 267.1 / 266.2 px/m |
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
| count matches the part list | 792 files = 792 manifest rows = 792 expected |
| every bot is in a series | 22 + 22, 0 manifest rows mis-tagged |
| every render has real pixels | lowest coverage 0.65% (Tinpet (Female) `arms_back`, a thin frame arm) |
| registration | one ortho scale per facing across every body and regular sprite |
| **the camera is the frozen one** | both facings; tightest fit 19.4 px (Mega-Emperor) |
| restack | a bot's own layers rebuild its full-body silhouette with **0.000%** alpha error, on all 88 |
| draw order | 395 overlapping layer pairs, **0** where the full render disagrees |
| **every neck on the reference** | worst **0.00 px** |
| **every bot at the one game scale** | factors 0.640 (Spidar) .. 1.385 (Saldron), Tinpet (Male) = 1 |
| feet / arm fit | reported: see *Size and alignment* |
| sun mirrors | 35 of 44 bots swap their lit side; the rest are too symmetric at their size to show it |
| dilation | opaque pixels round-trip byte-exact |
| straight alpha | ratio 1.005 at mean alpha 0.499 |

Shade differs from the full render on up to 8.39% of pixels (Potatobug), because a part rendered alone
receives no shadow from the part beside it. In a mixed build, a shadow cast by an absent part would be
wrong.

**History of the frame.**
- **2026-10-08:** Series 2 went in through the frozen camera. All 865 Series 1 files stayed
  byte-identical, and a re-render of three Series 1 bots reproduced 51 of 54 sprites byte for byte.
- **2026-10-09:** the set moved to the game scale, re-rendering every sprite. Tinpet (Male), whose factor
  is exactly 1, came out byte-identical on all 18 of its sprites. That proves the frame itself (neck
  reference, camera, rig) did not move.

## Rebuilding

```bash
B="C:/Program Files/Blender Foundation/Blender 5.1/blender.exe"
"$B" -b --factory-startup -P tools/convert_rips.py -- --only <Id>   # only when adding rips
"$B" -b --factory-startup -P tools/build_scene.py     # 44 GLBs -> scaled, aligned medabot_iso.blend, 6 s
"$B" -b medabot_iso.blend -P tools/medabot_sprites.py -- --only <Id,Id>   # ~12 s per bot
"$B" -b --factory-startup -P tools/verify.py
"$B" -b --factory-startup -P tools/mixed_builds.py -- --cross --out _review/series2/mixed_bottom_right
"$B" -b --factory-startup -P tools/make_thumbs.py     # 792 WebP thumbs for the sheet, 35 s
python tools/build_sheet.py                           # index.html + _artifact/sheet.html
```

`medabot_sprites.py` takes `--only`, `--sets`, `--views`, `--out` and `--manifest 0`. Because the camera
is frozen, any partial run stays registered with everything on disk. A full run takes about 10 minutes,
so run it as two `--only` batches of 22 when a tool timeout applies. `--recomposite` re-derives the
restack check, the arm slots and the part maps from the PNGs on disk. `mixed_builds.py` takes `--cross`
(every build mixes the two series), `--builds H+A+L,…` (explicit builds, e.g. head swaps) and `--out`.
`contact.py` tiles any of them.

**Adding a bot** takes six steps, and nothing already rendered changes:

1. Unpack the rip into `new_blender/medabots/_x/<Name>/`. The folder name becomes the id.
2. Run `convert_rips.py -- --only <Id>`. Its report gives the rip's `ripHeight`.
3. Add that height to `align.RIP_HEIGHT`; `build_scene.py` refuses a bot without one.
4. Add the id to a series in `tools/roster.py`.
5. Run `build_scene.py`, then `medabot_sprites.py -- --only <Id>`. The renderer stops if the bot does
   not fit the frozen canvas.
6. Run `verify.py`.

## Deliberately not here

- **Joint sockets** for the arms — see *Size and alignment*.
- **A grounded full-body variant** for roster displays, with every bot's feet on one line. Possible, but it
  would no longer stack with the parts.
- **Atlas packing** — `trimRect` is there for it; the display size is not decided.
- The Medals, Rokusho, and the game repo's copies.
