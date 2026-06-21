/// <reference types="vite/client" />

import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      'notform': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
    },
  },
})
