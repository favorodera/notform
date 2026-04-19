import tailwindcss from '@tailwindcss/vite'
import { defineSoftwareApp } from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/seo',
    'motion-v/nuxt',
    'notform-nuxt',
    'nuxt-llms',
  ],

  compatibilityDate: '2024-07-11',

  experimental: {
    asyncContext: true,
  },

  devtools: {
    enabled: false,
  },

  site: {
    url: 'https://notform-docs.vercel.app',
    name: 'NotForm',
    description: 'Vue forms without the friction.',
    indexable: true,
    defaultLocale: 'en',
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },

      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          charset: 'utf-8',
        },
      ],

      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
          sizes: '48x48',
        },
        {
          rel: 'icon',
          href: '/favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
        },
        {
          rel: 'icon',
          href: '/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          rel: 'icon',
          href: '/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
          sizes: 'any',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
      ],
    },

    pageTransition: {
      name: 'fade-out-in',
      mode: 'out-in',
    },

    layoutTransition: {
      name: 'fade-out-in',
      mode: 'out-in',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/docs/**': { prerender: true },
    '/docs': { redirect: '/docs/get-started' },
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  nitro: {
    prerender: {
      routes: [
        '/',
        '/docs/**',
      ],
      crawlLinks: true,
      autoSubfolderIndex: false,
    },
  },

  ui: {
    content: true,
  },

  icon: {
    provider: 'iconify',
    mode: 'svg',
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
  },

  fonts: {
    families: [
      { name: 'Geist', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], global: true },
      { name: 'Geist Mono', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], global: true },
    ],
  },

  vite: {
    plugins: [
      tailwindcss() as any,
    ],
    optimizeDeps: {
      include: [
        'zod',
        '@vueuse/core',
      ],
    },
  },

  sitemap: {
    zeroRuntime: true,
  },

  ogImage: {
    zeroRuntime: true,
  },

  // seo: { redirectToCanonicalSiteUrl: true },

  schemaOrg: {
    identity: defineSoftwareApp({
      'name': 'NotForm',
      'url': 'https://notform-docs.vercel.app',
      'description': 'Vue forms without the friction.',

      '@type': 'SoftwareApplication',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web',

      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },

      'sameAs': [
        'https://www.npmjs.com/package/notform',
        'https://www.npmjs.com/package/notform-nuxt',
        'https://github.com/favorodera/notform',
      ],

      'keywords': [
        'Vue forms',
        'Nuxt form validation',
        'Vue 3 form library',
        'TypeScript form validation',
        'headless form components',
      ],

      'author': {
        '@type': 'Person',
        'name': 'Favour Emeka',
        'url': 'https://favorodera.vercel.app',
      },
    }),
  },

  llms: {
    domain: 'https://notform-docs.vercel.app',
    title: 'NotForm',
    description: 'Vue forms without the friction.',
    full: {
      title: 'NotForm',
      description: 'Vue forms without the friction.',
    },
    sections: [
      {
        title: 'Get Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' },
        ],
      },
      {
        title: 'Components',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/components%' },
        ],
      },
      {
        title: 'Composables',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/composables%' },
        ],
      },
      {
        title: 'Advances',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/advanced%' },
        ],
      },
    ],
  },

  mcp: {
    name: 'NotForm',
  },
})