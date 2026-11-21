import type { Collections } from '@nuxt/content'

/**
 * Content collection names used by the documentation application.
 * @remarks
 * Keep collection names in this central list so search and route navigation
 * use the same values.
 */
export const contentCollectionNames: (keyof Collections)[] = ['docs']

/** Content collection name declared in the documentation application. */
export type ContentCollectionName = typeof contentCollectionNames[number]

/**
 * Checks whether a route segment names an available content collection.
 * @param value Route segment or collection name to validate.
 * @returns `true` when `value` is a declared content collection name.
 * @example
 * ```ts
 * if (isContentCollectionName('docs')) {
 *   // Load documentation collection navigation.
 * }
 * ```
 */
export function isContentCollectionName(value: ContentCollectionName | string): value is ContentCollectionName {
  return contentCollectionNames.includes(value as ContentCollectionName)
}
