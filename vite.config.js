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