/**
 * Build Harness — Entry 003
 * "Ten Stages to an Isometric Sprite: KayKit, Digimon, Medabots"
 *
 * Text lives here; the JSX component handles styling.
 * Use **bold** and *italic* for inline formatting.
 */

const isoSpriteHarness = {
  header: {
    title: 'Ten Stages to an Isometric Sprite:\nKayKit, Digimon, Medabots',
    entry: '003',
    date: 'September 2026',
    tags: ['Harness', 'Blender', 'Sprites', 'Pipeline'],
    status: 'PUBLISHED',
    path: 'SYNTHCITY://harness/iso',
  },

  body: [
    {
      type: 'paragraph',
      dropCap: true,
      text: "This one is not a browser tool. It is a method — ten stages for turning a 3D asset kit into labelled index sheets and individual isometric sprite PNGs, repeatably, in Blender. It was written after doing the job three times on prop kits, then run a fourth time on forty rigged animated characters and a fifth on twenty-two robots whose parts are meant to be mixed across assemblies. Each of those last two runs forced the method to grow a stage.",
    },
    {
      type: 'paragraph',
      text: "Nine hundred and twenty-two sprites later, the parts worth keeping are mostly the mistakes.",
    },

    { type: 'sectionLabel', text: 'Three Artifacts, and Which One You Want' },

    {
      type: 'paragraph',
      text: "The first thing the method settles is that there are three different outputs here and they are **not substitutes** for one another.",
    },
    {
      type: 'specTable',
      headers: ['artifact', 'what it is', 'when it is the right answer'],
      rows: [
        ['Index sheet', 'one big PNG per category, every asset laid out and labelled at true relative scale', 'you need to see the whole kit at once to choose things'],
        ['Individual sprites', 'one transparent PNG per asset, per facing', 'anything the game or UI consumes — build menus, modals, atlases'],
        ['Review sheet', 'a self-contained HTML page of every sprite, filterable', 'approving the set, on any device, without opening Blender'],
      ],
    },
    {
      type: 'paragraph',
      text: "The index sheets answered *which foliage texture reads best*. The sprites are what ships. The review sheet is how the sprites get approved. Building the index sheets first on an unfamiliar kit — 391 assets across 13 sheets, a couple of sessions' work — prevented every later instance of *what is this asset even called*.",
    },

    { type: 'sectionLabel', text: 'The Projection' },

    {
      type: 'paragraph',
      text: "**True isometric, 35.264° elevation.** Not the 26.565° that games usually mean when they say isometric — that is the 2:1 pixel-art convention, and it is a different projection. Two facings per asset: `bottom_right` at yaw 315°, `bottom_left` at yaw 45°. Output is 512 x 512 PNG, RGBA, eight-bit.",
    },
    {
      type: 'paragraph',
      text: "The render rig is built from nothing by script every run, so it is reproducible and the source .blend is never modified. EEVEE at 64 samples, self-shadowing on because it gives the faceted look depth, film transparent, and — the one that matters for flat-colour kits — the `Standard` view transform rather than Blender's AgX default. AgX desaturates exactly the palette hues the art depends on.",
    },

    { type: 'sectionLabel', text: 'The Lighting Mistake Worth Inheriting' },

    {
      type: 'paragraph',
      text: "For a second facing there are two plausible rigs, and the obvious one is wrong.",
    },
    {
      type: 'paragraph',
      text: "**Rotate the sun with the camera.** It keeps the light in the same screen position, which sounds correct. It is not. Both yaws show the same −Y front wall, so rotating the rig ninety degrees swings the key light onto the blank side wall and leaves the doors and windows in shadow. This shipped once and had to be re-rendered.",
    },
    {
      type: 'paragraph',
      text: "**Mirror the sun instead** — negate the Z rotation — and the front wall stays the lit face in both facings. The cost is that the key arrives from the upper-left in one facing and the upper-right in the other. That is forced, not a preference: lighting a −Y wall requires a light coming from −Y. If both facings will ever appear in one scene under one sun, take the rotated rig and accept the shadowed fronts. You cannot have both.",
    },
    {
      type: 'callout',
      label: 'Never Do This',
      text: "Do not produce the second facing by flipping the image horizontally. It reverses handedness — the lumbermill's saw ends up on the wrong side of the building.",
    },

    { type: 'sectionLabel', text: 'Framing, and the Constant Ground Line' },

    {
      type: 'paragraph',
      text: "**Link the source objects into the render scene. Never copy, never move them.** The camera does all the work. This is why a full render run does not modify either source .blend, and it sidesteps the parent-relative transform trap outright — moving a parent moves its children too, which once scattered every multi-part asset across a contact sheet.",
    },
    {
      type: 'paragraph',
      text: "Always include the whole hierarchy, too. KayKit models moving parts as child objects, so a root-only render silently drops the lumbermill's saw.",
    },
    {
      type: 'codeBlock',
      lang: 'python',
      caption: 'Framing from world-space bounding-box corners projected onto the camera basis. `FILL` is 0.86.',
      code: `cam.rotation_euler = (radians(90 - ELEV_DEG), 0, radians(yaw))
R = cam.matrix_world.to_3x3()
right, up, back = R.col[0], R.col[1], R.col[2]
pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
S = max(max(us)-min(us), max(vs)-min(vs)) / FILL
cam.location = right*((min(us)+max(us))/2) + up*(min(vs) + S*(0.5 - BOTTOM)) + back*(max(ws)+dist)
cam.data.ortho_scale = S
cam.data.clip_end = dist + depth*2 + S*4`,
    },
    {
      type: 'paragraph',
      text: "Two things fall out of that. Pinning the *bottom* of the bounding box rather than its centre gives every asset a **constant ground line** — six percent of the canvas, 30.7 px at 512 — so sprites in a list sit still instead of bobbing. And orthographic framing ignores camera distance while clipping does not: a camera parked far enough away frames identically and renders pure black past `clip_end`. Set it from the scene span, every time.",
    },

    { type: 'sectionLabel', text: 'Measure It, Do Not Assume It' },

    {
      type: 'paragraph',
      text: "RGB has to be dilated into the transparent region or filtering and mipmapping pull black in from outside the silhouette and every sprite gets a dark fringe. Eight iterations of an eight-neighbour average over unfilled pixels; here that took fully-transparent black pixels from 99.7% to 93.5% of the clear area. Since the dilation edits files in place it must not disturb real pixels — and it does not: opaque and semi-transparent pixels come back **byte-identical**, max delta 0 of 255.",
    },
    {
      type: 'paragraph',
      text: "Then the alpha question, which is the small jewel of this whole document. Whether a PNG is straight or premultiplied is usually taken from documentation. Here it is *measured*: take semi-transparent edge pixels and compare each to the average of its opaque neighbours. A ratio near one, uncorrelated with alpha, means straight. A ratio tracking the pixel's alpha means premultiplied.",
    },
    {
      type: 'paragraph',
      text: "The measurement came back at ratio **1.003** at mean alpha 0.713, correlation **−0.16**. Straight — so consumers load with `premultipliedAlpha: false`. That is twenty lines of code, and it removes an entire category of *why do the edges look wrong in engine*.",
    },

    { type: 'sectionLabel', text: 'Set One — KayKit, Where the Method Came From' },

    {
      type: 'paragraph',
      text: "Static props: buildings, structures, decorations, units and a resource pack. 183 assets, two facings each, 366 PNGs at 56.7 MB. This is the run the first eight stages were written on, and it is the easy case — nothing in the kit moves, so a bounding box is the truth.",
    },
    {
      type: 'harnessEmbed',
      src: '/harness/iso/kaykit/',
      title: 'KayKit iso sprites — 183 assets across two facings, filterable review sheet',
      height: 680,
      note: 'Entirely self-contained: every thumbnail is a WebP data URI, and each tile carries its own framing numbers as data attributes.',
    },

    { type: 'sectionLabel', text: 'Set Two — Digimon, and the Bind Pose Again' },

    {
      type: 'paragraph',
      text: "Forty rigged, animated characters. Props sit still; a rig does not, and the first consequence is the same trap the first post in this series was built to expose.",
    },
    {
      type: 'paragraph',
      text: "**`bound_box` and `mesh.vertices` report the bind pose through an armature deform.** Blender's own measurements, not three.js this time — but identical in kind. Every framing number would have been silently wrong. The fix is upstream of the renderer: pose each rig to its idle, apply the armature modifier, then delete every action. After that the geometry is plain vertex data, the renderer needs no depsgraph work, and the working .blend is small — 15 MB for forty rigs, since roughly 500 clips were most of the source size. The armatures stay, hidden, purely as bone-hierarchy metadata.",
    },
    {
      type: 'paragraph',
      text: "And the bake gets verified against the assets' own numbers. These GLBs carry idle-pose bounds baked in as glTF `extras`, so each mon can be checked: **39 of 40 matched to 0.00%**. The fortieth was off by the same amount at frames 1, 2 and 3 — and a constant error across frames is not a frame-offset, it is a stale number at source.",
    },
    {
      type: 'sectionLabel',
      text: 'Portraits: Anchor on the Head Bone',
    },
    {
      type: 'paragraph',
      text: "A head is not a fixed fraction from the top of the silhouette. Birdramon's flame wings and Betamon's dorsal fin both rise above the head, so any *top 30%* rule frames a wing. The working approach is to take the vertices whose dominant weight is the head bone or any of its descendants — which picks up ears, horns, jaws and antennae for free, with no per-part rule.",
    },
    {
      type: 'paragraph',
      text: "Three refinements followed, each bought with a wrong render. **Wings and held items are parented under the head bone on some rigs** — Angemon hangs six wing chains off `J_neck`, so its head measured 1.13 m of a 2.75 m mon and the portrait framed as a body shot. **Trim the extents to a 3/97 percentile, and only for the portrait** — one folded ear, 37 verts of 1463, pushed Patamon's face to a third of the canvas. A body sprite must never trim; it has to contain the whole subject. **Width needs its own fill budget** — sizing a square canvas off Lopmon's 1.96 m ear span at the portrait's 0.62 fill shrank its face to a third of frame, so it is 0.62 tall and 0.92 wide.",
    },
    {
      type: 'callout',
      label: 'The Invariant',
      text: "A portrait must never be a wider shot than the body sprite. On a mon that is mostly head, the head anchor is nearly the whole animal, and a lower fill makes the close-up up to 1.28x wider than the body shot. Capped at ~0.72 of the body frame — it fired on 6 of 40.",
    },
    {
      type: 'paragraph',
      text: "Five of the forty rigs have no head bone at all: a floating gear, a head with wings bolted on, a tadpole, and two robots whose head and chest are one rigid bone. Those anchors are written by hand and read off the actual weight boxes rather than guessed. A twenty-line report printing each anchor's box against the body's box finds every one in a single run — and, just as usefully, separates them from the mons where a huge anchor is simply correct because the mon really is mostly head.",
    },
    {
      type: 'specTable',
      caption: 'Head-bone naming across the rips. Match on a pattern, then print what matched.',
      headers: ['bone', 'rigs'],
      rows: [
        ['`J_head`', '15'],
        ['`J_atama`', '12'],
        ['`J_neck`', '6 — used only where no head bone exists'],
        ['**`J_haed`**', '2 — Greymon and BlackGreymon, a typo in the rip that a plain `/head/` misses'],
        ['*none*', '5 — anchors written by hand'],
      ],
    },
    {
      type: 'callout',
      label: 'Two Silent Traps',
      text: "The glTF importer parks a 42-vert Icosphere in a collection named `glTF_not_exported`. It spans −1..1, so it added exactly 1.0 m to every mon's measured height. Drop anything in that collection on import. And Blender 5.1 actions are layered — `Action.fcurves` is gone, curves live in layers → strips → channelbags, and assigning an action also means assigning a slot.",
    },
    {
      type: 'figure',
      src: '/blog-posts/harness/digimon-contact-portrait.png',
      alt: 'Contact sheet of forty Digimon portrait sprites, each framed on the head bone',
      caption: 'The portrait contact sheet — forty head-anchored frames in one image. Reviewing anchors as a grid is how the six over-wide portraits were spotted.',
    },
    {
      type: 'harnessEmbed',
      src: '/harness/iso/digimon/',
      title: 'Digimon iso sprites — forty rigged characters, body and portrait sets',
      height: 680,
      note: 'Pose is idle, frame 1, baked into the mesh — nothing here depends on an armature at render time.',
    },

    { type: 'sectionLabel', text: 'Set Three — Medabots, Where Sprites Have to Stack' },

    {
      type: 'paragraph',
      text: "Twenty-two bots, and a different problem entirely. These sprites are *parts* of an assembly — head, arms, legs — and people are meant to mix them: a head from one bot on the body of another. Per-asset framing, the thing stages 1–8 were built around, is exactly wrong for that.",
    },
    {
      type: 'paragraph',
      text: "**One camera for every part of every asset**, computed per facing from the union of the whole kit rather than from whatever subset is being rendered — so a partial re-run stays registered with everything already done. A part then sits on the canvas exactly where it sits on its assembly, and a build is just PNGs drawn at 0,0. Both halves get verified: every body and part sprite in a facing shares one ortho scale, and stacking an asset's own layers reproduces its full render at **0.000% alpha error across all 28 restacks**.",
    },
    {
      type: 'paragraph',
      text: "Then the subtler failure. A shared camera is not enough — **the assets must share joints**. Registration puts a part where it sat on its own assembly, and if the kit was sized and centred per asset by bounding box, those places differ from asset to asset. The Medabot necks scattered **0.61 m** front to back, because tails and horns moved each box centre, and a mixed build simply came apart.",
    },
    {
      type: 'paragraph',
      text: "The fix is to measure one joint on every asset — the neck, taken as the centroid of the head vertices nearest the body, never the lowest band of the head, which a forward horn wins — and translate each whole asset so that joint lands on one reference point. Freeze the reference as a constant so adding assets never moves the ones already aligned. Heads then seat on any body to **0.00 px**. What is left is anatomy: shoulders sat a median 0.10 m from another bot's across 462 pairings, which only per-combination sockets would remove.",
    },
    {
      type: 'callout',
      label: 'A Trade With No Right Answer',
      text: "Translation kept the size convention but cost the common floor — feet end up to 0.23 m apart. Scaling each asset to align the joint height would keep the floor and break the sizes. That trade belongs to whoever is designing the game, not to the pipeline.",
    },
    {
      type: 'figure',
      src: '/blog-posts/harness/medabot-partmap.png',
      alt: 'Part map showing each Medabot split into head, arms and legs layers',
      caption: 'The part map. Head is the rip’s own head mesh, arms is every mesh matching arm on both sides, and legs is everything else — torso and legs together.',
    },
    {
      type: 'paragraph',
      text: "Two more things that only show up once parts move. **A part that wraps another cannot be one layer** — with two arms around a body, from a three-quarter view one arm is behind the body and the other in front. The part stays one choice for the user but ships as a back layer and a front layer, split by camera depth per facing.",
    },
    {
      type: 'paragraph',
      text: "And **measure the draw order** rather than fixing it. On every overlap between two layers the full render already knows which is on top. A fixed order was wrong on **5 of 166 overlaps** — shoulder-mounted weapons put even the far arm in front of the body — so the back layer's slot is scored per asset and per facing against the full render and stored in the manifest. After that, **0 of 115 overlaps disagreed**.",
    },
    {
      type: 'figure',
      src: '/blog-posts/harness/medabot-mixed-builds.png',
      alt: 'Grid of mixed Medabot builds, each combining head, arms and legs from different bots',
      caption: 'Mixed builds — heads, arms and legs drawn from different bots and composited at 0,0. These only line up because every asset was translated onto a shared neck reference first.',
    },
    {
      type: 'paragraph',
      text: "Shade differs where parts shadow each other, by up to about 4% of pixels: a part rendered alone receives no shadow from neighbours that are not there. That is the right trade — in a mixed build, a shadow cast by a part that is not present would be wrong.",
    },
    {
      type: 'harnessEmbed',
      src: '/harness/iso/medabot/',
      title: 'Medabot part sprites — 22 bots as body, stacking layers and portraits',
      height: 680,
      note: 'Three sets: body (the whole bot), regular (each part as a stacking layer), and portrait (each part framed for showcasing).',
    },

    { type: 'sectionLabel', text: 'The Best Lesson Is Not Technical' },

    {
      type: 'quote',
      text: "The part list is a design decision, not a property of the mesh.",
      cite: 'ISO_SPRITE_PIPELINE.md, Stage 10',
    },
    {
      type: 'paragraph',
      text: "The rips fused torso and legs into one mesh. The first pass separated them — finding whole mesh islands either side of a per-bot waist, located from the daylight between the legs — because the brief asked for a torso. It worked. Then the part rows were laid out as a contact strip, one row per part with every bot across, and seeing it made the answer obvious: torso went back into legs.",
    },
    {
      type: 'paragraph',
      text: "The engineering was correct and the output was wrong, and no amount of verification would have caught it, because nothing was broken. **Show a contact strip of the part rows early — before investing in the split.** That is cheaper than any test.",
    },

    { type: 'sectionLabel', text: 'By the Numbers' },

    {
      type: 'specTable',
      caption: 'All three sets. The full-resolution PNGs are the deliverable; the review sheets run entirely on embedded thumbnails.',
      headers: ['set', 'subjects', 'sprites', 'size'],
      rows: [
        ['KayKit', '183 props across 5 categories', '366', '56.7 MB'],
        ['Digimon', '40 rigged characters, body + portrait', '160', '39.2 MB'],
        ['Medabots', '22 bots as body / layers / portraits', '396', '53.3 MB'],
        ['**total**', '', '**922**', '**149 MB**'],
      ],
    },
    {
      type: 'paragraph',
      text: "The render rate is about 0.43 s per sprite on this machine — 107 medieval assets in 46 seconds per facing — at Blender 5.1, EEVEE, 64 samples, 512 px.",
    },
    {
      type: 'paragraph',
      text: "One measurement is load-bearing for everything above. A 512 px sprite averages **159 KB**; a 256 px WebP thumbnail averages **4.1 KB**. That **38x gap** is the entire reason an all-in-one HTML review sheet is possible at all — each of the three pages carries every thumbnail inline as a data URI and still comes in around 2 MB, which is why they open instantly here and worked as standalone Artifacts before that. The full-resolution PNGs sit alongside them, addressable by the paths the manifest records, but the sheet itself never needs to touch one.",
    },

    { type: 'sectionLabel', text: 'Deliberately Not Done' },

    {
      type: 'paragraph',
      text: "**Atlas packing** needs the display size decided first — 366 sprites at 512 px is 24 sheets at 2048, or four at 128 px, so it waits until something downstream knows the answer. **Team-colour variants** are cheap to add but multiply the sprite count by the number of teams and again by the facings. **Contact shadows** are absent on purpose: a UI icon rarely wants one and it would fight whatever background the game draws behind it.",
    },
    {
      type: 'callout',
      label: 'Colophon',
      text: "The three review sheets above are also published as standalone Artifacts, which is where they were reviewed before landing here. The Digimon set exists as two byte-identical trees; the copy alongside the other sets and the shared pipeline document is the canonical one.",
    },
  ],

  footer: {
    nextLabel: 'The PlayCanvas harness — same name, different engine',
    meta: '922 SPRITES / 10 STAGES',
    region: 'Harness 003',
  },
};

export default isoSpriteHarness;
