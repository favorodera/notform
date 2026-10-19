import { factory } from '@favorodera/eslint-config'

export default factory({
  css: false,
  ignores: ['docs/', '**/.turbo/',],
  tailwind: false,
})
.override('favorodera/typescript/rules', {
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })
