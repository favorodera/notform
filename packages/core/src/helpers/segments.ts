import type { PathSegment } from '../types/shared'

/**
 * Unwraps a Standard Schema path segment to a property key.
 * @param segment Plain key or `{ key }` segment.
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
 * Checks whether two path segments name the same property; `0` equals `"0"`.
 * @param segmentA First path segment.
 * @param segmentB Second path segment.
 * @returns `true` when both normalized keys match.
 */
export function areSegmentsEqual(segmentA: PathSegment, segmentB: PathSegment): boolean {
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
 * Checks whether a path equals or descends from a scope.
 * Used by array-state remapping and nested validation status.
 * @param pathSegments Candidate path, already parsed.
 * @param scopeSegments Scope path, already parsed.
 * @returns `true` when the candidate path is the scope or one of its descendants.
 */
export function isPathWithinScope(pathSegments: ReadonlyArray<PathSegment>, scopeSegments: ReadonlyArray<PathSegment>): boolean {
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
