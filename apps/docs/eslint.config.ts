import { factory } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(factory({
  markdown: false,
  tailwind: {
    entryPoint: 'app/assets/css/main.css',
  },
})
  .override('favorodera/typescript/rules', {
    rules: {
      'ts/no-explicit-any': 'off',
    },
  }))
