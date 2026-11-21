import { contentCollectionNames } from '#shared/content-collections'

/**
 * Creates the shared documentation search and collection navigation state.
 * @returns Search state and actions for the documentation header.
 * @remarks
 * Navigation and search indexing start lazily when the content search opens.
 * This keeps route navigation responsive until the user needs search.
 * @example
 * ```ts
 * const search = useSearch()
 * await search.search('validation')
 * ```
 */
export function useSearch() {
  const contentSearch = useContentSearch()

  // Keep navigation state for each collection so search can combine its results.
  const collectionsNavigations = contentCollectionNames.map((collection) => {
    return useCollectionNavigation(collection, false)
  })

  const searchCollections = useSearchCollection(contentCollectionNames, {
    ignoredTags: ['style'],
    immediate: false,
  })

  const collectionNavigation = computed(() => {
    return collectionsNavigations.flatMap((navigation) => {
      return navigation.data.value
    })
  })

  watch(contentSearch.open, (isOpen) => {
    if (!isOpen) {
      return
    }

    if (searchCollections.status.value === 'idle') {
      void searchCollections.init()
    }

    for (const navigation of collectionsNavigations) {
      if (navigation.status.value === 'idle') {
        void navigation.execute()
      }
    }
  }, { immediate: true })

  return {
    navigation: collectionNavigation,
    search: searchCollections.search,
    status: searchCollections.status,
  }
}
