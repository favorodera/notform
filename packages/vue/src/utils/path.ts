import { getProperty, parsePath, setProperty } from 'dot-prop'
import type { PathSegment, PathSegments } from '../types/path'

/**
 * @file
 * Everything that reads, writes, splits or compares paths lives here, so the
 * rest of the code never touches the path library (dot-prop) directly.
 *
 * - PATH      dot-notation text, e.g. 'address.city' or 'tags.0'
 * - SEGMENTS  the same location split into steps, e.g. ['address', 'city'] or ['tags', 0]
 */

/**
 * Reads a path step as an array index.
 * @param segment A path step: `0`, `'0'`, `{ key: 0 }`, ...
 * @returns The index, or `undefined` if the step is not a non-negative integer.
 * @example
 * getSegmentIndex('2') // 2
 * getSegmentIndex('name') // undefined
 */
export function getSegmentIndex(segment: PathSegment): number | undefined {
  const key = getSegmentKey(segment)

  if (typeof key === 'number') {
    return Number.isSafeInteger(key) && key >= 0 ? key : undefined
  }

  return typeof key === 'string' && (/^(?:0|[1-9]\d*)$/).test(key) ? Number(key) : undefined
}

/**
 * Reads the key out of a path step, whether it is bare or wrapped.
 * @param segment A path step: `'email'`, `0`, or `{ key: 'email' }`.
 * @returns The plain key.
 * @example
 * getSegmentKey({ key: 'email' }) // 'email'
 */
export function getSegmentKey(segment: PathSegment): PropertyKey {
  if (typeof segment === 'object' && segment !== null && 'key' in segment) {
    return segment.key
  }

  return segment
}

/**
 * Reads the value at a dot-notation path.
 * @param source The object to read from.
 * @param path Dot-notation path, e.g. `'tags.0'`.
 * @returns The value, or `undefined` if any step is missing.
 */
export function getValueAtPath(source: unknown, path: string): unknown {
  return getProperty(source as Record<string, any>, path)
}

/**
 * Checks whether a path sits at, or below, a parent path.
 * @param segments The path being tested.
 * @param parentSegments The path it should start with.
 * @returns `true` if `segments` equals `parentSegments` or is nested deeper.
 * @example
 * isPathInside(['user', 'name'], ['user']) // true
 * isPathInside(['user'], ['user']) // true
 * isPathInside(['user'], ['user', 'name']) // false
 */
export function isPathInside(segments: PathSegments, parentSegments: PathSegments): boolean {
  if (segments.length < parentSegments.length) {
    return false
  }

  return parentSegments.every((parentSegment, index) => {
    return isSameSegment(segments[index] as PathSegment, parentSegment)
  })
}

/**
 * Checks whether two paths point at exactly the same place.
 * @param firstSegments The first path (e.g. an issue's `path`).
 * @param secondSegments The second path.
 * @returns `true` if both exist, have the same length, and every step matches.
 * @remarks A missing path means "the whole form", so it never equals anything, not even another missing path.
 * @example
 * isSamePath(['tags', 0], ['tags', '0']) // true
 * isSamePath(undefined, undefined) // false
 */
export function isSamePath(firstSegments: PathSegments | undefined, secondSegments: PathSegments | undefined): boolean {
  if (!firstSegments || !secondSegments || firstSegments.length !== secondSegments.length) {
    return false
  }

  return firstSegments.every((segment, index) => {
    return isSameSegment(segment, secondSegments[index] as PathSegment)
  })
}

/**
 * Checks whether two path steps are the same key.
 *
 * `0` equals `'0'` because schema libraries disagree on whether array indexes
 * are numbers or strings. Wrapped keys (`{ key }`) are unwrapped first.
 * @param firstSegment The first step.
 * @param secondSegment The second step.
 * @returns `true` if both steps refer to the same key.
 */
export function isSameSegment(firstSegment: PathSegment, secondSegment: PathSegment): boolean {
  const firstKey = getSegmentKey(firstSegment)
  const secondKey = getSegmentKey(secondSegment)

  if (typeof firstKey === 'number' && typeof secondKey === 'string') {
    return Number.isSafeInteger(firstKey) && String(firstKey) === secondKey
  }

  if (typeof firstKey === 'string' && typeof secondKey === 'number') {
    return Number.isSafeInteger(secondKey) && firstKey === String(secondKey)
  }

  return firstKey === secondKey
}

/**
 * Appends one step to a path.
 * @param parentPath The parent path. An empty string means the form root.
 * @param key The step to append (property name or array index).
 * @returns The combined path.
 * @example
 * joinPath('tags', 1) // 'tags.1'
 * joinPath('', 'name') // 'name'
 */
export function joinPath(parentPath: string, key: number | string): string {
  return parentPath === '' ? String(key) : `${parentPath}.${key}`
}

/**
 * Writes a value at a dot-notation path, creating missing steps.
 * @param target The object to write into (modified in place).
 * @param path Dot-notation path, e.g. `'address.city'`.
 * @param value The value to write.
 */
export function setValueAtPath(target: unknown, path: string, value: unknown): void {
  setProperty(target as Record<string, any>, path, value)
}

/**
 * Splits a dot-notation path into its steps.
 * @param path Dot-notation path, e.g. `'tags.0.name'`.
 * @returns The steps, e.g. `['tags', '0', 'name']` (indexes may be strings or numbers).
 */
export function splitPath(path: string): PathSegments {
  return parsePath(path)
}
