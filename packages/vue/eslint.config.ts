import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  pnpm: {
    pnpmWorkspace: false,
  },
  tailwind: false,
  typescript: {
    overrides: {
      'typescript/no-explicit-any': 'off',
    },
  },
  unicorn: {
    overrides: {
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/prefer-ternary': 'off',
    },
  },
  yaml: {
    pnpmWorkspace: false,
  },
})
