import { defineConfig } from 'vite';

// The 178 GLBs, their event sidecars and manifest.json live at public/harness/ps1-digimon/
// in the portfolio, written there by tools/build-assets.mjs.
//
// build: publicDir:false, so copying dist/ over that folder cannot clobber or duplicate
//        them -- the build emits only index.html and assets/.
// dev:   publicDir points AT that folder, so `npm run dev` serves the real assets at the
//        same base path production uses. Open /harness/ps1-digimon/ (the directory), not
//        /harness/ps1-digimon/index.html: the latter would hit a previously built copy.
//
// The entry is index.html (not a named page like the animation harness's anim-test.html)
// so the harness resolves at the bare directory URL /harness/ps1-digimon/.
export default defineConfig(({ command }) => ({
  base: '/harness/ps1-digimon/',
  publicDir: command === 'serve' ? '../../public/harness/ps1-digimon' : false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input: 'index.html' },
  },
}));
