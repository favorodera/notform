import { factory } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(factory({
  tailwind: {
    settings: {
      entryPoint: 'app/assets/css/main.css',
    },
  },
})
  .overrides({
    'favorodera/markdown/code-in-md/disables': {
      rules: {
        'unused-imports/no-unused-vars': 'off',
        'vue/no-unused-vars': 'off',
      },
    },
    'favorodera/markdown/rules': {
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    },
  }))
