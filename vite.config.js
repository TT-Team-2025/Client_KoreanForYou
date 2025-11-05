import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 🔹 FastAPI 서버 주소
        changeOrigin: true,              // 🔹 Origin 헤더 맞춰주기
        secure: false,                   // 🔹 HTTPS가 아닐 경우 false
      },
    },
  },
})
