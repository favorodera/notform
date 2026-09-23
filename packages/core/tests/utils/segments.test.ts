import { describe, expect, it } from 'vitest'
import { areSegmentsEqual, isPathWithinScope, toPropertyKey } from '../../src/utils/segments'

describe('toPropertyKey', () => {
  it('returns a plain segment unchanged', () => {
    expect(toPropertyKey('email')).toBe('email')
    expect(toPropertyKey(0)).toBe(0)
  })

  it('unwraps a Standard Schema { key } segment', () => {
    expect(toPropertyKey({ key: 'email' })).toBe('email')
    expect(toPropertyKey({ key: 0 })).toBe(0)
  })
})

describe('areSegmentsEqual', () => {
  it('treats matching strings and numbers as equal', () => {
    expect(areSegmentsEqual('email', 'email')).toBe(true)
    expect(areSegmentsEqual(0, 0)).toBe(true)
  })

  it('treats a numeric index and its string form as equal', () => {
    expect(areSegmentsEqual(0, '0')).toBe(true)
    expect(areSegmentsEqual('0', 0)).toBe(true)
  })

  it('rejects a string that is not a safe-integer form of the number', () => {
    expect(areSegmentsEqual(0, 'zero')).toBe(false)
    expect(areSegmentsEqual(1, '1.5')).toBe(false)
  })

  it('rejects mismatched segments', () => {
    expect(areSegmentsEqual('email', 'name')).toBe(false)
  })

  it('unwraps { key } segments before comparing', () => {
    expect(areSegmentsEqual({ key: 'email' }, 'email')).toBe(true)
    expect(areSegmentsEqual({ key: 0 }, '0')).toBe(true)
  })
})

describe('isPathWithinScope', () => {
  it('is true when the path equals the scope exactly', () => {
    expect(isPathWithinScope(['groups'], ['groups'])).toBe(true)
    expect(isPathWithinScope(['groups', 0], ['groups', 0])).toBe(true)
  })

  it('is true when the path is nested one level under the scope', () => {
    expect(isPathWithinScope(['groups', 0], ['groups'])).toBe(true)
  })

  it('is true when the path is nested arbitrarily many levels under the scope', () => {
    expect(isPathWithinScope(['groups', 0, 'tags', 1], ['groups'])).toBe(true)
    expect(isPathWithinScope(['groups', 0, 'tags', 1], ['groups', 0])).toBe(true)
    expect(isPathWithinScope(['groups', 0, 'tags', 1], ['groups', 0, 'tags'])).toBe(true)
  })

  it('is false when the path is shorter than the scope', () => {
    expect(isPathWithinScope(['groups'], ['groups', 0])).toBe(false)
  })

  it('is false when the path diverges from the scope', () => {
    expect(isPathWithinScope(['tags', 0], ['groups'])).toBe(false)
    expect(isPathWithinScope(['groups', 0, 'name'], ['groups', 1])).toBe(false)
  })

  it('is false for a sibling field with an overlapping name prefix', () => {
    // "groupsOther" must never be treated as nested under "groups".
    expect(isPathWithinScope(['groupsOther', 0], ['groups'])).toBe(false)
  })

  it('normalizes numeric and string index segments the same way as areSegmentsEqual', () => {
    expect(isPathWithinScope(['groups', '0', 'name'], ['groups', 0])).toBe(true)
  })
})
