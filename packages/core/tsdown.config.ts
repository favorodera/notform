import { defineConfig } from 'tsdown'

export default defineConfig({
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
  dts: { vue: true },
  exports: true,
  fromVite: true,
  platform: 'neutral',
})
