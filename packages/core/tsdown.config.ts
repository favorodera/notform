import { defineConfig } from 'tsdown'

export default defineConfig({
  platform: 'neutral',
  exports: true,
  fromVite: true,
  dts: { vue: true },
  deps: {
    neverBundle: [
      'type-fest',
      'tagged-tag',
      'vue',
      'klona',
      'dequal',
      'dot-prop',
      '@standard-schema/spec',
    ],
  },
})
