import type { ValidationIssue } from '../types/validation'
import { splitPath } from './path'

/** Message used when something was thrown that carries no readable text. */
const FALLBACK_VALIDATION_ERROR_MESSAGE = 'Validation failed'

/**
 * Turns anything thrown during validation into a regular {@link ValidationIssue},
 * so a crashing schema shows up as a normal form error instead of an unhandled exception.
 * @param error Whatever was thrown (an `Error`, a string, or anything else).
 * @param path Dot-notation path of the field being validated. Leave out for form-level errors.
 * @returns An issue with the error's message, attached to `path` when given.
 * @example
 * createValidationIssueFromError(new Error('Network down'), 'email')
 * // { message: 'Network down', path: ['email'] }
 * createValidationIssueFromError(42)
 * // { message: 'Validation failed' }
 */
export function createValidationIssueFromError(error: unknown, path?: string): ValidationIssue {
  const message = getErrorMessage(error)

  return path
    ? { message, path: splitPath(path) }
    : { message }
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
