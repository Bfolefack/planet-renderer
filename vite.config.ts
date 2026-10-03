import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  root: 'src',                // app entry (index.html) lives in src/ so the repo root can hold the built site
  publicDir: '../public',
  base: '/planet-renderer/',  // GitHub Pages serves the site from /<repo-name>/
  plugins: [
    glsl({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
      minify: false,        // keep readable for debugging
      watch: true,            // HMR for shader changes
      defaultExtension: 'glsl',
    }),
  ],
  server: {
    port: 5173,
    open: true,               // auto-open browser on dev start
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    outDir: '..',         // built site is written to the repo root, served by GitHub Pages (main, /)
    emptyOutDir: false,   // never wipe the repo root; stale assets are removed by `npm run clean`
  },
});