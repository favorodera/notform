import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  css: false,
  perfectionist: {
    settings: {
      tsconfig: {
        rootDir: '',
      },
    },
  },
  tailwind: false,
  vitest: false,
})
