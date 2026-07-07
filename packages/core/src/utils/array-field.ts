import { parsePath } from 'dot-prop'
import type { NotFormInstance } from '../types/not-form'
import type { ArrayItemIndexMap, Segment } from '../types/shared'
import { arePathSegmentsEqual, normalizeSegment } from './form'

/**
 * Finds where a path sits inside an array field, if at all.
 * @param pathSegments The full path segments to test, e.g. the parsed segments of `"tags.1.label"`.
 * @param arrayFieldPathSegments The parsed path segments of the array field itself, e.g. the segments of `"tags"`.
 * @returns The item's index and any trailing segments, or undefined if the path isn't inside this array.
 */
function getArrayItemLocation(pathSegments: ReadonlyArray<Segment>, arrayFieldPathSegments: ReadonlyArray<Segment>) {
  // Needs at least one segment more than the array path itself — that extra segment is the index.
  if (pathSegments.length <= arrayFieldPathSegments.length) return

  // Segment-by-segment match, not string prefix, so a sibling like "tagsBackup.0" can't match "tags".
  for (const [
    segmentIndex,
    arrayFieldPathSegment,
  ] of arrayFieldPathSegments.entries()) {
    if (!arePathSegmentsEqual(pathSegments[segmentIndex], arrayFieldPathSegment)) return
  }

  const itemIndex = Number(pathSegments[arrayFieldPathSegments.length])
  if (Number.isNaN(itemIndex)) return

  return {
    itemIndex,
    remainingSegments: pathSegments.slice(arrayFieldPathSegments.length + 1),
  }
}

/**
 * Rebuilds a dot-separated path from an array field's path, an item index, and any trailing segments.
 * @param arrayFieldPath The array field's dot-separated path, e.g. `"tags"`.
 * @param itemIndex The item's index within the array.
 * @param remainingSegments Segments after the index, e.g. `['label']` for a nested field.
 * @returns The reconstructed path, e.g. `"tags.0.label"`.
 */
function buildArrayItemPath(arrayFieldPath: string, itemIndex: number, remainingSegments: ReadonlyArray<Segment>) {
  return [
    arrayFieldPath,
    itemIndex,
    ...remainingSegments,
  ].join('.')
}

/**
 * Relocates or drops `form.errors` entries that belong to an item that moved or was removed.
 * Errors on the array field itself (no index segment) are left untouched.
 * @param form The form instance whose errors should be remapped.
 * @param arrayFieldPathSegments The parsed path segments of the array field.
 * @param arrayItemIndexMap Maps each previous item index to its new index, or undefined if removed.
 */
function remapArrayFieldErrors(form: NotFormInstance<any>, arrayFieldPathSegments: ReadonlyArray<Segment>, arrayItemIndexMap: ArrayItemIndexMap) {
  // Walk backward so splicing an entry never shifts the index of one still to be visited.
  for (let errorIndex = form.errors.length - 1; errorIndex >= 0; errorIndex--) {
    const issue = form.errors[errorIndex]

    if (issue.path) {
      const normalizedIssuePathSegments = issue.path.map(segment => normalizeSegment(segment))
      const itemLocation = getArrayItemLocation(normalizedIssuePathSegments, arrayFieldPathSegments)

      if (itemLocation) {
        const newItemIndex = arrayItemIndexMap(itemLocation.itemIndex)

        // typeof, not truthiness — 0 is a valid index and must not read as "removed".
        if (typeof newItemIndex === 'number') {
          form.errors[errorIndex] = {
            ...issue,
            path: [
              ...arrayFieldPathSegments,
              newItemIndex,
              ...itemLocation.remainingSegments,
            ],
          }
        } else {
          form.errors.splice(errorIndex, 1)
        }
      }
    }
  }
}

/**
 * Relocates or drops entries in a `touchedFields`/`dirtyFields` set that belong to an item that moved or was removed.
 * @param fieldPathSet The reactive set of field paths to remap.
 * @param arrayFieldPath The dot-separated path of the array field.
 * @param arrayFieldPathSegments The parsed path segments of the array field.
 * @param arrayItemIndexMap Maps each previous item index to its new index, or undefined if removed.
 */
function remapArrayFieldPathSet(fieldPathSet: Set<string>, arrayFieldPath: string, arrayFieldPathSegments: ReadonlyArray<Segment>, arrayItemIndexMap: ArrayItemIndexMap) {
  const pathsToRemove: Array<string> = []
  const pathsToAdd: Array<string> = []

  for (const fieldPath of fieldPathSet) {
    const itemLocation = getArrayItemLocation(parsePath(fieldPath), arrayFieldPathSegments)
    if (itemLocation) {
      pathsToRemove.push(fieldPath)

      const newItemIndex = arrayItemIndexMap(itemLocation.itemIndex)

      // typeof, not truthiness — 0 is a valid index and must not read as "removed".
      if (typeof newItemIndex === 'number') {
        pathsToAdd.push(buildArrayItemPath(arrayFieldPath, newItemIndex, itemLocation.remainingSegments))
      }
    }
  }

  for (const fieldPath of pathsToRemove) fieldPathSet.delete(fieldPath)
  for (const fieldPath of pathsToAdd) fieldPathSet.add(fieldPath)
}

/**
 * Keeps an array field's errors, touched paths, and dirty paths attached to the item they
 * describe, rather than the array slot that item happened to occupy. Call before applying
 * the mutation to `form.values`.
 * @param form The form instance whose error, touched, and dirty state should be remapped.
 * @param arrayFieldPath The dot-separated path of the array field being mutated, e.g. `"tags"`.
 * @param arrayItemIndexMap Maps each previous item index to its new index, or undefined if removed.
 */
export function remapArrayFieldState(form: NotFormInstance<any>, arrayFieldPath: string, arrayItemIndexMap: ArrayItemIndexMap) {
  const arrayFieldPathSegments = parsePath(arrayFieldPath)

  remapArrayFieldErrors(form, arrayFieldPathSegments, arrayItemIndexMap)
  remapArrayFieldPathSet(form.touchedFields, arrayFieldPath, arrayFieldPathSegments, arrayItemIndexMap)
  remapArrayFieldPathSet(form.dirtyFields, arrayFieldPath, arrayFieldPathSegments, arrayItemIndexMap)
}
