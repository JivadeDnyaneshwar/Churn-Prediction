import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Bind to 0.0.0.0 for Render external access
    port: Number(process.env.PORT) || 5173, // Use Render PORT or fallback
    allowedHosts: [
      'churn-predictions.onrender.com' // Your Render domain
    ]
  }
})
