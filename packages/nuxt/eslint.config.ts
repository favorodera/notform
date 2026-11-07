// @ts-check
import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  css: false,
  pnpm: {
    pnpmWorkspace: false,
  },
  tailwind: false,
  vitest: false,
  vue: false,
  yaml: {
    pnpmWorkspace: false,
  },
})
.append({
    files: ['package.json'],
    rules: {
      'jsonc/array-bracket-newline': 'off',
    },
  })
