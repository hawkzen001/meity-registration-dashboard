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
    open: false,
    watch: {
      // Exclude locked/binary files that Vite should never watch
      ignored: [
        '**/*.xlsx',
        '**/*.xls',
        '**/scratch_*.py',
        '**/scratch_*.json',
        '**/scratch_*.txt',
        '**/Exisiting Enrollment Data*/**',
      ]
    }
  }
});

