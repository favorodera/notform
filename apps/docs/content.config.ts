import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      source: 'index.md',
      type: 'page',
    }),

    docs: defineCollection({
      source: {
        exclude: ['index.md'],
        include: '**',
      },
      type: 'page',
    }),
  },
})
