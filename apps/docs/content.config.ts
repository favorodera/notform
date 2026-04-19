import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md',
    }),

    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
    }),
  },
})
