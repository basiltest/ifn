import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Project Pages serve under https://<user>.github.io/ifn/
  base: '/ifn/',
  plugins: [react()],
  server: { port: 5173, open: false },
})
