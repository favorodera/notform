import { factory } from '@favorodera/eslint-config'

export default factory({
  css: false,
  ignores: ['docs/', '**/.turbo/', 'packages/'],
  tailwind: false,
  test: false,
})
