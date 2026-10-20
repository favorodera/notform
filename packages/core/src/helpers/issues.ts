import type { Issue } from '../types/shared'
import { areSegmentsEqual } from './segments'

/**
 * Whether two issue paths point at the same field after segment normalization.
 * @internal
 * @param issuePathA First path.
 * @param issuePathB Second path.
 * @returns `true` when both paths are defined, same length, and equal segment-wise.
 */
export function areIssuePathsEqual(issuePathA: Issue['path'], issuePathB: Issue['path']) {
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
