import { defineConfig } from 'vite';

// Standalone extraction of the animated-GLB harness, vendored here because the original
// lives as a second entry point inside the game client's Vite app, which has no multi-page
// rollup input and whose public/ tree is 189 MB. The game client stays unmodified.
//
// publicDir:false — the 58 GLBs already live at public/harness/animation/models/ in the
// portfolio. Copying dist/ over that folder must not clobber or duplicate them.
export default defineConfig({
  base: '/harness/animation/',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input: 'anim-test.html' },
  },
});
