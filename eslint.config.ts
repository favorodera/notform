import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  css: false,
  ignores: ['docs/', 'packages/'],
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
