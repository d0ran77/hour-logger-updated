import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// This configuration is required for Tailwind v4 to process your styles
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})