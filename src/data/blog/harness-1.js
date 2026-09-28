/**
 * Build Harness — Harness #1, narrative cut
 * "Harness #1 / T-Poses -> Animated!"
 *
 * Drafted in harness-1-example.md, which stays alongside untouched; this module is what
 * renders. The technical write-up of the same harness is still up as animation-harness.js.
 *
 * Changes from the draft:
 *   - `{greeting}` becomes Good morning / afternoon / evening on the reader's clock, in
 *     pages/blog/Harness1.jsx. The draft marks it "Good morning(<-variable)!".
 *   - The weekly-goals list is not in yet (see the TODO below), so the sentence that
 *     introduced it closes without it.
 *   - Typos, and "GLBs (.gltf files)" -> "binary glTF files": a .glb is not a .gltf.
 */

const harness1 = {
  header: {
    title: 'Harness #1\nT-Poses -> Animated!',
    entry: '001',
    date: 'September 2026',
    tags: ['Harness', 'TikTok Live', 'Digimon', 'Blender'],
    status: 'PUBLISHED',
    path: 'SYNTHCITY://harness/001',
  },

  body: [
    {
      type: 'paragraph',
      dropCap: true,
      text: "{greeting}! Some odd 12-15 weeks ago, I sat down to start programming one of those TikTok Live interactive games. If you ain't ever seen 'em, let me enlighten you real quick.",
    },
    {
      type: 'list',
      items: [
        {
          text: "The basic premise: viewers' interactivity drives gameplay.",
          items: ['Taps, Gifts, Follows, you name it, they all now "do something".'],
        },
        "The nature of this \"something\" then becomes the basis of the game's genre or game mechanic niche.",
      ],
    },
    // TODO(screenshot): the draft lists TikTok's weekly streamer goals after "goals like",
    // taken from a screenshot that hasn't been supplied yet. When it is, end this paragraph
    // on "...goals like", add a { type: 'list' } of the goals, then pick up with "lend
    // themselves to this gaming format." as its own paragraph.
    {
      type: 'paragraph',
      text: "For the streamer, ostensibly now also a player in this new game format, the objective is less \"let's win!\" and more \"let's grow!\". Having been on the streamer-end of TikTok Live Studio (think OBS or Streamlabs for those of us who haven't risen through the sufficient TikTok Live ranks to unlock third-party streaming software integration), the metrics TikTok challenges a streamer to hit are pretty straightforward. In essence, the goals TikTok sets in any given week lend themselves to this gaming format.",
    },
    {
      type: 'paragraph',
      text: "Setting the streaming aspect aside, as a game developer, the project also answers the most pressing question all game devs ask: \"How do I get this game into the hands of new players?\"",
    },
    // TODO(link): "this stick figure fighting game" wants a link to the game itself.
    {
      type: 'paragraph',
      text: "Exploring the full slew of custom TikTok Live interactive games merits its own post and deep dive; still, I'll highlight this stick figure fighting game where the inspiration for our interactive game comes from. Keep it proven, keep it simple. Finally, to make it reflect us, I'm going with a Digimon theme. I know, I know, but IP infringement be damned. I'll hang that cease and desist letter with pride when it arrives.",
    },
    {
      type: 'paragraph',
      text: '*(Shoutout to Mayor Mamdani for naming Digimon as his favorite anime in mid-September, after we started development and playtesting.)*',
    },
    {
      type: 'paragraph',
      text: "I leave you with the following first \"harness example\". To test animations, we built out this simple harness by importing our FBXs into Blender and exporting GLBs (binary glTF files). This format better suits mobile and web development by being lighter on the GPU. You'll notice some T-posed figures next to animated figures. The T-posed meshes are from our first pull; our second mesh pull came with more Digimon and embedded animations.",
    },
    {
      type: 'paragraph',
      text: 'Take a second to click through different Digimon and their animations. Notice any hiccups? Which Digimon are you most excited to raise?',
    },
    {
      type: 'harnessEmbed',
      src: '/harness/animation/anim-test.html',
      title: 'Harness #1 — animated Digimon beside the T-posed meshes from the first pull, with a 1 m reference cube',
      height: 640,
      note: 'Buttons along the top switch Digimon and animation. Drag to orbit.',
    },
  ],

  footer: {
    nextLabel: 'Harness #2: One Mesh Per Building',
    meta: '40 DIGIMON / 2 MESH PULLS',
    region: 'Harness 001',
  },
};

export default harness1;
