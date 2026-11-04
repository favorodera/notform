import { defineConfig } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

const config = defineConfig({
  codeInMarkdown: {
    overrides: {
      'tailwind/no-unknown-classes': 'off',
      'vue/no-mutating-props': 'off',
      'vue/no-root-v-if': 'off',
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
      entryPoint: 'app/assets/css/index.css',
    },
  },
  typescript: {
    overrides: {
      'typescript/no-explicit-any': 'off',
    },
  },
})

export default withNuxt(config)
