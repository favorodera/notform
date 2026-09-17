import type { Issue } from '../types/shared'
import { areSegmentsEqual, toPropertyKey } from './segments'

/**
 * Compares two issue paths for structural equality.
 *
 * Each segment is normalized to a plain property key before comparison,
 * so `{ key: 'name' }` and `'name'` are treated as equivalent.
 * @internal
 * @param issuePathA The first issue path (e.g. from a stored error).
 * @param issuePathB The second issue path (e.g. from a parsed field path).
 * @returns `true` if both paths point to the same field.
 */
export function areIssuePathsEqual(issuePathA: Issue['path'], issuePathB: Issue['path']) {
  // Both paths must be defined to be comparable
  if (!issuePathA || !issuePathB) {
    return false
  }

  // Different lengths can never be equal
  if (issuePathA.length !== issuePathB.length) {
    return false
  }

  // Compare each segment after normalizing to a raw property key
  return issuePathA.every((segment, index) => {
    return areSegmentsEqual(
      toPropertyKey(segment),
      toPropertyKey(issuePathB[index]),
    )
  })
}
