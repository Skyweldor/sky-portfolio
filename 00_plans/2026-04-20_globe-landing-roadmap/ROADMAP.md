# Globe Landing Page — Roadmap

_Source: user voice/notes, 2026-04-20. Big-picture first; tickets follow._

---

## 1. Go Live

**Goal:** Take the site public.

- Purchase production domain.
- Configure DNS / hosting for the globe landing page.
- Flip site from private/preview to publicly reachable.

---

## 2. Pokedex Overhaul

**Goal:** Pokedex becomes a single, scalable surface instead of a sprawl of entries, with richer filtering.

### 2a. Condense entry points
- Create a **pinned blog post** that serves as *the* Pokedex entry.
- Collapse the current Pokedex surface area down to a single link from the directory → this pinned post.

### 2b. Scale the data
- **Lazy-load all Pokemon** — target "as many as possible," not just the seeded subset.
- Review current data pipeline and loader to identify the ceiling and what needs to change to push past it.

### 2c. Regions UI → add an [All] default
- Add an **[All] regions** option as the default view of the Pokedex.
- With [All] selected, type filters work across the full roster — e.g., "show me every **Poison** type in PokeMMO" returns matches from every region in one list.
- Individual regions remain selectable to narrow the view; [All] is just the new starting point.

---

## 3. Directory Mini-Dropdowns

**Goal:** The landing page sub-site directory (Game Development, Stickers eCommerce, Pokedex, etc.) becomes navigable without a full page load.

- Each directory item gets a **mini dropdown** adjacent to it.
- The dropdown **mirrors the NavBar** of the destination sub-site — so hovering/clicking "Stickers eCommerce" previews its own nav options inline.
- Users can jump directly to a sub-page of a sub-site from the globe landing page.

---

## 4. ELEVATE — Text Animation Pass

**Goal:** Bring the landing page copy up to the level of a reference animation the user will supply.

- **Blocked on:** user-provided example file (incoming).
- Once received: match the animation style on the globe landing page's hero / headline copy.
- Scope TBD until the reference lands — could be one headline or a system.

---

## Open Questions

- Domain: already chosen, or still evaluating?
- Pokedex lazy-load: client-side on scroll, or chunked prefetch? What's the current source (PokeAPI, local JSON, scraped)?
- Directory dropdowns: hover-triggered or click? Desktop-only or mobile pattern too?
- ELEVATE: is the reference file a video, a CodePen, another site? (affects how we reproduce it)

---

## Suggested Sequencing

1. **ELEVATE reference** — lightweight, unblocks #4 once the file arrives.
2. **Directory mini-dropdowns** — pure frontend, contained scope, visible win on the landing page.
3. **Pokedex condense + pinned post** — prerequisite for the bigger dex work; low risk.
4. **Pokedex lazy-load + type filtering** — largest chunk; do after #3 so the entry point is stable.
5. **Domain + go-live** — last, so the public launch shows the above polish.
