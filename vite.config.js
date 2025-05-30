import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react()],
  base: "/LumiTix-vite/",
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src'),
      '@': fileURLToPath(new URL("./src", import.meta.url))
    },
  },
})
