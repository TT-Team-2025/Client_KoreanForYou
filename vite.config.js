import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // FastAPI 서버 주소
        changeOrigin: true,
        rewrite: (path) => path,           // /api 유지
      },
    },
  },
})
