import type { PathSegment } from '../types/shared'

/**
 * Unwraps a Standard Schema path segment to a property key.
 * @internal
 * @param segment Plain key or `{ key }`.
 * @returns The underlying property key.
 */
export function toPropertyKey(segment: PathSegment): PropertyKey {
  // Standard Schema issue paths can use `{ key }` objects instead of raw
  // keys (e.g. to carry extra metadata) — unwrap to the raw key either way.
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
export function areSegmentsEqual(segmentA: PathSegment, segmentB: PathSegment) {
  const keyA = toPropertyKey(segmentA)
  const keyB = toPropertyKey(segmentB)

  // Array indices can arrive as a number (from our own code) or a string
  // (from dot-prop parsing a path like "tags.0") — normalize before comparing.
  if (typeof keyA === 'number' && typeof keyB === 'string') {
    return Number.isSafeInteger(keyA) && String(keyA) === keyB
  }

  if (typeof keyA === 'string' && typeof keyB === 'number') {
    return Number.isSafeInteger(keyB) && keyA === String(keyB)
  }

  // Same type on both sides (string-string, number-number, or symbol) —
  // strict equality is correct as-is.
  return keyA === keyB
}

/**
 * Whether a path equals or descends from a scope, at any depth.
 * Used by array-path remapping and recursive `<NotArrayField>` status.
 * @template TPathSegment Segment type of the candidate path.
 * @template TScopeSegment Segment type of the scope path.
 * @internal
 * @param pathSegments Candidate path, already split.
 * @param scopeSegments Scope path, already split.
 * @returns `true` when `pathSegments` is `scopeSegments` or a descendant of it.
 */
export function isPathWithinScope<
  TPathSegment extends PathSegment,
  TScopeSegment extends PathSegment,
>(
  pathSegments: ReadonlyArray<TPathSegment>,
  scopeSegments: ReadonlyArray<TScopeSegment>,
) {
  // A shorter path can never contain the scope path within it.
  if (pathSegments.length < scopeSegments.length) {
    return false
  }

  // Only the prefix matters — any extra trailing segments on `pathSegments`
  // are exactly what makes it a *descendant* of `scopeSegments`, not a
  // mismatch. This is also what rejects "groupsOther" as a match for
  // "groups": the first segment itself fails `areSegmentsEqual`.
  return scopeSegments.every((scopeSegment, segmentIndex) => areSegmentsEqual(pathSegments[segmentIndex], scopeSegment))
}
