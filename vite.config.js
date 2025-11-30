import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detect if building for Tauri (desktop) or Capacitor (mobile) or web deployment
const isTauri = process.env.TAURI_ENV_PLATFORM !== undefined
const isCapacitor = process.env.CAPACITOR_PLATFORM !== undefined

// Use root path for Tauri/Capacitor builds, GitHub Pages path for web
const baseUrl = (isTauri || isCapacitor) ? '/' : '/MOUNTE-CRISTO/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: baseUrl,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Use terser for more aggressive minification and smaller bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    // Target modern browsers for smaller output
    target: 'esnext',
    // Inline assets smaller than 10KB
    assetsInlineLimit: 10240,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // Prevent unnecessary file watching in production builds
  clearScreen: false
})
