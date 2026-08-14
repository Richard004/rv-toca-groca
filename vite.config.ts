import { defineConfig } from 'vite';

export default defineConfig({
  base: '/rv-toca-groca/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    emptyOutDir: true
  }
});
