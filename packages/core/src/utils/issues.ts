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
  if (!issuePathA || !issuePathB) {
    return false
  }

  if (issuePathA.length !== issuePathB.length) {
    return false
  }

  return issuePathA.every((segment, segmentIndex) => areSegmentsEqual(segment, issuePathB[segmentIndex]))
}
