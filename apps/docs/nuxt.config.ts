import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/seo',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    'motion-v',
    'shadcn-nuxt',
  ],

  site: {
    url: 'https://notform-docs.vercel.app',
    name: 'NotForm Documentation',
  },

  devtools: false,

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  seo: {
    redirectToCanonicalSiteUrl: true,
  },

  sitemap: {
    zeroRuntime: true,
    strictNuxtContentPaths: true,
  },

  shadcn: {
    prefix: '', // no component prefix — use bare shadcn names
    componentDir: '@/components/shadcn',
  },

  vite: {
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tailwindcss() as any,
    ],
    optimizeDeps: {
      include: [
        'class-variance-authority',
        'reka-ui',
        '@vueuse/core',
        'clsx',
        'tailwind-merge',
      ],
    },
  },

  colorMode: {
    classSuffix: '',
  },

  experimental: {
    asyncContext: true,
  },

  components: [
    './components',
  ],

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
        // Favicon set — covers all major browsers and Apple devices
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      ],
    },
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

  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },

  css: ['~/assets/css/main.css'],

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
    domain: 'https://notform-docs.vercel.app/',
    title: 'NotForm Documentation',
    description: 'Vue Forms Without the Friction',
    full: {
      title: 'NotForm Documentation - Full Documentation',
      description: 'This is the full documentation for the NotForm Documentation.',
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
        title: 'Composables',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/composables%' },
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
        title: 'Integrations',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/integrations%' },
        ],
      },
    ],
  },

  mcp: {
    name: 'NotForm documentation',
  },
})
