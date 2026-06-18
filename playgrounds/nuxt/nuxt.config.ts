// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devServer: {
    port: 3001,
  },
  devtools: { enabled: false },
  eslint: {
    config: {
      standalone: false,
    },
  },
  modules: [
    'notform-nuxt',
    '@nuxt/eslint',
  ],
  vite: {
    optimizeDeps: {
      include: ['zod'],
    },
  },
})
