import type { Issue } from '../types/shared'
import { areSegmentsEqual } from './segments'

/**
 * Checks whether two issue paths identify the same field.
 * @param issuePathA First issue path.
 * @param issuePathB Second issue path.
 * @returns `true` when both paths exist and their normalized segments match.
 */
export function areIssuePathsEqual(issuePathA: Issue['path'], issuePathB: Issue['path']): boolean {
  // A pathless issue (form-level, no `path`) never matches a specific field —
  // treat either side missing as an automatic mismatch, not a wildcard.
  if (!issuePathA || !issuePathB) {
    return false
  }

  // Different lengths can never be the same field; also lets `.every` below
  // safely index into both arrays without an out-of-bounds check.
  if (issuePathA.length !== issuePathB.length) {
    return false
  }

  // Segment-wise compare (not a deep-equal) so `0` and `"0"`, or a plain key
  // and a `{ key }` wrapper, are still treated as the same field.
  return issuePathA.every((segment, segmentIndex) => areSegmentsEqual(segment, issuePathB[segmentIndex]))
}
