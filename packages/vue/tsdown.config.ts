import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: { tsc: { vue: true } },
  exports: true,
  fromVite: true,
  platform: 'neutral',
})
