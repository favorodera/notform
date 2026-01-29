// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import favoroderaConfig from '@favorodera/nuxt-eslint-config'
import betterTailwind from 'eslint-plugin-better-tailwindcss'

export default withNuxt()
  .append(favoroderaConfig)
  .append({
    plugins: {
      'better-tailwindcss': betterTailwind
    },
    rules: { ...betterTailwind.configs['recommended-error'].rules },
    settings: {
      'better-tailwindcss': {
        entryPoint: './app/assets/css/main.css'
      }
    }
  })
  .append({
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname
      }
    }
  })
  .overrideRules({
    'better-tailwindcss/no-unregistered-classes': 'off',
    'better-tailwindcss/no-unknown-classes': ['warn', {
      ignore: [
        'stars',
        'star-layer',
        'star'
      ]
    }],
    '@typescript-eslint/no-empty-object-type': [
      'error',
      { allowInterfaces: 'with-single-extends' }
    ]
  })
