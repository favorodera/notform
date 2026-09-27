/// <reference types="vitest/config" />
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.{ts,vue}'],
    },
    environment: 'happy-dom',
  },
})
