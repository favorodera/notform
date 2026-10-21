import { factory } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

const config = factory({
  ignores: [
    'public/repl-workers/**',
    'public/playground-templates/**',
  ],
  tailwind: {
    entryPoint: 'app/assets/css/main.css',
  },
})
  .append({
    rules: {
      'node/no-unsupported-features/node-builtins': 'off',
      'ts/no-explicit-any': 'off',
    },
  })

export default withNuxt(config)
