import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['churn-prediction-z0tl.onrender.com'],
  },
  preview: {
    allowedHosts: ['churn-prediction-z0tl.onrender.com'],
  },
})
