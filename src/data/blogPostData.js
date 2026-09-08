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
];

export const pokedexRegions = [
  { region: 'Kanto', generation: 'I', entries: 151, route: ROUTES.regionPokedex('kanto'), status: 'COMPLETE' },
  { region: 'Johto', generation: 'II', entries: 100, route: ROUTES.regionPokedex('johto'), status: 'COMPLETE' },
  { region: 'Hoenn', generation: 'III', entries: 135, route: ROUTES.regionPokedex('hoenn'), status: 'COMPLETE' },
  { region: 'Sinnoh', generation: 'IV', entries: 107, route: ROUTES.regionPokedex('sinnoh'), status: 'COMPLETE' },
  { region: 'Unova', generation: 'V', entries: 156, route: ROUTES.regionPokedex('unova'), status: 'COMPLETE' },
];
