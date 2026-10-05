import { factory } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

const config = factory({
  ignores: ['public/repl-workers/**', 'public/playground-templates/**'],
  tailwind: {
    entryPoint: 'app/assets/css/main.css',
  },
})
  .override('favorodera/typescript/rules', {
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })

export default withNuxt(config)
