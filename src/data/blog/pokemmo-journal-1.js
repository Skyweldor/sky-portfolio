/**
 * PokeMMO Journal — Entry 001
 * "First Steps in Kanto: Humbled by a Weedle"
 *
 * Edit the text content here. The JSX component handles all styling.
 * Use **bold** and *italic* for inline formatting.
 */

const journal1 = {
  header: {
    title: 'First Steps in Kanto:\nHumbled by a Weedle',
    entry: '001',
    date: 'March 2026',
    tags: ['Kanto', 'Badges: 1', 'Beginner'],
  },

  body: [
    {
      type: 'paragraph',
      dropCap: true,
      text: "There is a particular kind of arrogance that comes with being a Pokémon veteran. You've played the games before — maybe many times. You know the routes, you remember the gyms, you understand type matchups in your sleep. So when you fire up PokeMMO for the first time and step out of Pallet Town with a Squirtle at your side, you feel ready. Comfortable, even.",
    },
    {
      type: 'paragraph',
      text: 'Viridian Forest had other plans.',
    },

    { type: 'sectionLabel', text: 'The Humbling' },

    {
      type: 'paragraph',
      text: "It happened fast. A wild Weedle — level 9, nothing remarkable — appeared in the tall grass. I'd seen Weedle a hundred times before. Low-level bug, weak stats, generally something you one-shot and move on from. What I didn't know, and had no reason to expect, is that PokeMMO reworks Pokémon learnsets. This Weedle had **Bug Bite** — 60 base power, STAB, and enough punch at that point in the game to put my Squirtle down before I could process what was happening.",
    },
    {
      type: 'battleLog',
      lines: [
        { style: 'normal', text: 'Wild WEEDLE appeared!' },
        { style: 'highlight', text: 'Go! SQUIRTLE!' },
        { style: 'normal', text: '> SQUIRTLE used Bubble...' },
        { style: 'normal', text: 'Wild WEEDLE used BUG BITE!' },
        { style: 'damage', text: "It's super effective!" },
        { style: 'damage', text: 'SQUIRTLE fainted.' },
        { style: 'normal', text: '' },
        { style: 'normal', text: '...oh.' },
      ],
    },
    {
      type: 'paragraph',
      text: "The lesson was immediate and delivered without sympathy: *PokeMMO is not FireRed*. The familiar shell is there — the routes, the towns, the music, the pixel art — but underneath it the game has been reworked in ways that quietly punish assumptions. Wild Pokémon can carry moves from higher levels. Learnsets are altered. Gym leaders have stronger teams. The engine is familiar, but the game is new.",
    },
    {
      type: 'paragraph',
      text: 'I respect it, honestly. Nothing reawakens your attention to a game you think you already know like getting flattened by something that should have been trivial.',
    },

    { type: 'sectionLabel', text: 'The Team Takes Shape' },

    {
      type: 'paragraph',
      text: "Before reaching Pewter City, the roster started coming together piece by piece. Squirtle — my starter, a reliable Water-type tank with a move in Bite at level 18 that will eventually let him threaten Psychic-types — was the foundation. Then came a **Pidgey** on Route 2, caught at level 7. Unremarkable at that stage, but Pidgey's Bug resistance (quarter damage from Bug-type moves) made it immediately useful as a Viridian Forest answer. And its line eventually becomes fast, which matters.",
    },
    {
      type: 'paragraph',
      text: 'Then — partly out of spite for what had happened to me — I caught a Weedle of my own.',
    },
    {
      type: 'paragraph',
      text: "I let it reach level 9 before evolving it, specifically so it could learn Bug Bite. As a Beedrill it came out of Kakuna already knowing **Twineedle** as a starting move — PokeMMO's updated version of the classic learnset — so the evolution gave me a Bug-type attacker with two STAB moves and genuine offensive presence before Pewter City. With Swarm as its ability, a pinched Beedrill hits hard.",
    },
    {
      type: 'callout',
      label: 'Journal Note',
      text: 'Twineedle has a 20% chance per hit to inflict poison — two hits means roughly 36% combined. Against certain gym trainers this has already won battles that looked close on paper.',
    },
    {
      type: 'paragraph',
      text: "The real surprise of the early game came at **Mt. Moon**, where I caught an **Onix**. At level 8 it already has Stealth Rock — an entry hazard that becomes quietly devastating as the game goes on — and its Rock Head ability means no recoil damage. It's an Onix, so the ceiling feels limited at first glance, but for right now it absorbs hits and sets up hazards and that is genuinely useful. Squirtle, meanwhile, had evolved into Wartortle by the time we cleared Mt. Moon, which felt like a small milestone worth marking.",
    },

    { type: 'sectionLabel', text: 'Brock' },

    {
      type: 'paragraph',
      text: "The first gym was, in fairness, designed to be straightforward for a Water starter. Brock's Geodude and Onix buckle to Water Gun and later Water Pulse without much drama. The Boulder Badge brought the level cap up to 26 and, critically, unlocked the **Running Shoes** — handed over by a man in glasses just east of Pewter City, who stops you as you try to leave. A small quality-of-life moment, but a welcome one after every route feeling slightly too slow.",
    },
    {
      type: 'paragraph',
      text: 'One badge. Route 3 cleared. Mt. Moon navigated. Cerulean City reached.',
    },

    { type: 'sectionLabel', text: 'Current Party' },

    {
      type: 'teamGrid',
      members: [
        { name: 'Wartortle', level: 19, types: ['Water'], ability: 'Torrent', dataType: 'water' },
        { name: 'Beedrill', level: 12, types: ['Bug', 'Poison'], ability: 'Swarm', dataType: 'bug' },
        { name: 'Pidgey', level: 10, types: ['Normal', 'Flying'], ability: 'Tangled Feet', dataType: 'flying' },
        { name: 'Onix', level: 8, types: ['Rock', 'Ground'], ability: 'Rock Head', dataType: 'rock' },
      ],
    },

    { type: 'sectionLabel', text: 'What PokeMMO Actually Is' },

    {
      type: 'paragraph',
      text: "For anyone reading this who hasn't tried it: PokeMMO is a fan-made MMO that runs on the ROMs of FireRed, Emerald, Platinum, HeartGold, and Black — five regions, all accessible on a single character, with a shared player-driven economy, a level cap system tied to gym badges, and a breeding mechanic where the parents are *consumed* to create the offspring. That last part is deliberate. It creates perpetual demand, keeps the market moving, and makes every well-bred Pokémon worth something.",
    },
    {
      type: 'paragraph',
      text: "There is no fast-forward button. No speed multiplier. If you're coming from emulators where 4x speed is a keystroke away, that adjustment is real. The trade-off is that the world is populated — there are other trainers running the same routes, other players visible in towns, a functioning economy where Safari Zone items and rare catches have actual value. It feels like something, in a way that a solo emulator playthrough eventually stops feeling like.",
    },
    {
      type: 'paragraph',
      text: "Cerulean City awaits. Misty's Starmie is reportedly no pushover in PokeMMO's reworked version. I imagine I'll find out the hard way.",
    },
  ],

  footer: {
    nextLabel: 'Cerulean City & the Misty Problem',
    badges: '1 / 8',
    region: 'Kanto',
  },
};

export default journal1;
