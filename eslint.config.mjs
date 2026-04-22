import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import { fileURLToPath, URL } from 'node:url'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/**/*.js', '**/**/*.mjs', '**/**/*.vue', '**/**/*.ts'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/playwright-report/**',
    '**/test-results/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/.turbo/**',
    '**/node_modules/**',
    '**/pnpm-lock.yaml',
    '**/package-lock.json',
  ]),

  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    files: ['**/**/__tests__/*'],
    ...pluginVitest.configs.recommended,
  },

  {
    files: ['apps/docs/**/*.{vue,ts}'],
    plugins: { 'better-tailwindcss': betterTailwind },
    settings: {
      'better-tailwindcss': {
        entryPoint: fileURLToPath(new URL('./apps/docs/app/assets/css/main.css', import.meta.url)),
      },
    },
    rules: {
      ...betterTailwind.configs['recommended-error'].rules,
      'better-tailwindcss/no-unregistered-classes': 'off',
      'better-tailwindcss/no-unknown-classes': ['warn', {
        detectComponentClasses: true,
      }],
    },
  },

  {
    plugins: { '@stylistic': stylistic },
    rules: { ...stylistic.configs.recommended.rules },
  },

  {
    rules: {
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 2, maxBOF: 0 }],
      '@stylistic/padded-blocks': 'off',
      '@stylistic/no-trailing-spaces': ['error', { skipBlankLines: true }],
      '@stylistic/brace-style': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/block-tag-newline': ['error', { multiline: 'ignore', singleline: 'ignore' }],
      'vue/multiline-html-element-content-newline': ['error', { allowEmptyLines: true, ignores: ['pre', 'textarea'] }],
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
    },
  },
)
