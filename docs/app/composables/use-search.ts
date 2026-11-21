import type { Collections } from '@nuxt/content'

const collections: (keyof Collections)[] = ['docs']

export function useSearch() {
  const contentSearch = useContentSearch()

  const collectionsNavigations = collections.map((collection) => {
    return useCollectionNavigation(collection, false)
  })

  const searchCollections = useSearchCollection(collections, {
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
