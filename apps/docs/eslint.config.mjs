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
        entryPoint: './assets/css/main.css'
      }
    }
  })
  .append({
    ignores: ['./app/components/**/*.vue, ./app/components/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  })
  .overrideRules({
    'better-tailwindcss/no-unregistered-classes': ['warn', {
      ignore: ['toaster']
    }],
    '@typescript-eslint/no-empty-object-type': [
      'error',
      { allowInterfaces: 'with-single-extends' }
    ]
  })
