import tailwindcss from '@tailwindcss/vite'
import { defineSoftwareApp } from 'nuxt-schema-org/schema'

const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900]

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          href: '/favicon.ico',
          rel: 'icon',
          sizes: '48x48',
        },
        {
          href: '/favicon.svg',
          rel: 'icon',
          sizes: 'any',
          type: 'image/svg+xml',
        },
        {
          href: '/icon-32x32.png',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          href: '/icon-192x192.png',
          rel: 'icon',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          href: '/icon-512x512.png',
          rel: 'icon',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          href: '/icon-16x16.png',
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          href: '/icon.svg',
          rel: 'icon',
          sizes: 'any',
          type: 'image/svg+xml',
        },
        {
          href: '/apple-touch-icon.png',
          rel: 'apple-touch-icon',
          sizes: '180x180',
        },
      ],
      meta: [
        {
          content: 'width=device-width, initial-scale=1',
          name: 'viewport',
        },
        {
          charset: 'utf8',
        },
        {
          content: 'qYU6PqljRftNzCNBLdEFxnKJKwH-Aj7aJ9CLp6itnhM',
          name: 'google-site-verification',
        },
      ],
    },
    layoutTransition: {
      mode: 'out-in',
      name: 'fade-out-in',
    },
    pageTransition: {
      mode: 'out-in',
      name: 'fade-out-in',
    },
  },
  compatibilityDate: '2026-06-21',
  components: [
    { path: '~/demos', prefix: 'Demos' },
    '~/components',
  ],
  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3000,
  },
  devtools: {
    enabled: true,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  experimental: {
    asyncContext: true,
  },
  fonts: {
    families: [
      { global: true, name: 'Geist', weights: fontWeights },
      { global: true, name: 'Geist Mono', weights: fontWeights },
    ],
  },
  icon: {
    componentName: 'NIcon',
    customCollections: [
      {
        dir: './app/assets/icons',
        prefix: 'custom',
      },
    ],
    mode: 'svg',
    provider: 'iconify',
  },
  llms: {
    description: 'Vue forms without the friction.',
    domain: 'https://notformdocs.vercel.app',
    full: {
      description: 'Vue forms without the friction.',
      title: 'NotForm',
    },
    sections: [
      {
        contentCollection: 'docs',
        contentFilters: [{ field: 'path', operator: 'LIKE', value: '/getting-started%' }],
        title: 'Getting Started',
      },
      {
        contentCollection: 'docs',
        contentFilters: [{ field: 'path', operator: 'LIKE', value: '/components%' }],
        title: 'Components',
      },
      {
        contentCollection: 'docs',
        contentFilters: [{ field: 'path', operator: 'LIKE', value: '/composables%' }],
        title: 'Composables',
      },
      {
        contentCollection: 'docs',
        contentFilters: [{ field: 'path', operator: 'LIKE', value: '/advanced%' }],
        title: 'Advanced',
      },
    ],
    title: 'NotForm',
  },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/seo',
    'motion-v/nuxt',
    'notform-nuxt',
    'nuxt-llms',
    '@vercel/analytics',
    '@nuxt/eslint',
  ],
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: [
        '/',
        '/sitemap.xml',
        '/robots.txt',
      ],
    },
  },
  ogImage: {
    zeroRuntime: true,
  },
  schemaOrg: {
    identity: defineSoftwareApp({
      'description': 'Vue forms without the friction.',
      'name': 'NotForm',
      'url': 'https://notformdocs.vercel.app',

      '@type': 'SoftwareApplication',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web',

      'aggregateRating': {
        '@type': 'AggregateRating',
        'bestRating': '5',
        'ratingValue': '4.9',
        'reviewCount': '13',
        'worstRating': '1',
      },

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
  site: {
    defaultLocale: 'en',
    description: 'Vue forms without the friction.',
    indexable: true,
    name: 'NotForm',
    url: 'https://notformdocs.vercel.app',
  },
  sitemap: {
    zeroRuntime: true,
  },
  ui: {
    prefix: '',
  },
  vite: {
    optimizeDeps: {
      include: [
        'zod',
        '@vueuse/core',
      ],
    },
    plugins: [tailwindcss()],
  },
})
