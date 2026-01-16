import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [vue()],
  test: {
    typecheck: { enabled: true },
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.ts'],
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          channel: 'chromium',
        },
      }),
      headless: true,
      instances: [
        { browser: 'chromium' },
        {
          browser: 'firefox',
          provider: playwright(),
        },
      ],
    },
  },
})

