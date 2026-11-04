import { describe, expect, it } from 'vitest'
import {
  getSegmentIndex,
  getSegmentKey,
  getValueAtPath,
  isPathInside,
  isSamePath,
  isSameSegment,
  joinPath,
  setValueAtPath,
  splitPath,
} from '../../src/utils/path'

describe('getSegmentKey', () => {
  it('returns bare keys untouched and unwraps { key }', () => {
    expect(getSegmentKey('email')).toBe('email')
    expect(getSegmentKey(0)).toBe(0)
    expect(getSegmentKey({ key: 'email' })).toBe('email')
    expect(getSegmentKey({ key: 3 })).toBe(3)
  })
})

describe('getSegmentIndex', () => {
  it.for([
    [2, 2],
    ['2', 2],
    ['0', 0],
    [{ key: 2 }, 2],
    [{ key: '2' }, 2],
    ['name', undefined],
    [{ key: 'name' }, undefined],
    [-1, undefined],
    ['-1', undefined],
    [1.5, undefined],
    ['1.5', undefined],
    ['01', undefined],
    [NaN, undefined],
  ] as const)('reads %o as index %s', ([segment, expected]) => {
    expect(getSegmentIndex(segment)).toBe(expected)
  })
})

describe('isSameSegment', () => {
  it.for([
    [0, '0', true],
    ['0', 0, true],
    [{ key: 0 }, '0', true],
    [{ key: '1' }, { key: 1 }, true],
    [{ key: 'name' }, 'name', true],
    ['a', 'a', true],
    [1, 1, true],
    [0, '1', false],
    [1, 2, false],
    ['a', 'b', false],
    [1.5, '1.5', false],
    [NaN, 'NaN', false],
  ] as const)('%o vs %o is %s', ([first, second, expected]) => {
    expect(isSameSegment(first, second)).toBe(expected)
  })
})

describe('isSamePath', () => {
  it('treats number, numeric string and wrapped segments as equal', () => {
    expect(isSamePath(['tags', 0], ['tags', '0'])).toBe(true)
    expect(isSamePath([{ key: 'people' }, { key: 0 }, { key: 'name' }], ['people', '0', 'name'])).toBe(true)
  })

  it('is false for different lengths or different steps', () => {
    expect(isSamePath(['tags'], ['tags', 0])).toBe(false)
    expect(isSamePath(['tags', 0], ['tags', 1])).toBe(false)
  })

  it('never matches a missing path, because that means "the whole form"', () => {
    expect(isSamePath(undefined, undefined)).toBe(false)
    expect(isSamePath(undefined, ['name'])).toBe(false)
    expect(isSamePath(['name'], undefined)).toBe(false)
  })
})

describe('isPathInside', () => {
  it('is true for the same path and for deeper paths', () => {
    expect(isPathInside(['user'], ['user'])).toBe(true)
    expect(isPathInside(['user', 'name'], ['user'])).toBe(true)
    expect(isPathInside([{ key: 'user' }, { key: 0 }], ['user', '0'])).toBe(true)
  })

  it('is false for parents and for unrelated paths', () => {
    expect(isPathInside(['user'], ['user', 'name'])).toBe(false)
    expect(isPathInside(['userName'], ['user'])).toBe(false)
    expect(isPathInside(['other', 'name'], ['user'])).toBe(false)
  })
})

describe('joinPath', () => {
  it.for([
    ['', 'name', 'name'],
    ['tags', 1, 'tags.1'],
    ['people.0', 'name', 'people.0.name'],
  ] as const)('joins %o and %o into %o', ([parent, key, expected]) => {
    expect(joinPath(parent, key)).toBe(expected)
  })
})

describe('splitPath', () => {
  it('splits into steps that compare equal to numeric segments', () => {
    expect(isSamePath(splitPath('people.0.name'), ['people', 0, 'name'])).toBe(true)
  })
})

describe('getValueAtPath / setValueAtPath', () => {
  it('reads nested objects and array items', () => {
    const source = { people: [{ name: 'Ada' }, { name: 'Bea' }] }

    expect(getValueAtPath(source, 'people.1.name')).toBe('Bea')
    expect(getValueAtPath(source, 'people')).toBe(source.people)
  })

  it('returns undefined when any step is missing', () => {
    expect(getValueAtPath({}, 'a.b.c')).toBeUndefined()
    expect(getValueAtPath({ a: undefined }, 'a.b')).toBeUndefined()
  })

  it('writes at a path and creates the missing steps', () => {
    const target: Record<string, any> = {}

    setValueAtPath(target, 'address.city', 'Lagos')

    expect(target.address.city).toBe('Lagos')
  })

  it('overwrites array items in place', () => {
    const target = { list: ['a', 'b'] }

    setValueAtPath(target, 'list.1', 'changed')

    expect(target.list).toStrictEqual(['a', 'changed'])
  })
})
