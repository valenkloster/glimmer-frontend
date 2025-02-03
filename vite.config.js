import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Añade esta línea
    port: process.env.PORT || 10000, // Cambia el puerto
  },
  preview: {
    host: '0.0.0.0', // Añade esta configuración para preview
    port: process.env.PORT || 10000, // Mismo puerto
  },
  build: {
    outDir: 'dist' // Añade esta línea para especificar el directorio de salida
  }
})