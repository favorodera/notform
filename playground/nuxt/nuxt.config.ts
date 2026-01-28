// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', 'notform-nuxt'],

  devtools: { enabled: true },

  css: ['~/assets/main.css'],

  compatibilityDate: '2025-07-15',
  
  eslint: { config: { stylistic: true } },
})
