import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'  // ✅ Fix: define `global` for browser
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
})
