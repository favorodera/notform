import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: { vue: true },
  exports: true,
  fromVite: true,
  platform: 'neutral',
})
