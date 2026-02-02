// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://notform-docs.vercel.app',
    name: 'NotForm Documentation'
  },

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    }
  },

  icon: {
    provider: 'iconify',
    mode: 'svg',
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons'
      }
    ]
  },

  llms: {
    domain: 'https://notform-docs.vercel.app/',
    title: 'NotForm Documentation',
    description: 'Effortless Vue Forms Validation',
    full: {
      title: 'NotForm Documentation - Full Documentation',
      description: 'This is the full documentation for the NotForm Documentation.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Composables',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/composables%' }
        ]
      },
      {
        title: 'Components',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/components%' }
        ]
      }
    ]
  },

  mcp: {
    name: 'NotForm documentation'
  },

  sitemap: {
    zeroRuntime: true
  }
})
