import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Der Punkt sorgt dafür, dass alle Pfade relativ sind.
  // Damit läuft die App in jedem Unterordner.
  base: './',
})
