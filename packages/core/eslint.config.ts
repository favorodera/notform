import { factory } from '@favorodera/eslint-config'

export default factory({
  jsdoc: {
    overrides: {
      'jsdoc/lines-before-block': [
        'error',
        {
          ignoreSingleLines: false,
        },
      ],
    },
  },
  tailwind: false,
  typescript: {
    overrides: {
      'ts/no-explicit-any': 'off',
    },
  },
})
