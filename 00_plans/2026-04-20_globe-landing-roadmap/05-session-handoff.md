# Session Handoff

Quick summary of what changed this session and what's teed up next.

## 1. Game showcase asset audit

**Objective:** Locate the master PSD for the `{GameName}_Showcase_{NN}.png` images under `sky-portfolio/src/assets/img/`.

**Found:** `A:\images\cyberspace_sky\games_showcase\`
- Master PSD: **`Screenshots Showcase.psd`**
- 6 existing `_01` PNGs matching the portfolio
- 4 unused `_00` variants (HellBull, LanguageLink, OPUS_VR, Sky_Is_Scared) — different fonts; user prefers `_01` ("MTV 80s" text style)
- Naming inconsistency noted: Kuromi Flyer uses underscores in master, hyphens in portfolio

**Artifact:** `game-showcase-asset-audit.md` (same folder as this file).

## 2. Photoshop vs GIMP decision

User starting a Photoshop 7-day free trial via Creative Cloud. Full **"Photoshop"** desktop (not Elements or Express). GIMP/PhotoGIMP was evaluated but rejected because GIMP rasterizes Photoshop text layers on import — would lose the editable "MTV 80s" text.

## 3. Iso-Squares-Game — UI responsiveness

Repo: `C:\Users\Freedom_Fighter_01\Iso-Squares_Game` (branch `main`, clean, synced with origin).

**Sidebar/scoreboard responsiveness:**
- Both panels now use `clamp()` widths with `maxWidth: calc(100vw - 20px)`
- Bottom button row gets `flexWrap: wrap`
- Auto-collapse sidebar below 768px viewport

**Button clipping fix:**
- `Human`/`AI` toggle: `minWidth: 64px`, `flexShrink: 0`, `whiteSpace: nowrap`
- Player-name input: `minWidth: 0` to let flexbox actually shrink it
- Sidebar clamp floor bumped to 260px to make room for the full row

## 4. Iso-Squares-Game — Season / Continue Match feature

Major new feature. A "Season" = 4 matches, one per quadrant of the board.

**Files touched:**
- `src/gameConfig.js` — added `completedQuadrants`, `matchNumber`, `seasonOver`, `cumulativeScore`, `TOTAL_QUADRANTS` constant
- `src/hooks/useIsoSquaresGame.js` — quadrant-scoped `hasAdjacent`; `isLegalCell` now uses `player.hasMoved` instead of whole-board scan; `defineActiveQuadrant` guards against completed quadrants and returns a boolean; new `continueMatch()` action that rolls per-match score into cumulative, reorders players by ascending match score (lowest first in next match), resets per-match state; `playTurn` sets `seasonOver` when 4th match ends
- `src/components/GameEndModal.jsx` — full rewrite. Match ranking with gold tint for leader, "Season Total" section starts appearing in match 2, primary green "Continue Match →" + secondary outlined "Restart Season". Collapses to single "Start New Season" button on season end
- `src/components/IsoSquaresGame.jsx` — wired `handleContinueMatch`; first-move clicks reject cells in completed quadrants; `disablePlayerCount` now includes season lock; `Continue Match` sets `aiCanStart=true` so all-AI matches auto-start (fix for "stuck after Continue Match" bug)
- `src/components/PlayerSettings.jsx` — new `disableTypeToggle` prop; AI/Human toggle and "All Human" reset button now lock once **any** move is made in match 1 and stay locked for the whole season (intentional — switching mid-season disrupts flow)

**Design decisions (locked in):**
1. Each match is standalone scoring, but cumulative is shown in the end-of-match modal
2. AI/Human locked in from the start of the season — NOT togglable between matches
3. Turn order in subsequent matches = reverse of previous match score (lowest scorer goes first)
4. Board size and player count locked during a season; require "Restart Season" to change

## 5. In-flight / next steps

### Showcase image creation (primary active task)
User installing Photoshop trial. Once installed:
- Open `A:\images\cyberspace_sky\games_showcase\Screenshots Showcase.psd`
- Verify text layers are editable (not rasterized) — confirms the "_01" font/style layer is live
- Create showcases for the 7 placeholder games in `sky-portfolio/src/components/portfolio/Projects.js`:
  - Robo-Battler, mini-RC-Racer, VrBrowserLab, iso-squares-game, AsyncHeroes-MVP, Trick-or-Treat-3D, pocket-pal
- User was starting with **iso-squares-game** and setting up an all-AI match for the screenshot
- Source material inventory is in `game-showcase-asset-audit.md`

### Iso-Squares polish (optional, user hasn't requested)
- Visual tint on completed quadrants in `IsoSquaresBoard3D.jsx` (piece colors already differentiate, so this is pure polish)
- Cumulative score in the always-visible right-side scoreboard (currently only in end-of-match modal)

### Naming standardization (noted, not yet actioned)
Kuromi Flyer showcase uses hyphens in `sky-portfolio/src/assets/img/` (`Kuromi-Flyer-Showcase-01.png`) but underscores in the master folder. Either re-export from master with hyphens, or rename the portfolio copy + update the import in `Projects.js`.

## 6. Environment notes

- Working directory for iso-squares work: `C:\Users\Freedom_Fighter_01\Iso-Squares_Game`
- Dev server: `npm run dev` → `http://localhost:5173/` (falls through to 5174 if taken)
- All iso-squares changes are **uncommitted** on `main` — user will commit when happy
- `sky-portfolio` repo is on `main`, has pre-existing uncommitted changes to `GlobeLanding.css/jsx` and `.claude/settings.local.json` (unrelated to this session)
