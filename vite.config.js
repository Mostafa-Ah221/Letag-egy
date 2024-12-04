import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/leetago-pro/",
   server: {
    proxy: {
      '/api': {
        target: 'https://demo.leetag.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
