import tailwindcss from '@tailwindcss/vite'
import { defineOrganization } from 'nuxt-schema-org/schema'
import { siteConfig } from './shared/site'

export default defineNuxtConfig({
  aiReady: {
    agentSkills: {
      dir: '.agents/skills',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: siteConfig.locale,
      },
      link: [
        { href: '/favicon.ico', rel: 'icon', type: 'image/x-icon' },
        { href: '/icon-16x16.png', rel: 'icon', sizes: '16x16', type: 'image/png' },
        { href: '/icon-32x32.png', rel: 'icon', sizes: '32x32', type: 'image/png' },
        { href: '/icon-192x192.png', rel: 'icon', sizes: '192x192', type: 'image/png' },
        { href: '/icon-512x512.png', rel: 'icon', sizes: '512x512', type: 'image/png' },
        { href: '/apple-touch-icon.png', rel: 'apple-touch-icon', sizes: '180x180' },
      ],
    },
  },
  compatibilityDate: '2026-06-21',
  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },
  css: ['~/assets/css/index.css'],
  devtools: {
    enabled: false,
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
    families: [{ global: true, name: 'Outfit', weights: [300, 400, 500, 600, 700] }],
  },
  icon: {
    componentName: 'NuxtIcon',
    customCollections: [
      {
        dir: './app/assets/icons',
        prefix: 'custom',
      },
    ],
    mode: 'svg',
  },
  linkChecker: {
    failOnError: true,
    showLiveInspections: true,
  },
  modules: [
    '@nuxtjs/seo',
    '@nuxt/ui',
    '@nuxt/content',
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
    identity: defineOrganization({
      description: siteConfig.description,
      founder: {
        name: siteConfig.author.name,
        url: siteConfig.author.url,
      },
      logo: `${siteConfig.url}/icon-512x512.png`,
      name: siteConfig.name,
      sameAs: [siteConfig.github.url, siteConfig.npm.vue, siteConfig.npm.nuxt],
      url: siteConfig.url,
    }),
  },
  // Nuxt Site Config module options. Unrelated to the `siteConfig` object above, which only supplies its values.
  site: {
    defaultLocale: siteConfig.locale,
    description: siteConfig.description,
    indexable: true,
    name: siteConfig.name,
    url: siteConfig.url,
  },
  sitemap: {
    zeroRuntime: true,
  },
  typescript: {
    nodeTsConfig: {
      include: ['./scripts'],
    },
  },
  ui: {
    prefix: '',
  },
  vite: {
    optimizeDeps: {
      exclude: ['@vue/repl'],
      include: ['@vueuse/core'],
    },
    plugins: [tailwindcss()],
  },
})
