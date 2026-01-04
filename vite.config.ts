import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// GitHub Pages 路徑：如果倉庫名稱是 NSTC，URL 應該是 https://kaibo903.github.io/NSTC/
export default defineConfig({
  plugins: [vue()],
  base: '/NSTC/',
})
