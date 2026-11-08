import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite runs the dev server and builds the app.
// Vitest reads this same file, so the app and the tests share one setup.
export default defineConfig({
  plugins: [react()],
})
