import type { ContentNavigationItem } from '@nuxt/content'
import type { ContentSearchLink } from '@nuxt/ui'
import { contentCollectionNames } from '#shared/content-collections'
import { siteConfig } from '#shared/site'

/**
 * Creates the shared documentation search and collection navigation state.
 * @returns Search state and actions for the documentation header.
 * @remarks
 * Navigation and search indexing start lazily when the content search opens.
 * This keeps route navigation responsive until the user needs search.
 *
 * `links` is shown as the first group in the search palette. It holds the
 * playground, then one entry per top-level documentation section. Each section
 * entry uses the section's title, links to its first page, and takes its
 * description from `siteConfig.docs.sectionDescriptions`. The section entries
 * appear once the navigation has loaded, which happens when the search opens.
 * @example
 * ```ts
 * const search = useSearch()
 * await search.search('validation')
 *
 * search.links.value[0]?.label // 'Playground'
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

  const links = computed<ContentSearchLink[]>(() => {
    const { playground } = siteConfig.links

    // The collection navigation holds the top-level sections of each collection.
    const sectionLinks = collectionNavigation.value.map((section) => {
      return {
        description: siteConfig.docs.sectionDescriptions[section.path],
        label: section.title,
        to: getFirstPagePath(section),
      }
    })

    return [
      {
        description: playground.description,
        label: playground.label,
        to: playground.to,
      },
      ...sectionLinks,
    ]
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
    links,
    navigation: collectionNavigation,
    search: searchCollections.search,
    status: searchCollections.status,
  }
}

/**
 * Finds the first page inside a navigation section.
 * @param item Navigation item for a section, or for a page inside one.
 * @returns Path of the first leaf page, or the item's own path when it has no
 * children.
 * @remarks
 * Nuxt Content orders navigation by the numeric prefixes of files and folders,
 * so the first leaf is the page a reader should open first.
 * @example
 * ```ts
 * getFirstPagePath(gettingStartedSection)
 * // '/docs/getting-started/introduction'
 * ```
 */
function getFirstPagePath(item: ContentNavigationItem): string {
  const [firstChild] = item.children ?? []

  return firstChild ? getFirstPagePath(firstChild) : item.path
}
