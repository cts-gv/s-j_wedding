import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from /<repo-name>/, so the deploy workflow sets VITE_BASE
  // to that path. Cloudflare Pages serves the site from its own root ("/") and sets CF_PAGES
  // automatically during its builds, so that case always wins here, no matter what VITE_BASE
  // (or Cloudflare's own build settings) might say.
  base: process.env.CF_PAGES ? '/' : (process.env.VITE_BASE ?? '/'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
