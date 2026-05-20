/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      "/api": {
        // HTTPS directo: evita el 307 de http://5298 que quita el JWT y da 401.
        target: "https://localhost:7060",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals:true,
    setupFiles: './src/tests/setup.ts',
  }
})
