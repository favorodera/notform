import { describe, expect, it } from 'vitest'
import { areSegmentsEqual, toPropertyKey } from '../../src/utils/segments'

describe('toPropertyKey', () => {
  it('unwraps Standard Schema path segments', () => {
    expect(toPropertyKey({ key: 'name' })).toBe('name')
    expect(toPropertyKey(0)).toBe(0)
    expect(toPropertyKey('email')).toBe('email')
  })
})

describe('areSegmentsEqual', () => {
  it('treats numeric and string indexes as equal', () => {
    expect(areSegmentsEqual(0, '0')).toBe(true)
    expect(areSegmentsEqual('1', 1)).toBe(true)
    expect(areSegmentsEqual({ key: 2 }, '2')).toBe(true)
  })

  it('treats different keys as unequal', () => {
    expect(areSegmentsEqual('name', 'email')).toBe(false)
    expect(areSegmentsEqual(0, 1)).toBe(false)
    expect(areSegmentsEqual(0, 'x')).toBe(false)
  })
})
