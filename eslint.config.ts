import { factory } from '@favorodera/eslint-config'

export default factory({
  css: false,
  ignores: [
    'packages/',
    'apps/',
    '**/.turbo/',
  ],
  tailwind: false,
  test: false,
})
