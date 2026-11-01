import type { PathSegment, PathSegments } from '../types/path'
import type { ValidationIssue } from '../types/validation'
import type { IndexMapper } from './array'
import { getSegmentIndex, isPathInside, splitPath } from './path'

/** Message used when something was thrown that carries no readable text. */
const FALLBACK_VALIDATION_ERROR_MESSAGE = 'Validation failed'

/**
 * Turns anything thrown during validation into a regular issue, so a crashing
 * schema shows up as a form error instead of an unhandled exception.
 * @param error Whatever was thrown.
 * @param path Dot-notation path of the field being validated. Leave out for a form-level error.
 * @returns An issue carrying the error's message.
 * @example
 * createValidationIssueFromError(new Error('Down'), 'email') // { message: 'Down', path: ['email'] }
 */
export function createValidationIssueFromError(error: unknown, path?: string): ValidationIssue {
  const message = getErrorMessage(error)

  return path
    ? { message, path: splitPath(path) }
    : { message }
}

/**
 * Re-points an issue that lives inside an array after the array was mutated.
 * @param issue The issue to adjust.
 * @param arraySegments Path of the mutated array.
 * @param mapIndex Translates an item's old index to its new one.
 * @returns The same issue when it is unaffected, a copy with the new index when the
 * item moved, or `undefined` when the item no longer exists.
 */
export function remapIssueIndex(issue: ValidationIssue, arraySegments: PathSegments, mapIndex: IndexMapper): undefined | ValidationIssue {
  const { path } = issue

  // not inside the array, or an issue on the array itself (e.g. "at least one item")
  if (!path || path.length <= arraySegments.length || !isPathInside(path, arraySegments)) {
    return issue
  }

  const oldIndex = getSegmentIndex(path[arraySegments.length] as PathSegment)

  if (oldIndex === undefined) {
    return issue
  }

  const newIndex = mapIndex(oldIndex)

  if (newIndex === undefined) {
    return undefined
  }

  if (newIndex === oldIndex) {
    return issue
  }

  return {
    ...issue,
    path: [...path.slice(0, arraySegments.length), newIndex, ...path.slice(arraySegments.length + 1)],
  }
}

/**
 * Extracts readable text from a thrown value.
 * @param error Whatever was thrown.
 * @returns The `Error` message, the string itself, or a generic fallback.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return FALLBACK_VALIDATION_ERROR_MESSAGE
}
