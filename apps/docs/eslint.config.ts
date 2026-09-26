import { factory } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(factory({
  ignores: ['public/repl-workers/**'],
  tailwind: {
    entryPoint: 'app/assets/css/main.css',
  },
})
  .override('favorodera/typescript/rules', {
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })
  .override('favorodera/javascript/rules', {
    files: ['public/playground-templates/**/*.vue'],
    rules: {
      'no-alert': 'off',
    },
  })
  .override('favorodera/node/rules', {
    files: ['public/playground-templates/**/*.vue'],
    rules: {
      'node/no-extraneous-import': 'off',
    },
  }))
