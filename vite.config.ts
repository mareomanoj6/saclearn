import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' lets the built site run from any folder (or GitHub Pages / Netlify)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
