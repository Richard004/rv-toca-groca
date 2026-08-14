import { defineConfig } from 'vite';

export default defineConfig({
  base: '/rv-toca-groca/',
  publicDir: 'public',
  preview: { port: 4173, strictPort: true },
  server: { port: 5173, strictPort: false },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    emptyOutDir: true
  }
});
