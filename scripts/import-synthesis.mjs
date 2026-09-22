#!/usr/bin/env node
/**
 * Converts the Fortnite livestream synthesis documents into blog post data
 * modules in the site's typed-block format.
 *
 *   node scripts/import-synthesis.mjs [sourceDir]
 *
 * The source .md files are treated as READ-ONLY. Nothing here writes back to
 * them; everything is emitted into src/data/blog/fortnite/.
 *
 * Re-run it whenever a synthesis is edited or a new one is added: add an entry
 * to SOURCES below, drop the .md in the source directory, run, done. The
 * generated modules are overwritten wholesale, so don't hand-edit them —
 * change the markdown or this script instead.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(HERE, '..');
const OUT_DIR = join(PROJECT_ROOT, 'src', 'data', 'blog', 'fortnite');

const DEFAULT_SOURCE_DIR =
  'A:/Intentional_Sports/eSports_Academy/Roblox/SynthCity_Interactive/fortnite-livestreams';

/** Date these first went up on synthcitydigilabs.com. */
const FIRST_POSTED = '2026-09-21';
const FIRST_POSTED_LABEL = 'First posted 21 September 2026';

const ROUTE_PREFIX = '/interactive/blog/fortnite';

// ---------------------------------------------------------------------------
// SOURCES — one entry per synthesis document.
//
// `slug` becomes the URL. `video`/`channel`/`streamed` drive the attribution
// callout injected at the top of every post. `tags` and `meta` are cosmetic.
// Entry numbers are assigned by the order of this object.
// ---------------------------------------------------------------------------
const SOURCES = {
  'fortnite-custom-items-inventories-synthesis.md': {
    slug: 'custom-items-inventories',
    title: 'Custom Items & Inventories in UFN',
    video: 'https://www.youtube.com/watch?v=54bR1g88EiE',
    videoTitle: 'Custom Items and Inventory | UEFN Build Along',
    channel: 'Fortnite Developers',
    streamed: '29 April 2026',
    tags: ['UEFN', 'Verse', 'Items', 'Build Along'],
    meta: 'BETA API / 3 SYSTEMS',
  },
  'fortnite-creature-based-islands-synthesis.md': {
    slug: 'creature-based-islands',
    title: 'Creature-Based Islands in UFN',
    video: 'https://www.youtube.com/watch?v=KTT9TMw2G9E',
    videoTitle:
      'Build Worlds and Build Bonds with Creature-Based Islands | Creating in Fortnite',
    channel: 'Fortnite Developers',
    streamed: '23 June 2026',
    tags: ['UEFN', 'NPCs', 'Sidekicks', 'Art'],
    meta: 'SHIPPED 41.0 / SIDEKICK NPCS',
  },
  'fortnite-mobile-tools-synthesis.md': {
    slug: 'designing-for-mobile',
    title: 'Designing for Mobile in UFN',
    video: 'https://www.youtube.com/watch?v=PWzlW6qkt7Y',
    videoTitle:
      'Designing for Mobile in UEFN: Gestures, Touch Layouts & Interactive HUDs | Creating in Fortnite',
    channel: 'Fortnite Developers',
    streamed: '26 June 2026',
    tags: ['UEFN', 'Mobile', 'UI', 'Input'],
    meta: 'VIRTUAL POINTER / 3 DEMOS',
  },
  'fortnite-in-island-transactions-synthesis.md': {
    slug: 'in-island-transactions',
    title: 'Getting Started with In-Island Transactions',
    video: 'https://www.youtube.com/watch?v=4tDX0xr3ASY',
    videoTitle: 'Getting Started with In-Island Transactions | Creating in Fortnite',
    channel: 'Fortnite Developers',
    streamed: '28 July 2026',
    tags: ['UEFN', 'Verse', 'Monetization'],
    meta: 'SERIES 1 OF N / OFFERS + ENTITLEMENTS',
  },
  'fortnite-mobile-tower-defense-synthesis.md': {
    slug: 'mobile-tower-defense',
    title: 'Building a Mobile Tower Defense Game in UFN',
    video: 'https://www.youtube.com/watch?v=6_MUpCxvOhs',
    videoTitle: 'Making a Mobile Tower Defense Game | UEFN Build-Along',
    channel: 'Fortnite Developers',
    streamed: '19 August 2026',
    tags: ['UEFN', 'Mobile', 'Tower Defense', 'Build Along'],
    meta: 'GRID PLACEMENT / WAVE SYSTEM',
  },
  'fortnite-shop-ui-synthesis.md': {
    slug: 'custom-shops-and-ui',
    title: 'Building Custom Shops & UI for In-Island Transactions',
    video: 'https://www.youtube.com/watch?v=-C4X35-L2xo',
    videoTitle:
      'Building Custom Shops and UI for In-Island Transactions | Creating in Fortnite',
    channel: 'Fortnite Developers',
    streamed: '26 August 2026',
    tags: ['UEFN', 'UMG', 'UI', 'Monetization'],
    meta: '5 MENUS / SELF-CRITIQUED',
  },
  'fortnite-ability-templates-synthesis.md': {
    slug: 'ability-templates',
    title: 'Ability Templates (Experimental) in UFN',
    video: 'https://www.youtube.com/watch?v=xSdtmO_XLy0',
    videoTitle: 'Template Abilities | Creating in Fortnite',
    channel: 'Fortnite Developers',
    streamed: '2 September 2026',
    tags: ['UEFN', 'Verse', 'Abilities', 'Experimental'],
    meta: 'EXPERIMENTAL / TIMELINE ABILITIES',
  },
  'fortnite-monetization-analytics-synthesis.md': {
    slug: 'reading-your-data',
    title: 'Reading Your Data & Iterating in Fortnite',
    video: 'https://www.youtube.com/watch?v=Z0d0wvU0Fyk',
    videoTitle: 'Reading Your Data and Iterating in Fortnite | Creating in Fortnite',
    channel: 'Fortnite Developers',
    streamed: '9 September 2026',
    tags: ['Analytics', 'Monetization', 'Creator Portal'],
    meta: 'METRICS / CREATOR PORTAL',
  },
  'uefn-tycoon-system-synthesis.md': {
    slug: 'tycoon-system',
    title: 'Building a Complete Tycoon System in UEFN',
    video: 'https://www.youtube.com/watch?v=mtBkRLfK_sk',
    videoTitle: 'A NEW FREE Fortnite Tycoon System!',
    channel: 'VOXEL DEVS',
    streamed: '16 October 2024',
    community: true,
    excerpt:
      'A single-presenter build-along that takes a tycoon from an empty map through claim buttons, purchasable unlocks, a crate, and a dropper system. The Verse code is free on the creator’s site; only the finished assets are paid.',
    tags: ['UEFN', 'Verse', 'Tycoon', 'Community'],
    meta: 'COMMUNITY TUTORIAL / END TO END',
  },
};

/** Cross-document links in the markdown point at sibling filenames. */
const FILE_TO_ROUTE = Object.fromEntries(
  Object.entries(SOURCES).map(([file, s]) => [file, `${ROUTE_PREFIX}/${s.slug}`])
);

// ---------------------------------------------------------------------------
// Markdown → typed blocks
// ---------------------------------------------------------------------------

const rewriteLinks = (text) =>
  text.replace(/\]\(([^)]+\.md)\)/g, (whole, file) =>
    FILE_TO_ROUTE[file] ? `](${FILE_TO_ROUTE[file]})` : whole
  );

const isBullet = (l) => /^\s*[-*]\s+/.test(l);
const isNumbered = (l) => /^\s*\d+\.\s+/.test(l);
const isListItem = (l) => isBullet(l) || isNumbered(l);
const indentOf = (l) => l.match(/^\s*/)[0].length;
const stripMarker = (l) => l.replace(/^\s*(?:[-*]|\d+\.)\s+/, '').trim();

/** A line that is nothing but bold text, e.g. `**The ground:**` */
const isBoldLead = (l) => /^\*\*[^*]+\*\*:?$/.test(l.trim());

function parseTable(lines) {
  const cells = (row) =>
    row
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

  const headers = cells(lines[0]);
  const rows = lines
    .slice(1)
    .filter((l) => !/^\s*\|[\s:|-]+\|\s*$/.test(l))
    .map(cells);

  return { type: 'specTable', headers, rows };
}

function parseMarkdown(md) {
  const lines = rewriteLinks(md).split(/\r?\n/);
  const blocks = [];
  let title = null;
  let subtitle = null;
  let paraBuf = [];
  let i = 0;

  const flushPara = () => {
    if (!paraBuf.length) return;
    const text = paraBuf.join(' ').trim();
    if (text) {
      blocks.push({
        type: 'paragraph',
        text,
        ...(blocks.length === 0 ? { dropCap: true } : {}),
      });
    }
    paraBuf = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // --- title / subtitle, taken only from the very top of the document ---
    if (!title && /^#\s+/.test(trimmed)) {
      title = trimmed.replace(/^#\s+/, '');
      i++;
      continue;
    }
    if (title && subtitle === null && /^###\s+/.test(trimmed) && blocks.length === 0) {
      subtitle = trimmed.replace(/^###\s+/, '');
      i++;
      continue;
    }

    // --- blank line ends a paragraph ---
    if (!trimmed) {
      flushPara();
      i++;
      continue;
    }

    // --- horizontal rules are section separators; sectionLabel already draws one ---
    if (/^-{3,}$/.test(trimmed)) {
      flushPara();
      i++;
      continue;
    }

    // --- headings ---
    if (/^##\s+/.test(trimmed)) {
      flushPara();
      blocks.push({ type: 'sectionLabel', text: trimmed.replace(/^##\s+/, '') });
      i++;
      continue;
    }
    if (/^###\s+/.test(trimmed)) {
      flushPara();
      blocks.push({ type: 'subLabel', text: trimmed.replace(/^###\s+/, '') });
      i++;
      continue;
    }

    // --- fenced code ---
    if (/^```/.test(trimmed)) {
      flushPara();
      const lang = trimmed.replace(/^```/, '').trim() || 'text';
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ type: 'codeBlock', lang, code: code.join('\n') });
      continue;
    }

    // --- tables ---
    if (/^\|/.test(trimmed)) {
      flushPara();
      const tableLines = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push(parseTable(tableLines));
      continue;
    }

    // --- blockquote ---
    if (/^>\s?/.test(trimmed)) {
      flushPara();
      const quoted = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoted.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', text: quoted.join(' ').trim() });
      continue;
    }

    // --- bold lead-in above a list, with or without a blank line between ---
    if (isBoldLead(trimmed)) {
      let peek = i + 1;
      while (peek < lines.length && !lines[peek].trim()) peek++;
      if (peek < lines.length && isListItem(lines[peek])) {
        flushPara();
        blocks.push({ type: 'listLead', text: trimmed });
        i = peek;
        continue;
      }
    }

    // --- lists, with one level of nesting ---
    if (isListItem(line)) {
      flushPara();
      const baseIndent = indentOf(line);
      const ordered = isNumbered(line);
      const items = [];

      while (i < lines.length && isListItem(lines[i])) {
        const cur = lines[i];
        if (indentOf(cur) > baseIndent) {
          // Nested under the previous item.
          const parentIdx = items.length - 1;
          if (parentIdx >= 0) {
            const nestedOrdered = isNumbered(cur);
            const nestedItems = [];
            const nestedIndent = indentOf(cur);
            while (
              i < lines.length &&
              isListItem(lines[i]) &&
              indentOf(lines[i]) >= nestedIndent
            ) {
              nestedItems.push(stripMarker(lines[i]));
              i++;
            }
            const parent = items[parentIdx];
            items[parentIdx] =
              typeof parent === 'string'
                ? { text: parent, ordered: nestedOrdered, items: nestedItems }
                : { ...parent, ordered: nestedOrdered, items: nestedItems };
            continue;
          }
        }
        items.push(stripMarker(cur));
        i++;
      }

      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    // --- anything else is prose ---
    paraBuf.push(trimmed);
    i++;
  }

  flushPara();
  return { title, subtitle, blocks };
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

/**
 * Pulls a hub-page excerpt out of the `**Scope:**` line. These run long, so cut
 * at the nearest clean boundary — a sentence if one is in range, otherwise a
 * clause, and only fall back to a bare word break if neither is.
 */
function deriveExcerpt(blocks, subtitle, override) {
  if (override) return override;

  const scope = blocks.find(
    (b) => b.type === 'paragraph' && /^\*\*Scope:?\*\*/.test(b.text)
  );
  let text = scope
    ? scope.text.replace(/^\*\*Scope:?\*\*:?\s*/, '')
    : subtitle || '';

  text = text.replace(/\*\*/g, '').replace(/\*/g, '').trim();

  const LIMIT = 200;
  const FLOOR = 80; // don't cut so short the excerpt stops saying anything
  if (text.length <= LIMIT) return text;

  const cut = text.slice(0, LIMIT);

  const sentence = cut.lastIndexOf('. ');
  if (sentence > FLOOR) return cut.slice(0, sentence + 1);

  const clause = Math.max(
    cut.lastIndexOf(', '),
    cut.lastIndexOf('; '),
    cut.lastIndexOf(' — ')
  );
  if (clause > FLOOR) return `${cut.slice(0, clause)}…`;

  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

function sourceCallout(src) {
  const kind = src.community
    ? 'Community tutorial'
    : 'Epic Games livestream';
  return {
    type: 'callout',
    label: 'Source',
    text:
      `These are my own synthesis notes, not official material. ` +
      `Based on **${src.videoTitle}** — ${kind}, published ${src.streamed} by ` +
      `**${src.channel}**. Watch the original: [${src.video}](${src.video})`,
  };
}

function emitModule(varName, post) {
  return (
    `/**\n` +
    ` * GENERATED by scripts/import-synthesis.mjs — do not edit by hand.\n` +
    ` * Source: ${post.__sourceFile}\n` +
    ` * Re-generate with: node scripts/import-synthesis.mjs\n` +
    ` */\n\n` +
    `const ${varName} = ${JSON.stringify(
      { header: post.header, body: post.body, footer: post.footer },
      null,
      2
    )};\n\n` +
    `export default ${varName};\n`
  );
}

const camel = (slug) =>
  slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^[a-z]/, (c) => c);

function main() {
  const sourceDir = process.argv[2] || DEFAULT_SOURCE_DIR;

  let available;
  try {
    available = new Set(readdirSync(sourceDir));
  } catch (err) {
    console.error(`\n  Cannot read source directory:\n    ${sourceDir}\n  ${err.message}\n`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const entries = Object.entries(SOURCES);
  const written = [];
  const missing = [];

  entries.forEach(([file, src], idx) => {
    if (!available.has(file)) {
      missing.push(file);
      return;
    }

    const md = readFileSync(join(sourceDir, file), 'utf8');
    const { title, subtitle, blocks } = parseMarkdown(md);

    const entryNo = String(idx + 1).padStart(3, '0');
    const body = [sourceCallout(src), ...blocks];

    const next = entries[idx + 1];
    const post = {
      __sourceFile: file,
      header: {
        kicker: 'Fortnite Notes',
        title: src.title || title,
        entry: entryNo,
        date: FIRST_POSTED_LABEL,
        tags: src.tags,
        status: 'PUBLISHED',
        path: `SYNTHCITY://notes/fortnite/${src.slug}`,
      },
      body,
      footer: {
        nextLabel: next ? next[1].title : 'Back to the blog index',
        meta: src.meta,
        region: `Fortnite Notes ${entryNo}`,
      },
    };

    writeFileSync(
      join(OUT_DIR, `${src.slug}.js`),
      emitModule(camel(src.slug), post),
      'utf8'
    );

    written.push({
      id: `fortnite-${src.slug}`,
      slug: src.slug,
      title: src.title || title,
      date: FIRST_POSTED,
      excerpt: deriveExcerpt(blocks, subtitle, src.excerpt),
      category: 'Notes',
      status: 'PUBLISHED',
      blocks: blocks.length,
    });
  });

  // --- barrel: every post module plus the hub-index entries ---
  const imports = written
    .map((w) => `import ${camel(w.slug)} from './${w.slug}';`)
    .join('\n');

  const bySlug = written
    .map((w) => `  '${w.slug}': ${camel(w.slug)},`)
    .join('\n');

  const indexEntries = written
    .map(
      (w) =>
        `  {\n` +
        `    id: ${JSON.stringify(w.id)},\n` +
        `    title: ${JSON.stringify(w.title)},\n` +
        `    date: ${JSON.stringify(w.date)},\n` +
        `    excerpt: ${JSON.stringify(w.excerpt)},\n` +
        `    route: ROUTES.fortniteNote(${JSON.stringify(w.slug)}),\n` +
        `    category: ${JSON.stringify(w.category)},\n` +
        `    status: ${JSON.stringify(w.status)},\n` +
        `  },`
    )
    .join('\n');

  writeFileSync(
    join(OUT_DIR, 'index.js'),
    `/**\n` +
      ` * GENERATED by scripts/import-synthesis.mjs — do not edit by hand.\n` +
      ` *\n` +
      ` * Fortnite livestream synthesis notes: the post modules keyed by slug, and\n` +
      ` * the metadata rows the blog hub lists.\n` +
      ` */\n` +
      `import { ROUTES } from '../../../config/routes';\n` +
      `${imports}\n\n` +
      `export const fortnitePostsBySlug = {\n${bySlug}\n};\n\n` +
      `export const fortnitePostEntries = [\n${indexEntries}\n];\n`,
    'utf8'
  );

  console.log(`\n  Wrote ${written.length} post module(s) to src/data/blog/fortnite/\n`);
  written.forEach((w) =>
    console.log(`    ${w.slug.padEnd(26)} ${String(w.blocks).padStart(4)} blocks`)
  );
  if (missing.length) {
    console.log(`\n  Not found in ${sourceDir}:`);
    missing.forEach((m) => console.log(`    ${m}`));
  }
  console.log('');
}

main();
