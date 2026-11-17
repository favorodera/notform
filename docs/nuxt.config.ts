import tailwindcss from '@tailwindcss/vite'
import { defineOrganization } from 'nuxt-schema-org/schema'
import { site } from './shared/site'

export default defineNuxtConfig({
  aiReady: {
    agentSkills: {
      dir: '.agents/skills',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { href: '/favicon.ico', rel: 'icon', sizes: '48x48' },
        { href: '/favicon.svg', rel: 'icon', sizes: 'any', type: 'image/svg+xml' },
        { href: '/icon-32x32.png', rel: 'icon', sizes: '32x32', type: 'image/png' },
        { href: '/icon-192x192.png', rel: 'icon', sizes: '192x192', type: 'image/png' },
        { href: '/icon-512x512.png', rel: 'icon', sizes: '512x512', type: 'image/png' },
        { href: '/icon-16x16.png', rel: 'icon', sizes: '16x16', type: 'image/png' },
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
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/ui',
    'motion-v/nuxt',
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
      description: site.description,
      founder: {
        name: site.author.name,
        url: site.author.url,
      },
      logo: `${site.url}/icon-512x512.png`,
      name: site.name,
      sameAs: [site.github.url, site.npm.vue, site.npm.nuxt],
      url: site.url,
    }),
  },
  site: {
    defaultLocale: site.locale,
    description: site.description,
    indexable: true,
    name: site.name,
    url: site.url,
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
