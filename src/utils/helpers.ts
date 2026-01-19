import type { StandardSchemaV1 } from '@standard-schema/spec'

export function normalizeSegment(segment: StandardSchemaV1.PathSegment | PropertyKey) {
  if (typeof segment === 'object' && segment !== null && 'key' in segment) {
    return segment.key
  }
  return segment
}

export function isIssuePathEqual(issuePath: StandardSchemaV1.Issue['path'], targetPath: (string | number)[]) {
  if (!issuePath) return false
  if (issuePath.length !== targetPath.length) return false

  return issuePath.every((segment, i) => {
    const normalizedSegment = normalizeSegment(segment)
    const targetSegment = targetPath[i]

    // Handle numeric comparison (array indices)
    if (typeof normalizedSegment === 'number' || typeof targetSegment === 'number') {
      return Number(normalizedSegment) === Number(targetSegment)
    }

    // Handle string/symbol comparison
    return normalizedSegment === targetSegment
  })
}

/**
 * Recursively retrieves all paths of an object.
 * @param object The object to retrieve paths from.
 * @param prefix The prefix to prepend to each path.
 * @returns An array of paths.
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
      // Check if key is numeric (for array indices)
      const isInt = /^\d+$/.test(key)

      let currentKey = key
      // If parent is array and key is numeric context, format as [index]
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
