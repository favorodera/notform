import type { StandardSchemaV1 } from '@standard-schema/spec'

export function normalizeSegment(segment: StandardSchemaV1.PathSegment | PropertyKey) {
  if (typeof segment === 'object' && segment !== null && 'key' in segment) {
    return segment.key
  }
  return segment
}

export function isIssuePathEqual(issuePath: StandardSchemaV1.Issue['path'], targetPath: (string | number)[]) {
  if (!issuePath) return false
  if (issuePath.length !== targetPath.length) return false

  return issuePath.every((segment, i) => {
    const normalizedSegment = normalizeSegment(segment)
    const targetSegment = targetPath[i]
    
    // Handle numeric comparison (array indices)
    if (typeof normalizedSegment === 'number' || typeof targetSegment === 'number') {
      return Number(normalizedSegment) === Number(targetSegment)
    }
    
    // Handle string/symbol comparison
    return normalizedSegment === targetSegment
  })
}
