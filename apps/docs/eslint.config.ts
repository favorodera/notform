import { factory } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(factory({
  tailwind: {
    settings: {
      entryPoint: 'app/assets/css/main.css',
    },
  },
}))
