import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { config as loadDotenv } from 'dotenv'


loadDotenv({ path: path.resolve(__dirname, '..', '.env.dev') })


export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    port: 5173
  }
})
