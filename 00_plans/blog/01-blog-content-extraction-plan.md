# 01 — Blog Content Extraction Plan

## The Problem

Right now, every blog post's written content lives directly inside its React component (JSX file). That means the actual prose — the paragraphs you'd want to read, edit, or rewrite — is tangled up with presentation markup like this:

```jsx
<p className={styles.introTextFirst}>
  <span className={styles.descPrompt}>&gt;&nbsp;</span>
  <span className={styles.introDropCap}>
    Four badges in, and the team has stopped feeling like a collection
    of individual catches...
  </span>
</p>
```

To change a single sentence, you have to:

1. Open a `.jsx` file
2. Scroll past imports, component logic, and styling wrappers
3. Find the paragraph buried inside nested `<span>` and `<div>` tags
4. Edit carefully without breaking the surrounding JSX syntax

This makes blog writing harder than it needs to be and introduces unnecessary risk of breaking the page layout every time you tweak a word.

## The Solution

**Separate the content from the presentation.**

Each blog post gets its own data file in `src/data/blog/` that contains nothing but the post's text and metadata — plain strings, easy to read and edit:

```
src/data/blog/
  pokemmo-journal-1.js
  pokemmo-journal-2.js
```

A data file looks like this:

```js
export default {
  title: 'The Team So Far',
  date: 'March 2026',
  badges: '4 / 8',
  region: 'KANTO',
  tags: ['Journal', 'Team', 'Analysis'],
  intro: [
    "Four badges in, and the team has stopped feeling like a collection of individual catches...",
    "That shift matters more than it sounds...",
    "This entry is a pause to take stock...",
  ],
  closing: [
    "Six members, six roles, one team...",
    "Up ahead: Cerulean City revisited...",
  ],
  next: {
    label: 'Cerulean City & the Road to Vermilion',
  },
};
```

The React component then reads from this data file and handles all the styling automatically. The writer never touches JSX — just plain text in a structured format.

## What This Changes

| Before | After |
|---|---|
| Prose is buried inside JSX markup | Prose lives in clean, readable data files |
| Editing a sentence means navigating React syntax | Editing a sentence means changing a string |
| Risk of breaking page layout when editing content | Content and layout are fully decoupled |
| One file does two jobs (content + presentation) | Each file has one clear responsibility |

## Files Involved

- **New:** `src/data/blog/pokemmo-journal-1.js` — content data for Journal Entry 001
- **New:** `src/data/blog/pokemmo-journal-2.js` — content data for Journal Entry 002
- **Modified:** `src/pages/PokeMMOJournal.jsx` — reads from data file instead of hardcoding prose
- **Modified:** `src/pages/PokeMMOJournal2.jsx` — reads from data file instead of hardcoding prose
