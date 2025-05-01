import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/JS-Runtime-Lens/', // GitHub repo 이름
  plugins: [react()],
})
