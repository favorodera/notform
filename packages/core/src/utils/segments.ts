import type { PathSegment } from '../types/shared'

/**
 * Unwraps a Standard Schema path segment to a property key.
 * @internal
 * @param segment Plain key or `{ key }`.
 * @returns The underlying property key.
 */
export function toPropertyKey(segment: PathSegment): PropertyKey {
  if (typeof segment === 'object' && segment !== null && 'key' in segment) {
    return segment.key
  }

  return segment
}

/**
 * Whether two path segments name the same property. `0` and `"0"` are equal.
 * @internal
 * @param segmentA First segment.
 * @param segmentB Second segment.
 * @returns `true` when both refer to the same key.
 */
export function areSegmentsEqual(
  segmentA: PathSegment,
  segmentB: PathSegment,
): boolean {
  const keyA = toPropertyKey(segmentA)
  const keyB = toPropertyKey(segmentB)

  if (typeof keyA === 'number' && typeof keyB === 'string') {
    return Number.isSafeInteger(Number(keyB)) && keyA === Number(keyB)
  }

  if (typeof keyA === 'string' && typeof keyB === 'number') {
    return Number.isSafeInteger(Number(keyA)) && Number(keyA) === keyB
  }

  return keyA === keyB
}
