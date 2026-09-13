/**
 * Build Harness — Entry 001
 * "The Animated GLB Harness, and What Box3 Will Not Tell You"
 *
 * Text lives here; the JSX component handles styling.
 * Use **bold** and *italic* for inline formatting.
 */

const animationHarness = {
  header: {
    title: 'The Animated GLB Harness,\nand What Box3 Will Not Tell You',
    entry: '001',
    date: 'September 2026',
    tags: ['Harness', 'three.js', 'glTF', 'Blender'],
    status: 'PUBLISHED',
    path: 'SYNTHCITY://harness/animation',
  },

  body: [
    {
      type: 'paragraph',
      dropCap: true,
      text: "Every so often a question comes up that you cannot answer by reading code, and cannot answer in Blender either, because the thing you actually want to know is what the *renderer* believes. We had forty Digimon coming out of a rigged-FBX to animated-GLB pipeline, and a game that already shipped static versions of some of them. Before swapping one for the other, three things needed settling — and all three were about the gap between a number a tool reports and the number that is true.",
    },
    {
      type: 'paragraph',
      text: "So I built a page. Not a feature, not a component — a standalone harness, served by Vite at /anim-test.html, with a comment at the top telling whoever found it later exactly why it existed and when to delete it.",
    },
    {
      type: 'codeBlock',
      lang: 'javascript',
      caption: 'The header of `src/animtest.js`. Written first, before any of the code under it.',
      code: `// Standalone harness for the rigged-FBX -> animated-GLB pilot.
// Not part of the app; served by vite at /anim-test.html. Delete with
// anim-test.html and public/models/_animtest/ once the question is settled.
//
// It answers three things the Blender-side checks can't:
//   1. does three.js render the animated GLB at the same size as the shipped
//      static one (i.e. is it a drop-in swap)
//   2. do the baked clips actually play through AnimationMixer
//   3. what does Box3.setFromObject -- the call MonModel.computeLocalBounds
//      makes -- report for a SkinnedMesh, versus the true deformed extent`,
    },

    { type: 'sectionLabel', text: 'The Layout Is the Argument' },

    {
      type: 'paragraph',
      text: "The whole page is three objects on a grid. The new animated export sits on the left at x = -0.9. Whatever the game ships today sits on the right at x = +0.9, loaded untouched. And at x = -2.2 there is a one-metre wireframe cube, which is there for exactly one reason, recorded in the source as a comment: **so scale errors are obvious by eye, not just in numbers.**",
    },
    {
      type: 'paragraph',
      text: "That last part matters more than it sounds. A readout that says 1.83 is only meaningful if you already know what it should say. A model standing next to a cube you can see is a metre tall is meaningful immediately, to anyone, including someone who has never opened the project. Roughly half the value of this harness comes from that cube.",
    },
    {
      type: 'paragraph',
      text: "Of the forty mons in the list, only **eighteen** have a shipped static counterpart to compare against — seventeen Rookies plus Guardromon. For the rest the right-hand slot simply stays empty, and the comparison that carries the weight is the left-hand model against the cube.",
    },

    { type: 'sectionLabel', text: 'Question Three Was the Real One' },

    {
      type: 'paragraph',
      text: "Questions one and two were quick. The sizes matched; the clips played. Question three is the one worth writing down, because it is a trap that does not announce itself.",
    },
    {
      type: 'paragraph',
      text: "Box3.setFromObject is the obvious way to ask three.js how big a thing is, and it is the call the game's own MonModel.computeLocalBounds makes. On an ordinary mesh it is correct. On a **SkinnedMesh** it walks the geometry's position attribute — which holds the *bind pose*, the shape the mesh had before any bone ever moved it. The vertices it measures are not the vertices on screen. Nothing errors. You just get a number for a pose the model is not in.",
    },
    {
      type: 'paragraph',
      text: "So the harness computes the honest answer alongside it. Rather than CPU-skinning the whole mesh every frame, it samples: step through the position attribute at a stride that yields about 900 vertices, push each one through three's own applyBoneTransform, convert to world space, and grow a box around the result.",
    },
    {
      type: 'codeBlock',
      lang: 'javascript',
      caption: "From `trueSkinnedBox()` — deliberately a sample, not an exact hull. It only has to be good enough to disagree with `Box3` when `Box3` is wrong.",
      code: `const step = Math.max(1, Math.floor(pos.count / 900)); // sample for speed
for (let i = 0; i < pos.count; i += step) {
  v.fromBufferAttribute(pos, i);
  o.applyBoneTransform(i, v);      // three's own CPU skinning for one vert
  o.localToWorld(v);
  box.expandByPoint(v);
}`,
    },
    {
      type: 'paragraph',
      text: "Both numbers print to the readout, one line above the other, and the readout refreshes every thirtieth frame — so as a clip plays you watch the true box breathe while the Box3 figure sits perfectly still. That stillness *is* the finding. A static number under a moving model is the whole bug, made visible.",
    },
    {
      type: 'callout',
      label: 'Dev Note',
      text: "This same trap appears again, in a different engine, in the iso-sprite pipeline: Blender's bound_box and mesh.vertices also report the bind pose through an armature deform. Different tool, identical failure, and it had to be found twice before it got written down.",
    },

    { type: 'sectionLabel', text: 'Art-Directed Versus Derived' },

    {
      type: 'paragraph',
      text: "The roster splits in two, and the split changes what the harness is for. The Rookies — Agumon, Gabumon, Veemon, Patamon and the rest — have heights that were **art-directed**: somebody chose them. Most have a shipped counterpart, so the check is a straight left-versus-right comparison.",
    },
    {
      type: 'paragraph',
      text: "The Champions are different. Their heights are **derived**, computed as source height x 1.22, and almost none of them have a static counterpart. There is nothing to compare against except the cube, which is precisely why the cube is there. Reviewing those twenty is a judgement call about whether a derived number produced a believable animal, and the note in the source singles out the three that do not quite land: Garurumon, BlackGarurumon and Raremon all **read long for their height**.",
    },
    {
      type: 'specTable',
      caption: 'The full set, as shipped into the harness. Every GLB is lazy-loaded; nothing preloads.',
      headers: ['', 'count', 'size', 'note'],
      rows: [
        ['Animated GLBs', '40', '40.8 MB', 'Rookies and Champions, baked clips included'],
        ['Shipped static counterparts', '18', '5.5 MB', '17 Rookies + Guardromon; the rest have none'],
        ['Largest single file', 'Angemon.glb', '1.77 MB', 'six wing chains, and it shows'],
      ],
    },

    { type: 'sectionLabel', text: 'The Clip-Name Detail' },

    {
      type: 'paragraph',
      text: "One small thing, included because it is exactly the class of problem a harness exists to surface. These models come from two different games, and the two games do not agree on what to call a resting animation. Digimon Links names it idle. Cyber Sleuth calls its battle-neutral clip bn01.",
    },
    {
      type: 'paragraph',
      text: "Open a model without accounting for that and the harness autoplays the first clip, which on the Cyber Sleuth rips is ba01 — an attack, caught mid-leap. The model hangs in the air at a strange angle and every instinct says the export is broken. It is not. It is playing frame one of the wrong clip.",
    },
    {
      type: 'codeBlock',
      lang: 'javascript',
      code: `// 'idle' is the Digimon Links name; Cyber Sleuth calls its battle-neutral
// clip 'bn01'. Without this the harness opens on clips[0] = 'ba01', an
// attack mid-leap, which looks like a broken rest pose.
const idle = clips.find((c) => c.name === 'idle' || c.name === 'bn01') || clips[0];`,
    },
    {
      type: 'paragraph',
      text: "Three lines of comment for one line of code, and worth every character. Someone — possibly me, months from now — was otherwise going to spend an afternoon debugging an export that was fine all along.",
    },

    { type: 'sectionLabel', text: 'Try It' },

    {
      type: 'paragraph',
      text: "The harness below is the real thing, not a recording: the same page, the same forty GLBs, the same readout. Pick a mon from the top row, then a clip from the second. Drag to orbit. Watch the two bounding-box lines in the bottom-left corner as the animation plays, and watch how they disagree.",
    },
    {
      type: 'harnessEmbed',
      src: '/harness/animation/anim-test.html',
      title: 'Animated GLB test harness — animated versus shipped static, with a 1 m reference cube',
      height: 640,
      note: 'Loads one GLB pair at a time. Orbit with the mouse; buttons along the top switch mon and clip.',
    },

    { type: 'sectionLabel', text: 'What It Was Worth' },

    {
      type: 'paragraph',
      text: "The harness answered its three questions and could have been deleted, exactly as its header instructs. It has not been, for two reasons. It is the fastest way to look at any one of these forty models in isolation, which turns out to be a thing you want to do constantly. And it became the template: when the next tool was needed — a browser page for playtesting texture packs against a set of buildings — it was **modelled on this one**, down to the plain three.js, the module-level state, and the buttons built in a forEach.",
    },
    {
      type: 'paragraph',
      text: 'That is the next post.',
    },
  ],

  footer: {
    nextLabel: 'One Mesh Per Building: The Materials Harness',
    meta: '40 GLB / 3 QUESTIONS',
    region: 'Harness 001',
  },
};

export default animationHarness;
