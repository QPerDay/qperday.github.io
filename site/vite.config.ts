import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // Hosted at the domain root (https://qperday.github.io/), so the base is `/`.
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    // Vite minifies CSS with Lightning CSS. With the default
    // `baseline-widely-available` target it rewrites media queries like
    // `(max-width: 640px)` into the Level 4 range syntax `(width<=640px)`,
    // which is unsupported (and unparseable) in Safari < 16.4 and some older
    // browsers/tools. Pinning Safari/iOS to 16.3 keeps the traditional
    // `max-width`/`min-width` form while leaving everything else on the
    // baseline target unchanged.
    cssTarget: [
      'chrome111',
      'edge111',
      'firefox114',
      'safari16.3',
      'ios16.3',
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
