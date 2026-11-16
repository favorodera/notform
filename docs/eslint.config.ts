import { defineConfig } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

const config = defineConfig({
  codeInMarkdown: {
    overrides: {
      'vue/no-mutating-props': 'off',
    },
  },
  ignores: ['public/playground/'],
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
