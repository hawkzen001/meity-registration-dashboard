import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/meity-registration-dashboard/',
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: false
  }
});
