import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/study-notes-hub/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        headers: path.resolve(__dirname, 'public/_headers'),
      },
    },
  },
  publicDir: 'public',
  server: {
    middleware: (req, res, next) => {
      if (req.url.startsWith('/pdfs/')) {
        res.setHeader('Content-Type', 'application/pdf');
      }
      next();
    },
  },
})