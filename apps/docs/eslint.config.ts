import { factory } from '@favorodera/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(factory({
  markdown: false,
  tailwind: {
    settings: {
      entryPoint: 'app/assets/css/main.css',
    },
  },
}))
