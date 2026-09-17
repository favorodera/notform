import type { PathSegment } from '../types/shared'

/**
 * Converts a {@linkcode PathSegment} into a plain `PropertyKey`.
 *
 * Standard Schema path segments may be wrapped in `{ key: ... }` objects;
 * this unwraps them so callers can compare raw keys directly.
 * @internal
 * @param segment The path segment to convert.
 * @returns The unwrapped property key.
 */
export function toPropertyKey(segment: PathSegment) {
  // Standard Schema wraps some segments in { key: ... } — unwrap if so
  if (typeof segment === 'object' && segment !== null && 'key' in segment) {
    return segment.key
  }

  return segment
}

/**
 * Checks whether two path segments refer to the same field.
 *
 * Numeric segments are coerced before comparison so that `"1"` and `1`
 * are treated as equivalent (common with array indices).
 * @internal
 * @param segmentA First segment to compare.
 * @param segmentB Second segment to compare.
 * @returns `true` if both segments refer to the same key or index.
 */
export function areSegmentsEqual(segmentA: PathSegment, segmentB: PathSegment) {
  // Coerce to number when either side is numeric (handles "0" === 0 for array paths)
  if (typeof segmentA === 'number' || typeof segmentB === 'number') {
    return Number(segmentA) === Number(segmentB)
  }

  return segmentA === segmentB
}
