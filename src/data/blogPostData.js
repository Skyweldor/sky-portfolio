/**
 * Blog post metadata — consumed by the Blog hub page.
 */
import { ROUTES } from '../config/routes';

export const blogPosts = [
  {
    id: 'pokedex-companion',
    title: 'Pokédex Companion — All Regions',
    date: '2026-04-20',
    excerpt:
      'Searchable, filterable Pokédex spanning all five PokeMMO regions (Kanto → Unova). 649 entries with type, nature, and sprite data.',
    route: ROUTES.pokedex,
    category: 'Utility',
    status: 'PUBLISHED',
    pinned: true,
  },
  {
    id: 'pokemmo-journal-1',
    title: 'First Steps in Kanto: Humbled by a Weedle',
    date: '2026-03-15',
    excerpt:
      'My first foray into PokeMMO — getting destroyed by wild Pokémon and loving every second of it.',
    route: ROUTES.pokemmoJournal(1),
    category: 'Journal',
    status: 'PUBLISHED',
  },
  {
    id: 'pokemmo-journal-2',
    title: 'The Team So Far',
    date: '2026-03-27',
    excerpt:
      'Four badges in — a pause to take stock of who\'s on the team, what they bring, and where they stand.',
    route: ROUTES.pokemmoJournal(2),
    category: 'Journal',
    status: 'PUBLISHED',
  },
  {
    id: 'animation-harness',
    title: 'The Animated GLB Harness, and What Box3 Will Not Tell You',
    date: '2026-09-13',
    excerpt:
      'A standalone three.js page built to answer three questions about 40 rigged Digimon exports — chief among them what Box3.setFromObject actually reports for a SkinnedMesh.',
    route: ROUTES.animationHarness,
    category: 'Harness',
    status: 'PUBLISHED',
  },
  {
    id: 'materials-harness',
    title: 'One Mesh Per Building: The Materials Harness',
    date: '2026-09-13',
    excerpt:
      'Playtesting two texture packs against 27 KayKit buildings, where the tier you pick is a selection granularity rather than a different model — and why an earlier build could not show palette-level work at all.',
    route: ROUTES.materialsHarness,
    category: 'Harness',
    status: 'PUBLISHED',
  },
  {
    id: 'iso-sprite-harness',
    title: 'Ten Stages to an Isometric Sprite: KayKit, Digimon, Medabots',
    date: '2026-09-13',
    excerpt:
      'One rendering method, run five times and extended twice — for rigged characters, then for parts meant to be mixed across assemblies. 922 sprites, and the measurements that prove them.',
    route: ROUTES.isoSpriteHarness,
    category: 'Harness',
    status: 'PUBLISHED',
  },
];

export const pokedexRegions = [
  { region: 'Kanto', generation: 'I', entries: 151, route: ROUTES.regionPokedex('kanto'), status: 'COMPLETE' },
  { region: 'Johto', generation: 'II', entries: 100, route: ROUTES.regionPokedex('johto'), status: 'COMPLETE' },
  { region: 'Hoenn', generation: 'III', entries: 135, route: ROUTES.regionPokedex('hoenn'), status: 'COMPLETE' },
  { region: 'Sinnoh', generation: 'IV', entries: 107, route: ROUTES.regionPokedex('sinnoh'), status: 'COMPLETE' },
  { region: 'Unova', generation: 'V', entries: 156, route: ROUTES.regionPokedex('unova'), status: 'COMPLETE' },
];
