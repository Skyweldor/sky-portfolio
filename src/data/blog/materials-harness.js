/**
 * Build Harness — Entry 002
 * "One Mesh Per Building: The Materials Harness"
 *
 * Text lives here; the JSX component handles styling.
 * Use **bold** and *italic* for inline formatting.
 */

const materialsHarness = {
  header: {
    title: 'One Mesh Per Building:\nThe Materials Harness',
    entry: '002',
    date: 'September 2026',
    tags: ['Harness', 'three.js', 'Textures', 'Mobile'],
    status: 'PUBLISHED',
    path: 'SYNTHCITY://harness/materials',
  },

  body: [
    {
      type: 'paragraph',
      dropCap: true,
      text: "Two texture packs, twenty-seven KayKit buildings, and no reliable way to know what any combination looked like without opening Blender and committing to a bake. The obvious fix is a browser tool: pick a mesh, pick a tier, tap a part, tap a texture. The version that actually worked took a second attempt, because the first one had a flaw in its data model that made a whole category of work invisible.",
    },
    {
      type: 'paragraph',
      text: "That flaw is the interesting part, so it goes first.",
    },

    { type: 'sectionLabel', text: 'The Thing the First Build Got Wrong' },

    {
      type: 'quote',
      text: "One mesh per building; the tier is a selection granularity, not a different model.",
      cite: 'materials-harness/README.md',
    },
    {
      type: 'paragraph',
      text: "A building can be selected at three levels of coarseness. At **family** you are picking wood, stone or roof — three groups. At **palette** you are picking a palette cell, eleven groups on the lumbermill, with resting lumber and the saw wheel split out because they want different treatment. At **loose parts** you are picking a single connected component within a palette cell, and there are seventy-four of those.",
    },
    {
      type: 'specTable',
      caption: 'Tiers on the lumbermill, one of 27 buildings. Across the set the palette tier runs 5–13 groups and loose parts 13–202. Material names double as the UI labels — `timber`, `resting lumber`, `masonry 14`.',
      headers: ['tier', 'groups', 'basis'],
      rows: [
        ['family', '3', 'texture family — wood / stone / roof'],
        ['palette', '11', 'palette cell, with resting lumber and the saw wheel split out'],
        ['loose parts', '74', 'connected component x palette cell'],
      ],
    },
    {
      type: 'paragraph',
      text: "The first build treated those three tiers as three different models. Switch to **family** and it loaded a separate three-material GLB. Which meant — and this is the failure — that while the family tier was active, the app **physically could not display palette-level work**. Not *would not*: could not. The geometry on screen had three material slots. Work done at a finer tier had nowhere to render.",
    },
    {
      type: 'paragraph',
      text: "The fix is the line quoted above. The GLB always carries the finest grouping — all seventy-four slots, always. The tier only decides how coarsely you *select*. That is the whole reason a change made at one tier stays visible from the others, and it turns tier-switching from a model swap into a UI concern.",
    },
    {
      type: 'callout',
      label: 'Dev Note',
      text: "Not embedding the textures is what keeps this cheap. The GLBs carry geometry, grouping and a palette colour as baseColorFactor; the app applies textures at runtime. Each file is 55–257 KB, 5.10 MB for all twenty-seven.",
    },

    { type: 'sectionLabel', text: 'Two Ways to Select, Because Tapping Is Not Enough' },

    {
      type: 'paragraph',
      text: "The direct route is a raycast: tap the model, read the hit, and the material index on the intersected face *is* the group. One line does the work that would otherwise need a picking buffer.",
    },
    {
      type: 'codeBlock',
      lang: 'javascript',
      caption: "Selection by raycast. `intersect.face.materialIndex` maps straight onto the group, because the grouping is baked into the mesh as separate material slots.",
      code: `raycaster.setFromCamera(ndc, camera);
const hit = raycaster.intersectObject(model, true)[0];
if (hit) select(groupOf(hit.face.materialIndex));`,
    },
    {
      type: 'paragraph',
      text: "That is fine at the family and palette tiers. At loose parts it falls apart — a building carries anywhere from 13 groups to **202** of them, and hitting a specific plank with a fingertip is not realistic. So the status panel carries a parts row: every group in the current tier as a button, with arrows to step one at a time. At the loose-parts tier that list is not a fallback, it is the primary control.",
    },
    {
      type: 'paragraph',
      text: "Either route pulses the selected group blue on the model, and scrolls the active chip to the centre of the row. That highlight is not decoration. Picking *timber 27* from a list of sixty-two tells you nothing at all about which piece you just chose.",
    },

    { type: 'sectionLabel', text: 'Specificity, and Why a Change Looks Like It Failed' },

    {
      type: 'paragraph',
      text: "Here is where this post rhymes with the last one. The animation harness existed because a number — what Box3 reports for a SkinnedMesh — was not the number that was true. This tool has the same shape of problem in a different costume: **the tier you are looking at does not tell you what is actually assigned.**",
    },
    {
      type: 'paragraph',
      text: "The tiers are a strict hierarchy. A loose part belongs to exactly one palette cell; a cell belongs to one family. A part's texture is the first hit walking up that chain:",
    },
    {
      type: 'codeBlock',
      lang: 'text',
      code: `part "timber 04"  ->  cell "timber"  ->  family "wood"`,
    },
    {
      type: 'paragraph',
      text: "An assignment is only ever written at the tier you made it on. A coarse assignment is therefore a *default*, and a finer one overrides it. Work in palette, switch to loose parts, and every part starts from its group's texture — refine from there and the palette group is untouched.",
    },
    {
      type: 'paragraph',
      text: "Which produces the confusing case. Set `family: wood` while `palette: timber` already exists, and the timber parts do not change. That is correct — the finer assignment wins — but it used to look exactly like a broken button.",
    },
    {
      type: 'paragraph',
      text: "The answer was to make the model state legible rather than to change the model. The status line now reads `wood · Wood_13 · 23/43 set below` — the assignment, the texture, and how much of it is overridden further down. Chips carry a `*` when finer overrides are in charge. A **blue border** means the chip owns its assignment on this tier; **dim blue** means it inherited from a coarser one. Clear the finer key and the coarse value flows through immediately.",
    },
    {
      type: 'callout',
      label: 'Design Note',
      text: "Editing the scale of an inherited texture promotes it to an override on the current tier, rather than silently rewriting the coarser group that every sibling shares. And `clear all` wipes every tier for the building, not just the visible one — otherwise the coarser assignments keep showing through and it looks like nothing happened.",
    },

    { type: 'sectionLabel', text: 'Scale, Tint, and a Rule Worth Stealing' },

    {
      type: 'paragraph',
      text: "The UVs are box-projected at a baked density — 1.10 m for wood, 1.50 m for stone, 0.90 m for roof, with one Blender unit standing for 3.5 m. The scale slider works in metres-per-repeat and applies `repeat = baked / desired` on top, so the number on screen means something physical rather than being an arbitrary multiplier.",
    },
    {
      type: 'paragraph',
      text: "**Palette tint** is on by default and multiplies the texture by the group's palette colour. It is what keeps a roof reading as the team colour instead of grey slate. Turn it off when you want to judge a texture's own colour honestly.",
    },
    {
      type: 'paragraph',
      text: "And there is a **recommended** button, which applies a validated rule set by substring-matching group labels, first hit wins — so a more specific label has to come before a more general one.",
    },
    {
      type: 'specTable',
      caption: 'The validated defaults. Carried over from the KayKit iso-sprite work, where these combinations were chosen against index sheets.',
      headers: ['group', 'texture'],
      rows: [
        ['timber', 'Pack 1 — Wood 21'],
        ['masonry', 'Pack 2 — Brick 05'],
        ['roof', 'Pack 1 — Roofs 19'],
        ['resting lumber', 'Pack 1 — Wood 08'],
        ['saw wheel', 'Pack 2 — Metal 17'],
      ],
    },
    {
      type: 'paragraph',
      text: "Assignments auto-save to localStorage under `materials-harness/v1`, keyed `building:tier:group`. Every read and write is wrapped in try/catch, because private windows throw on access rather than returning empty.",
    },

    { type: 'sectionLabel', text: 'Two Export Traps' },

    {
      type: 'paragraph',
      text: "The GLBs come out of `kaykit_retexture.blend` via a Blender pass that groups faces per building per tier, makes one material per group with the palette colour as baseColorFactor, box-projects the UVs, and exports. Two traps were hit getting there, both worth inheriting.",
    },
    {
      type: 'paragraph',
      text: "First: pass `use_active_scene=True`, or objects selected in *other* Blender scenes leak into the export. Second: strip unused colour attributes, because Blender writes every one as `COLOR_0`, `COLOR_1`, `COLOR_2` — and glTF materials cannot select a channel, so anything past the first is dead weight that quietly changes shading.",
    },
    {
      type: 'paragraph',
      text: "Verification is mechanical: parse the GLB's JSON chunk, assert the material count equals the group count, and assert `TEXCOORD_0` is present. If those two hold, the export is good.",
    },

    { type: 'sectionLabel', text: 'Try It' },

    {
      type: 'paragraph',
      text: "This is the harness itself, built straight from source. Pick a building from the chips, choose a tier, then either tap a part on the model or step through the parts row. Textures are lazy-loaded per category, so the first paint costs the manifest plus one GLB — not the whole set.",
    },
    {
      type: 'harnessEmbed',
      src: '/harness/materials/',
      title: 'Materials harness — Tiny Texture Pack 1 and 2 against the KayKit buildings',
      height: 700,
      note: 'Mobile-first by design: it was built to be driven with a thumb on a phone over Wi-Fi.',
    },

    { type: 'sectionLabel', text: 'Weight' },

    {
      type: 'paragraph',
      text: "Measured, not estimated — and worth stating plainly, because the loose-parts tier has a cost that would be misleading to read as the game's.",
    },
    {
      type: 'specTable',
      headers: ['', 'measured'],
      rows: [
        ['models', '5.10 MB, 27 GLB, one loaded at a time'],
        ['textures', '15.01 MB, 285 PNG at 128 px — Pack 1 is 125 files, Pack 2 is 160'],
        ['js bundle', '807 KB (211 KB gzipped), almost all three.js'],
        ['built output', '22 MB'],
      ],
    },
    {
      type: 'paragraph',
      text: "Pack 1's PNGs average 83 KB for a 128 px image, which is close to raw — re-encoding to WebP would cut the texture set to roughly 3 MB. That is a build-script change needing no app edits, and it is deferred rather than forgotten.",
    },
    {
      type: 'callout',
      label: 'Read This Right',
      text: "The loose-parts tier runs to 202 materials on the castle, which means that many draw calls for one model. That is fine for a single-model viewer and it is exactly the cost the planned atlas re-bake exists to remove. Do not read this tool's performance as the game's.",
    },

    { type: 'sectionLabel', text: 'Lineage' },

    {
      type: 'paragraph',
      text: "This tool is not an original design. Its README says so in the sixth line: it was **modelled on the animation harness** — plain three.js, no React, module-level state, buttons built in a `forEach`, two source files. The previous post's harness answered its questions and then quietly became a template, which is a better outcome than the deletion its own header recommended.",
    },
    {
      type: 'paragraph',
      text: "The next post goes the other direction — out of the browser entirely, into Blender, for a rendering method that has now been run five times across three completely different kinds of subject.",
    },
  ],

  footer: {
    nextLabel: 'Ten Stages to an Isometric Sprite',
    meta: '27 BUILDINGS / 285 TEXTURES',
    region: 'Harness 002',
  },
};

export default materialsHarness;
