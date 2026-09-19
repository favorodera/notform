import { describe, expect, it } from 'vitest'
import { areIssuePathsEqual } from '../../src/utils/issues'

describe('areIssuePathsEqual', () => {
  it('returns false when either path is missing', () => {
    expect(areIssuePathsEqual(undefined, ['name'])).toBe(false)
    expect(areIssuePathsEqual(['name'], undefined)).toBe(false)
  })

  it('returns false when lengths differ', () => {
    expect(areIssuePathsEqual(['users', 0], ['users'])).toBe(false)
  })

  it('compares normalized segments', () => {
    expect(areIssuePathsEqual([{ key: 'name' }], ['name'])).toBe(true)
    expect(areIssuePathsEqual(['tags', 0], ['tags', '0'])).toBe(true)
    expect(areIssuePathsEqual(['name'], ['email'])).toBe(false)
  })
})
