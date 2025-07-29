// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/titleMSU/', // ← имя репозитория на GitHub
  plugins: [react()],
})
