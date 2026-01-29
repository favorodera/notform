// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', 'notform-nuxt'],

  devtools: { enabled: true },

  css: ['~/assets/main.css'],

  compatibilityDate: '2025-07-15',

  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
  },
  
  eslint: { config: { stylistic: true } },
})
