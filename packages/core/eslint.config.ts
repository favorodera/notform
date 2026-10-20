import { factory } from '@favorodera/eslint-config'

export default factory({
  css: false,
  tailwind: false,
})
  .overrideRules({
  'ts/no-explicit-any': 'off',
  'unicorn/prefer-ternary':'off'
 })
