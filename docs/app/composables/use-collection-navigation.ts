import type { Collections, ContentNavigationItem } from '@nuxt/content'

export function useCollectionNavigation(collection: keyof Collections, requiresImmediate = true) {
  return useAsyncData<ContentNavigationItem[]>(
    `${collection}-navigation`, // unique key per collection
    async () => {
      const navigation = await queryCollectionNavigation(collection)
      
      // the first level is the collection folder itself
      return navigation[0]?.children ?? []
    },
    {
      default() {
        return []
      },
      immediate: requiresImmediate,
    },
  )
}
