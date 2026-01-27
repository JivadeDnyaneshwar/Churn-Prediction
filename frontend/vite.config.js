import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    allowedHosts: [
      'churn-prediction-z0tl.onrender.com'
    ]
  },
  preview: {
    allowedHosts: [
      'churn-prediction-z0tl.onrender.com'
    ]
  }
})

