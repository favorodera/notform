// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  extends: ['shadcn-docs-nuxt'],

  modules: ['@nuxt/eslint'],

  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'type="image/svg+xml', href: '/favicon.svg', sizes: 'any' },
      ],
    },
    rootAttrs: {
      id: 'app',
      lang: 'en',
    },
    pageTransition: { name: 'fade-out-in', mode: 'out-in' },
    layoutTransition: { name: 'fade-out-in', mode: 'out-in' },
  },

  css: [
    './app/assets/css/tailwind.css',
    './app/assets/css/app.css',
  ],

  experimental: {
    typedPages: true,
  },
  compatibilityDate: '2025-07-15',

  vite: { plugins: [tailwindcss()] },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
      },
    ],
  },

  icon: {
    mode: 'svg',
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
  },
})
