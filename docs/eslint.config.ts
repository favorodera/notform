import { defineConfig } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

const config = defineConfig({
  codeInMarkdown: {
    overrides: {
      'unused-imports/no-unused-vars': 'off',
    },
  },
  ignores: ['public/playground/'],
  node: {
    overrides: {
      'node/no-unsupported-features/es-syntax': 'off',
    },
  },
  tailwind: {
    settings: {
      entryPoint: 'app/assets/css/main.css',
    },
  },
  typescript: {
    overrides: {
      'typescript/no-explicit-any': 'off',
    },
  },
})

export default withNuxt(config)
