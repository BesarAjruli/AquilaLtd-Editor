import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const backendUrl = process.env.VITE_BACKEND_URL;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': backendUrl,
    },
  },
  build: {
    minify: 'terser',
    sourcemap: false
  }
})
