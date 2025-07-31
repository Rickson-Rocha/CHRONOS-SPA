import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
    server: {
    proxy: {
      // Redireciona requisições que começam com /api para o seu backend
      '/api': {
        target: 'http://localhost:8080', // A URL do seu backend
        changeOrigin: true, // Necessário para o proxy funcionar corretamente
        secure: false,      // Se o seu backend não usa https
      }
    }
  }
})
