# Animation harness — source

Source for the harness embedded in
[the animation-harness post](../../src/data/blog/animation-harness.js), served from
`public/harness/animation/`.

It lives here rather than only in the game client because `anim-test.html` is a second entry
point in `SynthCity_Interactive/titkok-live-game/client`, whose Vite config has no multi-page
rollup input and whose `public/` tree is 189 MB. The game client is not modified by anything
in this folder.

## Build

```bash
npm install
npm run build
```

Then copy `dist/` over `public/harness/animation/`. `publicDir` is `false`, so the build emits
only `anim-test.html` and `assets/` — the GLBs already sitting in
`public/harness/animation/models/` are left alone.

## Differences from the game client's copy

- Model paths resolve against `import.meta.env.BASE_URL`. The original used a leading-slash
  path, correct at a site root but broken under `/harness/animation/`, where the SPA fallback
  served `index.html` to `GLTFLoader`.
- Mobile layout: the mon and clip lists are horizontally-scrolling rows rather than wrapping
  blocks, and the camera fits the scene in portrait. Both exist only because the harness is
  published; the dev tool never needed them.
