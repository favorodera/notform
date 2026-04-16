import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
    'motion-v/nuxt',
  ],

  sitemap: {
    zeroRuntime: true,
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

  devtools: {
    enabled: false,
  },

  routeRules: {
    '/': { prerender: true },
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

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/',
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

  llms: {
    domain: 'https://docs-template.nuxt.dev/',
    title: 'Nuxt Docs Template',
    description: 'A template for building documentation with Nuxt UI and Nuxt Content.',
    full: {
      title: 'Nuxt Docs Template - Full Documentation',
      description: 'This is the full documentation for the Nuxt Docs Template.',
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' },
        ],
      },
      {
        title: 'Essentials',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/essentials%' },
        ],
      },
    ],
  },

  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        'zod',
        '@vueuse/core',
      ],
    },
  },

  seo: {
    redirectToCanonicalSiteUrl: true,
  },

  mcp: {
    name: 'NotForm',
  },

  ogImage: {
    enabled: false,
  },
})
