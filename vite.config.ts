import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
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
  },
});