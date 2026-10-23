import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['10.58.20.210.nip.io', '.nip.io']
  },
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      includeAssets: ['favicon.ico', 'proxima_logo.webp', 'proxima_centauri.webp', 'og-image.jpg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Proxima Notes',
        short_name: 'Proxima',
        description: 'Clean, offline-first notes application',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'proxima_logo.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'proxima_logo.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      }
    })
  ],
})