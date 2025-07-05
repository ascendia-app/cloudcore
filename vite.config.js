import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/cloudcore/', // 👈 IMPORTANT: use the exact name of your GitHub repo
  plugins: [react()],
})
