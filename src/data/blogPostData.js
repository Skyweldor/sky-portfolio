/**
 * Blog post metadata — consumed by the Blog hub page.
 */

export const blogPosts = [
  {
    id: 'pokemmo-journal-1',
    title: 'First Steps in Kanto: Humbled by a Weedle',
    date: '2026-03-15',
    excerpt:
      'My first foray into PokeMMO — getting destroyed by wild Pokémon and loving every second of it.',
    route: '/blog/pokemmo-journal-1',
    category: 'Journal',
    status: 'PUBLISHED',
  },
  {
    id: 'pokemmo-journal-2',
    title: 'The Team So Far',
    date: '2026-03-27',
    excerpt:
      'Four badges in — a pause to take stock of who\'s on the team, what they bring, and where they stand.',
    route: '/blog/pokemmo-journal-2',
    category: 'Journal',
    status: 'PUBLISHED',
  },
];

export const pokedexRegions = [
  { region: 'Kanto', generation: 'I', entries: 151, route: '/blog/kanto-pokedex', status: 'COMPLETE' },
  { region: 'Johto', generation: 'II', entries: 100, route: '/blog/johto-pokedex', status: 'COMPLETE' },
  { region: 'Hoenn', generation: 'III', entries: 135, route: '/blog/hoenn-pokedex', status: 'COMPLETE' },
  { region: 'Sinnoh', generation: 'IV', entries: 107, route: '/blog/sinnoh-pokedex', status: 'COMPLETE' },
  { region: 'Unova', generation: 'V', entries: 156, route: '/blog/unova-pokedex', status: 'COMPLETE' },
];
