import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import betterTailwind from 'eslint-plugin-better-tailwindcss'

const __filepath = fileURLToPath(import.meta.url)
const __dirname = dirname(__filepath)

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    files: ['**/*.js', '**/*.mjs', '**/*.vue', '**/*.ts'],
    plugins: { '@stylistic': stylistic },
    rules: { ...stylistic.configs.recommended.rules },
  },

  {
    plugins: {
      'better-tailwindcss': betterTailwind,
    },
    rules: { ...betterTailwind.configs['recommended-error'].rules },
    settings: {
      'better-tailwindcss': {
        entryPoint: './main.css',
      },
    },
  },

  {
    rules: {
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 2, maxBOF: 0 }],
      '@stylistic/padded-blocks': 'off',
      '@stylistic/no-trailing-spaces': ['error', { skipBlankLines: true }],
      'vue/multi-word-component-names': 'off',
      'better-tailwindcss/no-unregistered-classes': 'off',
    },
  },

  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },
)
