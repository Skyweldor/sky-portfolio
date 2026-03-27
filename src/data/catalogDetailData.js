/**
 * Extended catalog data with detail fields for blog-style detail pages.
 * Each item extends the base CATALOG_ITEMS fields with rich content.
 */

export const CATALOG_DETAIL_ITEMS = [
  {
    // --- base fields ---
    id: 'aetherbound-demo',
    title: 'Aetherbound Demo Build',
    description: 'Playable demo of the creature-battling RPG. Explore the Rusted Junkyard, capture ProtoMeda, and test the combat system.',
    tags: ['React', 'Browser', 'RPG', 'Demo'],
    fileSize: '12 MB',
    downloadUrl: '#',
    downloadAvailable: false,
    type: 'demo',

    // --- detail fields ---
    heroImage: '/assets/blog/aetherbound-hero.jpg',
    gallery: [],
    longDescription: `Step into the Rusted Junkyard — a sprawling scrapheap on the edge of SynthCity's industrial district, where discarded machines have started evolving on their own.

Aetherbound is a creature-battling RPG built entirely in the browser using React. This demo build lets you explore the first zone, encounter wild creatures, and test the turn-based combat system that drives the full game.

You'll meet ProtoMeda, a scrap-metal insectoid that's become the unofficial mascot of the junkyard. Capture it, train it, and use it to battle other malfunctioning bots scattered across the zone. The combat system uses an energy-based action economy — every move costs energy, and managing your reserves is the key to surviving tougher encounters.`,
    features: [
      'Creature capture & training system',
      'Rusted Junkyard explorable zone',
      'Turn-based combat prototype with energy economy',
      'Browser-native — no install required',
      'Gamepad support (experimental)',
    ],
    changelog: [
      { version: '0.3.0', date: '2026-02-15', notes: 'Added ProtoMeda encounter and capture tutorial' },
      { version: '0.2.0', date: '2026-01-10', notes: 'Combat system overhaul — energy-based action economy' },
      { version: '0.1.0', date: '2025-11-20', notes: 'Initial demo — Rusted Junkyard exploration only' },
    ],
    callouts: [
      { label: 'Dev Note', text: 'The energy system was inspired by card game resource mechanics. Every creature starts each battle with a full energy bar, but there\'s no way to regenerate mid-fight — forcing hard choices about when to use your strongest moves.' },
    ],
    systemRequirements: 'Modern browser with WebGL support. Chrome or Firefox recommended.',
    author: 'Sky',
    publishDate: '2026-03-01',
    relatedItems: ['synthcity-asset-pack', 'camp-carapace-demo'],
  },
  {
    id: 'skys-scared-toolkit',
    title: "Sky's Scared Horror Toolkit",
    description: 'Complete Roblox horror game engine with advanced lighting, modular AI, and 3D spatial audio systems.',
    tags: ['Roblox', 'Lua', 'Horror', 'Engine'],
    fileSize: '45 MB',
    downloadUrl: '#',
    downloadAvailable: false,
    type: 'tool',

    heroImage: '/assets/blog/scared-toolkit-hero.jpg',
    gallery: [],
    longDescription: `Building horror games on Roblox shouldn't mean fighting the platform. Sky's Scared Horror Toolkit gives you a production-ready foundation for atmospheric horror experiences — so you can focus on scaring people, not debugging lighting scripts.

The toolkit includes a modular AI director that dynamically adjusts scare intensity based on player behavior. Linger too long in a room? The ambient audio shifts. Sprint through a hallway? The AI holds its next scare for maximum impact.

The 3D spatial audio system goes beyond Roblox's built-in audio. Sounds propagate through doorways, muffle behind walls, and echo in large spaces. Combined with the advanced lighting rig (volumetric fog, flickering fixtures, dynamic shadow casters), you get an atmosphere that punches way above typical Roblox experiences.`,
    features: [
      'Modular AI director with adaptive scare pacing',
      '3D spatial audio with occlusion and reverb zones',
      'Advanced lighting rig — volumetric fog, flicker effects, shadow casters',
      'Pre-built enemy templates (Stalker, Ambusher, Mimic)',
      'Save/checkpoint system with persistent player state',
      'Full Lua source — no obfuscated modules',
    ],
    changelog: [
      { version: '2.1.0', date: '2026-03-05', notes: 'Added Mimic enemy template and audio occlusion system' },
      { version: '2.0.0', date: '2026-01-22', notes: 'Complete rewrite — modular architecture, new AI director' },
      { version: '1.3.0', date: '2025-09-15', notes: 'Volumetric fog and dynamic shadow improvements' },
    ],
    callouts: [
      { label: 'Design Philosophy', text: 'The AI director never repeats the same scare pattern twice in a row. It tracks a "tension curve" per player session and deliberately creates valleys of calm before the next peak — because predictable horror isn\'t horror at all.' },
    ],
    systemRequirements: 'Roblox Studio 2024+ required. Compatible with all Roblox client platforms.',
    author: 'Sky',
    publishDate: '2026-03-05',
    relatedItems: ['camp-carapace-demo', 'robattle-dev-tools'],
  },
  {
    id: 'synthcity-asset-pack',
    title: 'SynthCity Neon Asset Pack',
    description: 'Cyberpunk-themed 3D assets including buildings, signs, vehicles, and props. Optimized for Unity and Unreal.',
    tags: ['Unity', 'Unreal', '3D Assets', 'Cyberpunk'],
    fileSize: '320 MB',
    downloadUrl: '#',
    downloadAvailable: false,
    type: 'asset',

    heroImage: '/assets/blog/synthcity-assets-hero.jpg',
    gallery: [],
    longDescription: `The SynthCity Neon Asset Pack is the same set of 3D models used to build the environments across SynthCity DigiLabs projects. Now available as a standalone pack for your own cyberpunk worlds.

Every asset is built for performance. Buildings use aggressive LOD chains, signs and props share atlased materials, and vehicles are rigged with simple bone hierarchies for basic animation. The pack ships with Unity prefabs and Unreal blueprints so you can drag-and-drop into your scene.

The neon system deserves special mention — signs and accent lights use emissive materials with configurable color, pulse speed, and flicker patterns. Chain them together for that signature rain-soaked SynthCity look.`,
    features: [
      '120+ unique meshes — buildings, signs, vehicles, props',
      'PBR materials with emissive neon system',
      'LOD chains for all major assets (LOD0–LOD2)',
      'Unity prefabs and Unreal blueprints included',
      'Configurable neon colors, pulse, and flicker',
      'Modular building pieces for procedural layouts',
    ],
    changelog: [
      { version: '1.2.0', date: '2026-02-28', notes: 'Added 20 new prop meshes and vehicle variants' },
      { version: '1.1.0', date: '2026-01-05', notes: 'Unreal 5.4 blueprint support, LOD improvements' },
      { version: '1.0.0', date: '2025-10-01', notes: 'Initial release — 80 meshes, Unity only' },
    ],
    systemRequirements: 'Unity 2022.3+ or Unreal Engine 5.3+. ~2 GB disk space after import.',
    author: 'Sky',
    publishDate: '2026-02-28',
    relatedItems: ['aetherbound-demo', 'sticker-templates'],
  },
  {
    id: 'camp-carapace-demo',
    title: 'Camp Carapace — Found Footage Demo',
    description: 'First chapter of the found footage horror experience. Gamepad recommended, headphones strongly advised.',
    tags: ['Unreal', 'Windows', 'Horror', 'Demo'],
    fileSize: '1.2 GB',
    downloadUrl: '#',
    downloadAvailable: false,
    type: 'demo',

    heroImage: '/assets/blog/camp-carapace-hero.jpg',
    gallery: [],
    longDescription: `Something happened at Camp Carapace in the summer of 2003. The counselors are gone. The cabins are empty. All that's left is a camcorder with a cracked lens and 47 minutes of footage that doesn't make sense.

Camp Carapace is a found footage horror game built in Unreal Engine. You experience the story entirely through the viewfinder of a handheld camera — complete with VHS artifacts, auto-focus hunting, and tape degradation that worsens as things escalate.

This demo covers Chapter 1: "Arrival." You arrive at the abandoned campground, explore the main lodge, and piece together what happened through environmental storytelling and recovered tape fragments. Headphones are strongly recommended. A gamepad makes the camera handling feel more natural, but keyboard/mouse is fully supported.`,
    features: [
      'First-person found footage camera system with VHS effects',
      'Chapter 1: "Arrival" — 25–40 minutes of gameplay',
      'Environmental storytelling with discoverable tape fragments',
      'Dynamic VHS degradation tied to narrative tension',
      'Gamepad-optimized camera handling',
      'Atmospheric 3D audio designed for headphones',
    ],
    changelog: [
      { version: '0.4.0', date: '2026-03-10', notes: 'Overhauled VHS shader — added tracking artifacts and color bleed' },
      { version: '0.3.0', date: '2026-02-01', notes: 'Added tape fragment collectibles and audio log system' },
      { version: '0.2.0', date: '2025-12-15', notes: 'Main lodge environment complete, basic camera system' },
    ],
    callouts: [
      { label: 'Content Warning', text: 'Camp Carapace contains sustained tension, sudden audio stings, and themes of isolation. No jumpscares in the traditional sense — the horror is atmospheric and slow-building. Discretion advised for photosensitive players during tape degradation sequences.' },
    ],
    systemRequirements: 'Windows 10/11, GTX 1060 or equivalent, 8 GB RAM, 3 GB disk space.',
    author: 'Sky',
    publishDate: '2026-03-10',
    relatedItems: ['skys-scared-toolkit', 'aetherbound-demo'],
  },
  {
    id: 'vr-browser-lab',
    title: 'VrBrowserLab Documentation',
    description: 'Technical documentation covering WebXR integration, locomotion systems, and PS1-shader pipeline setup.',
    tags: ['WebXR', 'Docs', 'PDF', 'React Three Fiber'],
    fileSize: '8 MB',
    downloadUrl: '#',
    downloadAvailable: false,
    type: 'docs',

    heroImage: '/assets/blog/vrbrowserlab-hero.jpg',
    gallery: [],
    longDescription: `VrBrowserLab is an experimental WebXR playground that runs entirely in the browser. This documentation covers the technical architecture behind it — from the React Three Fiber rendering pipeline to the custom PS1-style shader stack that gives it that signature retro look.

The docs are structured as a walkthrough. Start with the WebXR session lifecycle, move through the locomotion system (teleport, smooth, and hybrid modes), and finish with the shader pipeline that handles vertex jitter, affine texture mapping, and dithered transparency.

Whether you're building your own WebXR project or just curious about how browser-based VR works under the hood, this guide breaks down each system with code samples and architecture diagrams.`,
    features: [
      'WebXR session lifecycle and device compatibility guide',
      'Three locomotion modes — teleport, smooth, hybrid',
      'PS1 shader pipeline breakdown with GLSL samples',
      'React Three Fiber architecture patterns',
      'Performance budgeting for mobile VR browsers',
    ],
    changelog: [
      { version: '1.1.0', date: '2026-02-20', notes: 'Added PS1 shader pipeline chapter and GLSL samples' },
      { version: '1.0.0', date: '2025-11-01', notes: 'Initial release — WebXR lifecycle and locomotion docs' },
    ],
    systemRequirements: 'PDF reader. Code samples tested against React Three Fiber v8+.',
    author: 'Sky',
    publishDate: '2026-02-20',
    relatedItems: ['languagelink-guide', 'synthcity-asset-pack'],
  },
  {
    id: 'robattle-dev-tools',
    title: 'Robo-Battler Dev Tools',
    description: 'Modding toolkit for Robo-Battler: part editor, arena builder, and custom AI behavior tree designer.',
    tags: ['Unity', 'Windows', 'Mac', 'Modding'],
    fileSize: '89 MB',
    downloadUrl: '#',
    downloadAvailable: false,
    type: 'tool',

    heroImage: '/assets/blog/robattle-tools-hero.jpg',
    gallery: [],
    longDescription: `The Robo-Battler Dev Tools let you create custom content for Robo-Battler — the mech-building arena fighter. Design your own parts, build arenas, and program AI opponents using a visual behavior tree editor.

The Part Editor is the centerpiece. Snap together geometry nodes, assign material slots, and define attachment points. Parts export as compact JSON bundles that the game hot-loads without restart. The Arena Builder uses a tile-based grid system with elevation support, hazard zones, and spawn point configuration.

For AI modders, the Behavior Tree Designer lets you visually wire up decision trees for bot opponents. Drag condition nodes (health check, distance check, ammo check) into action nodes (charge, retreat, use ability) and watch them execute in real-time in the preview arena.`,
    features: [
      'Visual Part Editor with snap-together geometry nodes',
      'Arena Builder — tile-based grid with elevation and hazards',
      'AI Behavior Tree Designer with real-time preview',
      'Hot-reload — test changes without restarting the game',
      'JSON export format for easy sharing and version control',
      'Cross-platform — Windows and macOS',
    ],
    changelog: [
      { version: '1.3.0', date: '2026-03-01', notes: 'Behavior Tree Designer added with 12 built-in node types' },
      { version: '1.2.0', date: '2026-01-18', notes: 'Arena Builder elevation support and hazard zones' },
      { version: '1.0.0', date: '2025-08-30', notes: 'Initial release — Part Editor only' },
    ],
    systemRequirements: 'Windows 10+ or macOS 12+. Requires Robo-Battler v2.0+ for in-game testing.',
    author: 'Sky',
    publishDate: '2026-03-01',
    relatedItems: ['skys-scared-toolkit', 'synthcity-asset-pack'],
  },
  {
    id: 'sticker-templates',
    title: 'Sticker Design Templates',
    description: 'PSD and SVG templates for the SynthCity sticker line. Includes layer comps and bleed guidelines for print.',
    tags: ['Photoshop', 'SVG', 'Print', 'Templates'],
    fileSize: '56 MB',
    downloadUrl: '#',
    downloadAvailable: false,
    type: 'asset',

    heroImage: '/assets/blog/sticker-templates-hero.jpg',
    gallery: [],
    longDescription: `These are the actual production templates used to create the SynthCity sticker line. Each template includes properly configured bleed areas, cut lines, and safe zones for standard die-cut and kiss-cut sticker printing.

The PSD files use non-destructive layer comps — switch between color variants, holographic overlays, and matte/gloss finishes without touching the base art. The SVG versions are stripped-down vector outlines for creating new designs from scratch.

Included is a print-ready checklist and a color profile guide (CMYK for print, sRGB for web preview). If you're running your own sticker line or just want to contribute fan designs, these templates will save you hours of setup.`,
    features: [
      '12 PSD templates with layer comps (color, finish, overlay variants)',
      'SVG vector outlines for custom designs',
      'Die-cut and kiss-cut configurations',
      'CMYK print profiles with bleed/safe zone guides',
      'Holographic and gloss overlay mockups',
      'Print-ready checklist PDF',
    ],
    changelog: [
      { version: '2.0.0', date: '2026-02-10', notes: 'Added holographic overlay mockups and SVG variants' },
      { version: '1.0.0', date: '2025-07-20', notes: 'Initial release — 8 PSD templates' },
    ],
    systemRequirements: 'Photoshop CC 2022+ for PSD files. Any vector editor for SVGs.',
    author: 'Sky',
    publishDate: '2026-02-10',
    relatedItems: ['synthcity-asset-pack', 'languagelink-guide'],
  },
  {
    id: 'languagelink-guide',
    title: 'LanguageLink Curriculum Guide',
    description: 'Educator companion PDF with lesson plans, assessment rubrics, and integration guides for classroom use.',
    tags: ['Unity', 'Education', 'PDF', 'Guide'],
    fileSize: '15 MB',
    downloadUrl: '#',
    downloadAvailable: false,
    type: 'docs',

    heroImage: '/assets/blog/languagelink-hero.jpg',
    gallery: [],
    longDescription: `LanguageLink is a Unity-based language learning game designed for classroom environments. This curriculum guide is the companion document for educators who want to integrate LanguageLink into their lesson plans.

The guide covers three integration models: standalone sessions (students play independently), guided sessions (teacher leads with projected display), and blended learning (game segments woven into traditional lessons). Each model includes week-by-week lesson plans for a 6-week unit.

Assessment rubrics are mapped to Common Core ELA standards and ACTFL proficiency guidelines. The rubrics cover both in-game performance metrics (completion rate, accuracy, time-on-task) and offline assessment activities (reflection journals, peer teaching exercises).`,
    features: [
      'Three classroom integration models with lesson plans',
      '6-week unit plans for each integration model',
      'Assessment rubrics aligned to Common Core ELA and ACTFL',
      'In-game analytics interpretation guide',
      'Printable student worksheets and reflection journals',
      'IT setup guide for school lab deployment',
    ],
    changelog: [
      { version: '1.2.0', date: '2026-02-25', notes: 'Added ACTFL proficiency mapping and peer teaching exercises' },
      { version: '1.1.0', date: '2025-12-01', notes: 'Blended learning model and student worksheets' },
      { version: '1.0.0', date: '2025-09-01', notes: 'Initial release — standalone and guided session models' },
    ],
    systemRequirements: 'PDF reader. LanguageLink v1.5+ required for analytics features.',
    author: 'Sky',
    publishDate: '2026-02-25',
    relatedItems: ['vr-browser-lab', 'sticker-templates'],
  },
];

/**
 * Lookup helper — find a detail item by its ID.
 */
export const getDetailById = (id) =>
  CATALOG_DETAIL_ITEMS.find((item) => item.id === id) || null;
