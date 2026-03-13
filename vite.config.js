import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: ['favicon.ico'],

      manifest: {
        name: 'PWD Water Leakage Monitoring',
        short_name: 'SVADS',
        description: 'Water Leakage Monitoring System for PWD',

        theme_color: '#0f2027',
        background_color: '#ffffff',

        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',

        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  build: {
    // Increase warning limit slightly
    chunkSizeWarningLimit: 1000,

    // Modern JS build
    target: 'esnext',

    // Fast minifier
    minify: 'esbuild'
  },

  // Faster dependency optimisation during development
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }

})