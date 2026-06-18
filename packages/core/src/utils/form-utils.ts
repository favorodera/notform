import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * Normalizes a validation path segment into a standard property key.
 * @param segment The path segment to normalize.
 * @returns The normalized key.
 */
export function normalizeSegment(segment: PropertyKey | StandardSchemaV1.PathSegment) {
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
export function isIssuePathEqual(issuePath: StandardSchemaV1.Issue['path'], targetPath: Array<number | string>) {
  if (!issuePath) return false
  if (issuePath.length !== targetPath.length) return false

  return issuePath.every((segment, index) => {
    const normalizedSegment = normalizeSegment(segment)
    const targetSegment = targetPath[index]

    if (typeof normalizedSegment === 'number' || typeof targetSegment === 'number') {
      return Number(normalizedSegment) === Number(targetSegment)
    }

    return normalizedSegment === targetSegment
  })
}
