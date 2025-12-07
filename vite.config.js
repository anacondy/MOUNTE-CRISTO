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
        passes: 2,
        pure_funcs: ['console.log']
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
    // Optimize chunk sizes for better caching
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        },
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Report compressed size for optimization insights
    reportCompressedSize: true
  },
  server: {
    port: 3000,
    open: true,
    // Enable hot module replacement for faster development
    hmr: {
      overlay: true
    }
  },
  // Prevent unnecessary file watching in production builds
  clearScreen: false,
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: []
  }
})
