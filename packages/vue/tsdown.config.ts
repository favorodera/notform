import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: { tsc: { vue: true } },
  entry: ['src/index.ts', 'src/types.ts'],
  exports: true,
  fromVite: true,
  minify: true,
  platform: 'neutral',
})
