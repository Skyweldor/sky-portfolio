# Digimon iso sprites

Two master sets of transparent isometric PNGs for all **40 rigged Digimon** in
`SynthCity_Interactive/digimon-animated-bundle/mons/` — a **full body** shot and a
**portrait** (bust), each in two mirrored facings. **160 sprites, 512 px, 39 MB.**

Built by the method in [`../ISO_SPRITE_PIPELINE.md`](../ISO_SPRITE_PIPELINE.md), which was
written on three KayKit prop kits. This is its first run on *rigged characters*, and the
differences are all in stage 1 and in how a portrait is framed — see **What was new here**.

Open [`index.html`](index.html) to review the set: it flips between body and portrait
(`P`), between facings (`F`), swaps the tile background, and draws every sprite at true
relative size. Also published as an Artifact:
<https://claude.ai/code/artifact/f612afec-99ac-4e32-9d93-e6927e6e1771>

```
digimon_sprites/
├─ bottom_right/{body,portrait}/<Mon>.png    512 px RGBA, straight alpha
├─ bottom_left/{body,portrait}/<Mon>.png
├─ _thumbs/<view>/<set>/<Mon>.webp           256 px, 8 KB each — for the review sheet
├─ manifest.json                             every number a consumer needs
├─ scene_meta.json                           per-mon build facts + the bounds cross-check
├─ digimon_iso.blend                         40 mons, idle pose baked, actions purged
├─ index.html  ·  _artifact/sheet.html       the review sheet
├─ _contact/{body,portrait}.png              all 40 in one image, for a quick look
└─ tools/                                    the whole pipeline, re-runnable
```

## Format

| | |
|---|---|
| Projection | true isometric, **35.264°** elevation (not the 26.565° game "2:1" iso) |
| Facings | `bottom_right` yaw **315°**, `bottom_left` yaw **45°** |
| Resolution | 512 × 512, PNG, RGBA, 8-bit |
| Alpha | **straight (unassociated)** — measured, not assumed. Load with `premultipliedAlpha: false` |
| Edges | RGB dilated 8 iterations into the transparent region, so filtering and mipmaps pull no black in |
| Colour | `Standard` view transform, not AgX, which would desaturate these flat cel textures |
| Pose | idle, `bn01` frame 1 — baked into the mesh, so nothing here depends on an armature |
| Units | 1 Blender unit = **1 m**, derived: the bundle builds every mon to a metre target with feet at y=0 |

Both facings show the mon's **front**. glTF `+Z` forward maps to Blender `−Y` through the
importer, so 315° and 45° both see the face and 135°/225° see the back — confirmed by
rendering Agumon and Gabumon at all four yaws before committing.

**The sun mirrors between facings, it does not rotate.** Rotating the rig with the camera
would swing the key onto the blank side and leave every face in shadow. The cost is that
the key arrives from the upper-left in one facing and the upper-right in the other; that is
forced, not a preference. The geometry is never mirrored, so asymmetric mons keep their
real handedness.

## Framing

Per-asset, because the roster spans 0.78 m (Otamamon) to 3.89 m (Birdramon) and footprints
spread further still — Raremon is 4.4 × 5.0 m in plan, Garurumon 5.96 m nose to tail. At
one fixed scale the rookies would be thumbnails. Nothing is lost: `pxPerMeter` is recorded
per sprite, so `1 / pxPerMeter` restores true relative size (the review sheet's TRUE SCALE
toggle is exactly that).

**Body** — whole mon, 86% of the canvas on its driving axis, **bbox bottom pinned 6% above
the canvas bottom**. Every body sprite therefore stands on the same line, measured at
31–32 px from the bottom across all 80, so a roster grid sits still instead of bobbing.

**Portrait** — framed on the head, 62% of canvas *height* with the head's top at 87%,
leaving ~28% below for neck and shoulders. Width gets a looser 92% budget of its own:
ears are head and must stay in frame, but sizing a square canvas off Lopmon's 1.96 m ear
span at 62% shrank its face to a third of the frame. Two guards:

- **Extents are trimmed to the 3rd/97th percentile.** Patamon idles with one ear folded
  straight up — 37 verts of 1463 — and framing on that tip pushed its face down to a third
  of the canvas. The body set never trims: a body sprite must contain the whole mon.
- **A portrait is never a wider shot than its body sprite**, capped at 72% of the body
  frame. On a mon that is mostly head — Patamon, Lopmon, Terriermon, the Gatomon pair —
  the head anchor is nearly the whole animal, and 62% fill against the body's 86% made the
  "portrait" up to 1.28× *wider* than the body shot. 6 of 40 hit the cap.

### What the portrait is anchored to

Head geometry = vertices whose dominant weight is the head bone **or any descendant** —
ears, horns, jaws, hair and antennae follow the armature hierarchy, so they need no
per-part rule. Two exclusions matter:

- **Wings and held items are parented under the head bone on some rigs.** Angemon hangs six
  wing chains off `J_neck`, which made its "head" 1.13 m of a 2.75 m mon and framed the
  portrait as a body shot. `HEAD_CHAIN_EXCLUDE` drops those descendants.
- **Effect geometry never counts.** Only ToyAgumon has any: 276 verts of flame under
  `J_fire`, collapsed to a point 3.5 m above its head — invisible, no volume, but it
  dominates the bounding box.

Bone naming in these Cyber Sleuth rips is mixed English and romaji, and two rigs are
misspelled at source:

| bone | rigs |
|---|---|
| `J_head` | 15 |
| `J_atama` | 12 |
| `J_neck` | 6 (used only where no head bone exists; `J_kubi` likewise) |
| **`J_haed`** | 2 — Greymon and BlackGreymon, a typo in the rip that a plain `/head/` misses |
| *none* | 5 — see below |

**Five rigs have no head bone at all**, because on them the head is not a separable part.
Their anchors were read off the actual weight boxes (`tools/anchor_report.py`), not guessed:

| mon | anchor | why |
|---|---|---|
| Hagurumon | `J_center` | one floating gear; `J_spine01` is the ring around the face and `J_joint_E/F` the two side gears, which framed it tiny |
| Guardromon, GuardromonGold | top 45% of `J_mune`, zoom 0.62 | head and chest are one rigid bone; framing on all of `J_mune` caught both arms and showed the whole robot, framing on the head alone showed a wall of torso panels |
| Otamamon | `J_mune` + `J_ago` | a tadpole: head-blob plus jaw, with `J_center` as belly |
| DemiDevimon | everything but wings, feet, legs | a head with wings bolted on |

## Naming

Files keep the bundle's `<Name>.png` (`Agumon.png`, `BlackGarurumon.png`). The manifest
also carries the game's lowercase `key` (`agumon`) and the `tier` (`rookie` / `champion`),
both copied from `digimon-animated-bundle/manifest.json` rather than re-derived. Ids are
unique across both sets, so a flat atlas is safe.

## manifest.json

Keyed `<view>/<set>/<Mon>`:

```json
"bottom_right/portrait/Agumon": {
  "id": "Agumon", "key": "agumon", "tier": "rookie",
  "set": "portrait", "view": "bottom_right", "yawDeg": 315.0, "elevationDeg": 35.264,
  "file": "bottom_right/portrait/Agumon.png",
  "meshes": 2, "anchor": "J_head", "anchorVerts": 1107, "bodyVerts": 3070, "zoom": 1.0,
  "worldSizeM": [0.48, 0.72, 0.55], "bodySizeM": [1.042, 0.994, 1.21], "unitM": 1.0,
  "orthoScale": 1.07316, "bodyOrthoScale": 1.37811, "cappedToBodyRatio": false,
  "pxPerMeter": 477.09, "projectedSizePx": [297.9, 317.6],
  "coverage": 0.4788, "lumLeftRight": [0.4363, 0.3861], "kb": 253.8
}
```

`worldSizeM` is what the frame was sized on (the head, for a portrait); `bodySizeM` is
always the whole mon, so the two sets are comparable. `coverage` is the fraction of opaque
pixels — the render's own health check. `lumLeftRight` is the mean luminance of the left
and right thirds, which is how the sun-mirroring is verified numerically.

## Rebuilding

```bash
B="C:/Program Files/Blender Foundation/Blender 5.1/blender.exe"
"$B" -b --factory-startup -P tools/build_scene.py     # 40 GLBs -> digimon_iso.blend, 18 s
"$B" -b digimon_iso.blend -P tools/digimon_sprites.py # 160 sprites, 71 s
"$B" -b --factory-startup -P tools/make_thumbs.py     # 160 WebP thumbs
"$B" -b --factory-startup -P tools/verify.py          # the checks below
python tools/build_sheet.py                           # index.html + _artifact/sheet.html
```

The renderer takes `--only Agumon,Gabumon`, `--sets body`, `--views y135:135:0`,
`--elev-portrait 26.565`, `--out _test`, `--suffix _v2` and `--manifest 0`, which is how
the facing and elevation tests were run without touching the masters.
`tools/anchor_report.py` measures every portrait anchor without rendering anything;
`tools/contact.py` tiles PNGs into a contact strip.

Nothing here modifies the bundle. It is read-only input.

## Verified

`tools/verify.py`, all passing:

| check | result |
|---|---|
| facings hold the same ids | `set(a) ^ set(b)` empty, 80 + 80 |
| manifest matches files on disk | 160 rows, 160 files |
| every render has real pixels | coverage 0.126 (Kabuterimon body — thin wings, legitimate) to 0.844 |
| body ground line is constant | 31–32 px from the bottom, spec 30.7 |
| the key light swaps sides between facings | 68 of 80 pairs flip; the 12 that do not are symmetric mons |
| dilation leaves real pixels alone | max RGB delta **0.000/255**, alpha untouched |
| alpha is straight, not premultiplied | ratio 0.985 at mean alpha 0.502, correlation with alpha +0.05 |
| idle pose survived the bake | 39 of 40 match the bundle's baked `extras.bounds` to **0.00%** |

**File size proves nothing** about a render — a fully black sheet in the KayKit run was
967 KB. Coverage is the check that catches it.

The one bounds mismatch is **Biyomon**, whose depth measures 0.815 m against the 0.759 m in
the bundle's own `extras` (+7.3%, 5.5 cm; width +2.2%, height +0.2%). It is off by the same
amount at frames 1, 2 and 3, so it is not a frame-offset in this build — it looks like a
stale number in the bundle's extras. The sprite is framed on the real geometry either way.

## What was new here, versus the KayKit runs

- **Stage 1 grew a pose step.** These are skinned rigs, and `bound_box` and
  `mesh.vertices` report the **bind pose** through an armature deform — every framing
  calculation would have been silently wrong. `build_scene.py` poses each mon to `bn01`
  frame 1 and **applies the armature modifier**, after which the geometry is honest and the
  renderer needs no depsgraph work. Actions are then deleted: ~500 clips are most of the
  file size and nothing needs them once the pose is baked. The armatures stay, hidden, only
  as bone-hierarchy metadata for the head anchor.
- **The bake is verified against the assets' own numbers.** Each GLB carries idle-pose
  bounds in `extras`, so the baked mesh can be checked against them per mon. 39 of 40 at
  0.00% is what proves the pose survived.
- **Framing takes a vertex list, not `bound_box`.** That one change is what lets effect
  geometry be skipped, a head subset drive the portrait, and the two sets share one
  function.
- **The glTF importer parks a 42-vert `Icosphere` in a collection named
  `glTF_not_exported`.** It spans −1..1, so it added exactly 1.0 m to every mon's measured
  height until it was dropped — caught by the bounds check, not by looking.
- **Blender 5.1 actions are layered.** `Action.fcurves` no longer exists; the curves live
  in `layers → strips → channelbags`, and an action needs a slot assigned as well as being
  assigned.

## Deliberately not here

- **Atlas packing.** 160 × 512 px is 10 sheets at 2048. Decide the display size first, then
  downscale from these masters at pack time.
- **The other 505 clips.** Every sprite is the idle. Action poses (a `ba01` swing, a `bv01`
  victory) are one flag away — the actions are in the source GLBs, not in the working
  .blend — but they multiply the set by however many poses are wanted.
- **Backs.** Yaws 135 and 225 render fine and read much worse; nothing consumes them.
- **Shadow catcher / contact shadow.** A UI icon rarely wants one and it would fight
  whatever background the game draws behind it.
- **Seadramon and Gekomon**, which the bundle does not ship. See
  `../CYBER_SLEUTH_HANDOFF.md` for why.
