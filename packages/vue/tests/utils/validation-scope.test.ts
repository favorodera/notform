import { describe, expect, it } from 'vitest'
import { isSamePath, splitPath } from '../../src/utils/path'
import { doesScopeCover, getValidationScope, isFieldAffectedByScope } from '../../src/utils/validation-scope'

describe('getValidationScope', () => {
  it('covers the whole form when no path is given', () => {
    expect(getValidationScope()).toStrictEqual({ type: 'form' })
  })

  it('covers one field when a path is given', () => {
    const scope = getValidationScope('tags.0')

    expect(scope.type).toBe('field')
    expect(scope.type === 'field' && isSamePath(scope.segments, ['tags', 0])).toBe(true)
  })
})

describe('doesScopeCover', () => {
  const form = getValidationScope()
  const name = getValidationScope('name')
  const email = getValidationScope('email')

  it('lets a form run replace any older run', () => {
    expect(doesScopeCover(form, form)).toBe(true)
    expect(doesScopeCover(form, name)).toBe(true)
  })

  it('lets a field run replace only an older run of the same field', () => {
    expect(doesScopeCover(name, name)).toBe(true)
    expect(doesScopeCover(name, getValidationScope('name'))).toBe(true)
    expect(doesScopeCover(name, email)).toBe(false)
  })

  it('never lets a field run replace a form run', () => {
    expect(doesScopeCover(name, form)).toBe(false)
  })
})

describe('isFieldAffectedByScope', () => {
  it('lets a form run affect every field', () => {
    expect(isFieldAffectedByScope(getValidationScope(), splitPath('anything.at.all'))).toBe(true)
  })

  it.for([
    ['tags.0.name', true],
    ['tags.0', true],
    ['tags', true],
    ['tags.1', false],
    ['tags.0.name.first', false],
    ['email', false],
  ] as const)('a run on tags.0.name affects the field "%s": %s', ([fieldPath, expected]) => {
    const run = getValidationScope('tags.0.name')

    expect(isFieldAffectedByScope(run, splitPath(fieldPath))).toBe(expected)
  })
})
