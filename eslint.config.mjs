import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import betterTailwind from 'eslint-plugin-better-tailwindcss'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/**/*.{vue,ts,mts,tsx}'],
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
    ...pluginVitest.configs.recommended,
    files: ['**/**/__tests__/*'],
  },

  {
    plugins: { 'better-tailwindcss': betterTailwind },
    rules: { ...betterTailwind.configs['recommended-error'].rules },
    files: ['apps/docs/**/*.{vue,ts,mts,tsx}'],
    settings: {
      'better-tailwindcss': {
        entryPoint: './apps/docs/assets/css/index.css',
      },
    },
  },

  {
    files: ['**/**/*.js', '**/**/*.mjs', '**/**/*.vue', '**/**/*.ts'],
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
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      'better-tailwindcss/no-unregistered-classes': 'off',
      'better-tailwindcss/no-unknown-classes': ['warn', {
        ignore: [
          'stars',
          'star-layer',
          'star'
        ]
      }],
    },
  },
)
