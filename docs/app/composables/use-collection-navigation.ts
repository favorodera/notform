import type { ContentNavigationItem } from '@nuxt/content'
import type { MaybeRefOrGetter } from 'vue'
import type { ContentCollectionName } from '#shared/content-collections'

/**
 * Loads the navigation tree for a Nuxt Content collection.
 * @param collection Collection key, or a reactive getter for it.
 * @param requiresImmediate Whether to execute the query during setup.
 * Pass `false` to load navigation only when the caller executes it.
 * @returns Nuxt async data containing the collection's top-level navigation.
 * @throws Rejects if Nuxt Content cannot query the collection.
 * @example
 * ```ts
 * const navigation = useCollectionNavigation('docs')
 * await navigation.execute()
 * ```
 */
export function useCollectionNavigation(collection: MaybeRefOrGetter<ContentCollectionName | undefined>, requiresImmediate = true) {
  return useAsyncData<ContentNavigationItem[]>(
    () => {
      return `${toValue(collection) ?? 'none'}-navigation`
    },
    async () => {
      const resolvedCollection = toValue(collection)

      if (!resolvedCollection) {
        return []
      }

      const navigation = await queryCollectionNavigation(resolvedCollection)

      // the first level is the collection folder itself
      return navigation[0]?.children ?? []
    },
    {
      default() {
        return []
      },
      immediate: requiresImmediate,
      watch: [
        () => {
          return toValue(collection)
        },
      ],
    },
  )
}
