import { factory } from '@favorodera/eslint-config'

export default factory({
  css: false,
  tailwind: false,
})
  .append({
    rules: {
      'no-param-reassign': 'off',
      'no-unmodified-loop-condition': 'off',
      'test/max-expects': 'off',
      'test/no-hooks': 'off',
      'ts/no-dynamic-delete': 'off',
      'ts/no-explicit-any': 'off',
      'ts/no-invalid-void-type': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/prefer-ternary': 'off',
      'vue/no-root-v-if': 'off',
    },
  })
