import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seo } from './seo.config'
import path from 'path'

export default defineConfig({
  plugins: [react(), seo()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: { chunkSizeWarningLimit: 1100 },
})
