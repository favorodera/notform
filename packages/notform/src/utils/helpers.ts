import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * Normalizes a validation path segment into a standard property key.
 * @param segment The path segment to normalize.
 * @returns The normalized key.
 */
export function normalizeSegment(segment: StandardSchemaV1.PathSegment | PropertyKey) {
  if (typeof segment === 'object' && segment !== null && 'key' in segment) {
    return segment.key
  }
  return segment
}

/**
 * Checks if a validation issue path matches a target field path.
 * @param issuePath The path array from the validation issue.
 * @param targetPath The normalized path to compare against.
 * @returns True if the paths are equivalent.
 */
export function isIssuePathEqual(issuePath: StandardSchemaV1.Issue['path'], targetPath: (string | number)[]) {
  if (!issuePath) return false
  if (issuePath.length !== targetPath.length) return false

  return issuePath.every((segment, i) => {
    const normalizedSegment = normalizeSegment(segment)
    const targetSegment = targetPath[i]

    if (typeof normalizedSegment === 'number' || typeof targetSegment === 'number') {
      return Number(normalizedSegment) === Number(targetSegment)
    }

    return normalizedSegment === targetSegment
  })
}

/**
 * Recursively retrieves all reachable paths of an object as dot-separated strings.
 * @param object The object to traverse.
 * @param prefix An optional prefix to prepended to each generated path.
 * @returns An array of string paths representing the object's structure.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getObjectPaths(object: Record<string, any>, prefix = '') {
  let paths: string[] = []

  if (typeof object !== 'object' || object === null) {
    return paths
  }

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key]
      const isArray = Array.isArray(object)
      const isInt = /^\d+$/.test(key)

      let currentKey = key
      if (isArray && isInt) {
        currentKey = `[${key}]`
      }

      const path = prefix
        ? (prefix.endsWith(']') || currentKey.startsWith('[') ? `${prefix}${currentKey}` : `${prefix}.${currentKey}`)
        : currentKey

      paths.push(path)

      if (typeof value === 'object' && value !== null) {
        paths = paths.concat(getObjectPaths(value, path))
      }
    }
  }

  return paths
}
