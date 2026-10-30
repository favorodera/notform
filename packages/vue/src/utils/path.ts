import { getProperty, parsePath, setProperty } from 'dot-prop'
import type { PathSegment, PathSegments } from '../types/path'

/*
 * Everything in the library that reads, writes, splits or compares paths lives here,
 * so the rest of the code never touches the path library (dot-prop) directly.
 *
 *  - PATH      dot-notation text, e.g. 'address.city' or 'tags.0'
 *  - SEGMENTS  the same location split into steps, e.g. ['address', 'city'] or ['tags', 0]
 */

/**
 * Reads the actual key out of a path step, whether it is bare or wrapped.
 * @param segment A path step: `'email'`, `0`, or `{ key: 'email' }`.
 * @returns The plain key (`'email'` or `0`).
 * @example
 * getSegmentKey({ key: 'email' }) // 'email'
 * getSegmentKey('email') // 'email'
 */
export function getSegmentKey(segment: PathSegment): PropertyKey {
  if (typeof segment === 'object' && segment !== null && 'key' in segment) {
    return segment.key
  }

  return segment
}

/**
 * Reads the value found at a dot-notation path.
 * @param source The object to read from.
 * @param path Dot-notation path, e.g. `'address.city'` or `'tags.0'`.
 * @returns The value, or `undefined` if any step along the way is missing.
 * @example
 * getValueAtPath({ tags: ['a', 'b'] }, 'tags.1') // 'b'
 */
export function getValueAtPath(source: unknown, path: string): unknown {
  return getProperty(source as Record<string, any>, path)
}

/**
 * Checks whether a path sits at, or somewhere below, a parent path.
 * @param segments The path being tested.
 * @param parentSegments The path it should start with.
 * @returns `true` if `segments` equals `parentSegments` or is nested deeper inside it.
 * @example
 * isPathInside(['user', 'name'], ['user']) // true  (nested)
 * isPathInside(['user'], ['user']) // true  (same place)
 * isPathInside(['user'], ['user', 'name']) // false (shallower than the parent)
 * isPathInside(['team', 'name'], ['user']) // false (different branch)
 */
export function isPathInside(segments: PathSegments, parentSegments: PathSegments): boolean {
  // a path shorter than its parent can never be inside it
  if (segments.length < parentSegments.length) {
    return false
  }

  return parentSegments.every((parentSegment, index) => {
    return isSameSegment(segments[index], parentSegment)
  })
}

/**
 * Checks whether two paths point at exactly the same location.
 * @param firstSegments The first path (for example an issue's `path`).
 * @param secondSegments The second path.
 * @returns `true` if both paths exist, have the same length, and every step matches.
 * @remarks A missing path means "the whole form", so it is never considered the
 * same as anything, not even another missing path.
 * @example
 * isSamePath(['tags', 0], ['tags', '0']) // true
 * isSamePath(['tags'], ['tags', 0]) // false (different depth)
 * isSamePath(undefined, undefined) // false
 */
export function isSamePath(firstSegments: PathSegments | undefined, secondSegments: PathSegments | undefined): boolean {
  if (!firstSegments || !secondSegments || (firstSegments.length !== secondSegments.length)) {
    return false
  }

  return firstSegments.every((segment, index) => {
    return isSameSegment(segment, secondSegments[index])
  })
}

/**
 * Checks whether two path steps point at the same key.
 *
 * Numbers and numeric strings are treated as equal (`0` matches `'0'`),
 * because schema libraries disagree on whether array indexes are numbers or
 * strings. Wrapped keys (`{ key: 'email' }`) are unwrapped first.
 * @param firstSegment The first path step.
 * @param secondSegment The second path step.
 * @returns `true` if both steps refer to the same key.
 * @example
 * isSameSegment(0, '0') // true
 * isSameSegment({ key: 'email' }, 'email') // true
 * isSameSegment('email', 'name') // false
 */
export function isSameSegment(firstSegment: PathSegment, secondSegment: PathSegment): boolean {
  const firstKey = getSegmentKey(firstSegment)
  const secondKey = getSegmentKey(secondSegment)

  // number vs string: only equal if the number is a safe integer whose text matches the string
  if (typeof firstKey === 'number' && typeof secondKey === 'string') {
    return Number.isSafeInteger(firstKey) && String(firstKey) === secondKey
  }

  // string vs number: same rule, mirrored
  if (typeof firstKey === 'string' && typeof secondKey === 'number') {
    return Number.isSafeInteger(secondKey) && firstKey === String(secondKey)
  }

  return firstKey === secondKey
}

/**
 * Writes a value at a dot-notation path, creating missing steps along the way.
 * @param target The object to write into (it is modified in place).
 * @param path Dot-notation path, e.g. `'address.city'` or `'tags.0'`.
 * @param value The value to write.
 * @example
 * const values = { tags: ['a'] }
 * setValueAtPath(values, 'tags.1', 'b') // values.tags is now ['a', 'b']
 */
export function setValueAtPath(target: unknown, path: string, value: unknown): void {
  setProperty(target as Record<string, any>, path, value)
}

/**
 * Splits a dot-notation path into its steps.
 * @param path Dot-notation path, e.g. `'tags.0.name'`.
 * @returns The steps, e.g. `['tags', 0, 'name']`.
 * @example
 * splitPath('address.city') // ['address', 'city']
 */
export function splitPath(path: string): PathSegments {
  return parsePath(path)
}
