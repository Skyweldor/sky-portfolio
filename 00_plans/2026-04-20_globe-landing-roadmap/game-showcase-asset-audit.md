# Game Showcase Asset Audit

Search for master PSD documents and source material to build out the `{GameName}_Showcase_{NN}.png` images used in `src/components/portfolio/Projects.js`.

Date: 2026-04-23
Scope: C: drive user directories + A: drive

## ✅ FOUND: Master folder located

**`A:\images\cyberspace_sky\games_showcase\`** is the correct folder. It contains the master PSD and all exported showcase PNGs.

### Contents

| File | Notes |
|------|-------|
| `Screenshots Showcase.psd` | **Master PSD** — source for all `_Showcase_` exports |
| `Camp_Carapace_Showcase_01.png` | Matches portfolio |
| `HellBull_Showcase_00.png` | Extra variant not yet used |
| `HellBull_Showcase_01.png` | Matches portfolio |
| `Kuromi_Flyer_Showcase_00.png` | Extra variant (note: underscores, vs. hyphens in sky-portfolio copy) |
| `Kuromi_Flyer_Showcase_01.png` | Same image as portfolio but underscored filename |
| `LanguageLink_Showcase_00.png` | Extra variant not yet used |
| `LanguageLink_Showcase_01.png` | Matches portfolio |
| `OPUS_VR_Showcase_00.png` | Extra variant not yet used |
| `OPUS_VR_Showcase_01.png` | Matches portfolio |
| `Sky_Is_Scared_Showcase_00.png` | Extra variant not yet used |
| `Sky_Is_Scared_Showcase_01.png` | Matches portfolio |

### Immediate implications

1. Open `Screenshots Showcase.psd` to add new game layers/pages — this is the single file to edit for every remaining placeholder game.
2. Four extra `_00` variants already exist (HellBull, LanguageLink, OPUS_VR, Sky_Is_Scared) and could be imported into `src/assets/img/` if you want A/B or alt-layouts.
3. Kuromi Flyer in the master folder uses **underscores** (`Kuromi_Flyer_Showcase_01.png`) while the sky-portfolio copy uses **hyphens** (`Kuromi-Flyer-Showcase-01.png`). Re-exporting from the master with the hyphenated name (or renaming the import in `Projects.js`) would standardize this.

---

## Original research below (kept for reference)


## Existing Showcase PNGs (in `src/assets/img/`)

- `Camp_Carapace_Showcase_01.png`
- `HellBull_Showcase_01.png`
- `Kuromi-Flyer-Showcase-01.png`
- `LanguageLink_Showcase_01.png`
- `OPUS_VR_Showcase_01.png`
- `Sky_Is_Scared_Showcase_01.png`

No files matching `*Showcase*.psd` exist anywhere on C: or A:. The showcases appear to have been exported from template / portfolio PSDs under different names.

## Master PSD Candidates

All located in `A:\images\cyberspace_sky\`:

| File | Notes |
|------|-------|
| `cyberspace_sky_template_00.psd` | Generic template — strongest candidate for the master document |
| `language_link_template_00.psd` | Pairs with existing `LanguageLink_Showcase_01.png` — likely reveals the showcase layer structure (title / tagline / splash placement) |
| `opus_art\opus_portfolio_pg_1.psd` → `pg_4.psd` | Multi-page portfolio PSDs, possibly contain showcase-style layouts |
| `opus_art\screenshots_00.psd` | Opus VR screenshot comp |

## Other Relevant PSDs

- `A:\images\site\game_icons\ue\kuromi_flyer\flyer_icon_00.psd` — Kuromi Flyer icon
- `A:\images\site\banner-bg.psd`
- `A:\images\site\saturn-ascii-i.psd`
- `C:\Users\Freedom_Fighter_01\Pictures\Screenshots\kuromi_flyer_00.psd`

## Games Still Needing Showcase Images

From `src/components/portfolio/Projects.js`:

| Game | Engine | Current Fallback | Source Material Available |
|------|--------|------------------|---------------------------|
| Robo-Battler | Unity | `roboIcon1` | `A:\images\site\game_icons\robo_battler\` (robo_icon_00, crawler, bomb_enemy) |
| mini-RC-Racer | Roblox | `scaredBackground` | `A:\Roblox_Projects\Platforms_02.rbxl`, `Platforms_04.rbxl` — capture in-studio |
| VrBrowserLab | Web | `kuromiBackground` | Project: `C:\Users\Freedom_Fighter_01\VrBrowserLab\` |
| iso-squares-game | Web | `opusBackground` | Project: `C:\Users\Freedom_Fighter_01\Iso-Squares_Game\` |
| AsyncHeroes-MVP | Web | `languageBackground` | Project: `C:\Users\Freedom_Fighter_01\async-heroes\` |
| Trick-or-Treat-3D | Web | `scaredBackground` | No project folder located — check blog/repo history |
| pocket-pal | Mobile | `carapaceBackground` | Project: `C:\Users\Freedom_Fighter_01\AndroidStudioProjects\` (likely) |

## Related Game Project Folders

### C:\Users\Freedom_Fighter_01\
- `VrBrowserLab/`
- `Iso-Squares_Game/`
- `async-heroes/`
- `Village_Hauler/`
- `Roblox-Racer/`
- `icarus_00/`
- `Unity_Example_01/`, `unityExample_00/`
- `AndroidStudioProjects/`

### A:\
- `Unreal_Projects\SICKAMANSION\` — full Unreal project, can capture screenshots in-engine
- `Unreal_Projects\lyra_test_game\`
- `Unity_Projects\` (large, search timed out)
- `Roblox_Projects\` (Platforms_02.rbxl, Platforms_04.rbxl)
- `Fortnite_Projects\`

### A:\images\site\game_icons\
- `robo_battler\` — Robo-Battler icons and enemy art
- `ue\rts_folder\` — RTS / tank icons (multiple resolutions + SVG)
- `ue\kuromi_flyer\` — Kuromi Flyer icons
- `ue\vr_opus\vr_opus.PNG`

### A:\images\cyberspace_sky\opus_art\
- `screenshots_00.psd` + `screenshot_01.png` through `screenshots_07.png` — Opus VR screenshots
- `opus_concept_art\` — `opus_village_00.jpg` through `_02.jpg`, `matter_compiler_00.jpg` through `_05.jpg`
- `hands_00.PNG`
- `OPUS_VR_Sample.pdf`

## Recommendations

1. **Open `language_link_template_00.psd` first** — paired 1:1 with an existing showcase, so it reveals the exact layer structure (title, tagline, splash placement) used as the template for the `_Showcase_` export.

2. **Confirm whether `cyberspace_sky_template_00.psd` is the true master** — if it contains smart-object slots for game art, it is the fastest path to generating the remaining seven showcases.

3. **Prioritize the games that already have source art:**
   - **Robo-Battler** — icons available immediately
   - **Opus VR** — already has a showcase, but abundant screenshots are available if a `_02` or `_03` variant is ever needed
   - **Kuromi Flyer** — icon PSD available

4. **Capture-required games** — need in-engine screenshots or new renders:
   - mini-RC-Racer (open Roblox Studio files)
   - VrBrowserLab, iso-squares-game, AsyncHeroes-MVP, Trick-or-Treat-3D (run locally, capture)
   - pocket-pal (emulator capture at Razr outer-screen resolution)

5. **Naming convention** — keep the exact pattern `{GameName}_Showcase_{NN}.png`. Note the existing set mixes underscores and hyphens (`Kuromi-Flyer-Showcase-01.png` vs `OPUS_VR_Showcase_01.png`); standardizing on underscores would simplify imports in `Projects.js`.
