import { defineConfig } from 'tsdown'

export default defineConfig({
  platform: 'neutral',
  exports: true,
  fromVite: true,
  dts: { vue: true },
})
