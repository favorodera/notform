import { factory } from '@favorodera/eslint-config'

export default factory({
  css: false,
  tailwind: false,
})
  .override('favorodera/typescript/rules', {
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })
