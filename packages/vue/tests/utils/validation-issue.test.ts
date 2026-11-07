import { describe, expect, it } from 'vitest'
import type { ValidationIssue } from '../../src/types/validation'
import { createMoveMapper, createRemoveMapper } from '../../src/utils/array'
import { createValidationIssueFromError, remapIssueIndex } from '../../src/utils/validation-issue'

describe('createValidationIssueFromError', () => {
  it('uses the message of an Error', () => {
    expect(createValidationIssueFromError(new Error('Down'))).toStrictEqual({ message: 'Down' })
  })

  it('uses a thrown string as the message', () => {
    expect(createValidationIssueFromError('plain')).toStrictEqual({ message: 'plain' })
  })

  // eslint-disable-next-line unicorn/no-null
  it.for([[{ code: 1 }], [undefined], [null], [42]])('falls back to a generic message for %o', (thrown) => {
    expect(createValidationIssueFromError(thrown)).toStrictEqual({ message: 'Validation failed' })
  })

  it('attaches the field path when one is given, and none otherwise', () => {
    const withPath = createValidationIssueFromError(new Error('Down'), 'email')
    const withoutPath = createValidationIssueFromError(new Error('Down'))

    expect(withPath.message).toBe('Down')
    expect(withPath.path).toHaveLength(1)
    expect('path' in withoutPath).toBe(false)
  })
})

describe('remapIssueIndex', () => {
  const people = ['people']

  it('returns the very same issue when it is not affected', () => {
    const unaffected: ValidationIssue[] = [
      { message: 'form level' },
      { message: 'other field', path: ['name'] },
      { message: 'array level', path: ['people'] },
      { message: 'not an index', path: ['people', 'length'] },
      { message: 'similar name', path: ['peopleX', 0] },
    ]

    for (const issue of unaffected) {
      expect(remapIssueIndex(issue, people, createRemoveMapper(0))).toBe(issue)
    }
  })

  it('returns the same issue when its item did not move', () => {
    const issue: ValidationIssue = { message: 'x', path: ['people', 0, 'name'] }

    expect(remapIssueIndex(issue, people, createRemoveMapper(2))).toBe(issue)
  })

  it('drops the issue when its item no longer exists', () => {
    const issue: ValidationIssue = { message: 'x', path: ['people', 1, 'name'] }

    expect(remapIssueIndex(issue, people, createRemoveMapper(1))).toBeUndefined()
  })

  it('writes the new index into a copy and leaves the original alone', () => {
    const issue: ValidationIssue = { message: 'x', path: ['people', 2, 'name'] }
    const remapped = remapIssueIndex(issue, people, createRemoveMapper(0))

    expect(remapped).toStrictEqual({ message: 'x', path: ['people', 1, 'name'] })
    expect(issue.path).toStrictEqual(['people', 2, 'name'])
  })

  it('understands string and wrapped indexes, and keeps wrapped steps it does not touch', () => {
    const stringIndex: ValidationIssue = { message: 'x', path: ['people', '2', { key: 'name' }] }
    const wrapped: ValidationIssue = { message: 'x', path: [{ key: 'people' }, { key: 2 }, 'name'] }

    expect(remapIssueIndex(stringIndex, people, createRemoveMapper(0))?.path).toStrictEqual(['people', 1, { key: 'name' }])
    expect(remapIssueIndex(wrapped, people, createRemoveMapper(0))?.path).toStrictEqual([{ key: 'people' }, 1, 'name'])
  })

  it('remaps only the targeted array when arrays are nested', () => {
    const issue: ValidationIssue = { message: 'x', path: ['people', 1, 'tags', 0] }

    // moving the outer array changes the outer index and keeps the tail
    expect(remapIssueIndex(issue, people, createMoveMapper(1, 0))?.path).toStrictEqual(['people', 0, 'tags', 0])

    // removing from the inner array drops the issue of that tag
    expect(remapIssueIndex(issue, ['people', '1', 'tags'], createRemoveMapper(0))).toBeUndefined()
  })
})
