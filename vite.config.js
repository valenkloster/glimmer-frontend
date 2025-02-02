import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173,
  },
  // Añade esta configuración para manejar rutas
  build: {
    outDir: 'dist', // Asegúrate de que la carpeta de salida sea 'dist'
  }
})