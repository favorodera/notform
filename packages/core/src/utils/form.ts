import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Segment } from '../types/shared'

/**
 * Normalizes a validation path segment into a standard property key.
 * @param segment The path segment to normalize.
 * @returns The normalized key.
 */
export function normalizeSegment(segment: Segment) {
  if (typeof segment === 'object' && segment !== null && 'key' in segment) {
    return segment.key
  }
  return segment
}

/**
 * Compares two individual path segments for equality
 * @param firstSegment The first segment to compare.
 * @param secondSegment The second segment to compare.
 * @returns True if the two segments refer to the same object key or array index.
 */
export function arePathSegmentsEqual(firstSegment: Segment, secondSegment: Segment) {
  if (typeof firstSegment === 'number' || typeof secondSegment === 'number') {
    return Number(firstSegment) === Number(secondSegment)
  }
  return firstSegment === secondSegment
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

  return issuePath.every((segment, segmentIndex) => {
    const normalizedSegment = normalizeSegment(segment)
    const targetSegment = targetPath[segmentIndex]

    return arePathSegmentsEqual(normalizedSegment, targetSegment)
  })
}
