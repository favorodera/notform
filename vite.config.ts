import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    reporters: ['default', 'html'],
    outputFile: './.vitest/report.html',
    typecheck: { enabled: true },
    projects: [
      {
        test: {
          name: 'unit',
          root: './src',
          environment: 'node',
          include: ['../src/tests/unit/*.test.ts'],
        },
      },
    ],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'valid',
      fileName: format => `valid.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'zod'],
      output: {
        globals: {
          vue: 'Vue',
          zod: 'Zod',
        },
      },
    },
  },
})
