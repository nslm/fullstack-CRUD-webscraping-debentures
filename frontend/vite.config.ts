import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { config as loadDotenv } from 'dotenv'

// Load the .env.dev file that sits in the repository root (parent folder)
loadDotenv({ path: path.resolve(__dirname, '..', '.env.dev') })

// We also expose process.env to the client so import.meta.env.VITE_API_BASE is available.
// Only VITE_ prefixed variables will be accessible via import.meta.env in the client side.
export default defineConfig({
  plugins: [react()],
  define: {
    // keep this minimal; import.meta.env.* will be populated by Vite normally for VITE_ vars.
    // We still include process.env so code that references it during build won't break.
    'process.env': process.env
  },
  server: {
    port: 5173
  }
})
