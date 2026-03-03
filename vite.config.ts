import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Expose to network
    port: 5173,
  },
  // Use pill.html when running in pill mode
  ...(mode === 'pill' && {
    build: {
      rollupOptions: {
        input: {
          pill: path.resolve(__dirname, 'pill.html'),
        },
      },
    },
  }),
}))
