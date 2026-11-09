import type { PathSegments } from '../types/path'
import type { ValidationScope } from '../types/validation'
import { isPathInside, isSamePath, splitPath } from './path'

/**
 * Checks whether a new run makes an older run pointless.
 *
 * A field run only writes the errors of its own path, so it only replaces an
 * older run of that same path. A whole-form run writes everything, so it
 * replaces any older run.
 * @param coveringScope Scope of the new run.
 * @param coveredScope Scope of the older run.
 * @returns `true` if the older run's result would be overwritten anyway.
 */
export function doesScopeCover(coveringScope: ValidationScope, coveredScope: ValidationScope): boolean {
  if (coveringScope.type === 'form') {
    return true
  }

  return coveredScope.type === 'field' && isSamePath(coveringScope.segments, coveredScope.segments)
}

/**
 * Builds the scope of a validation run.
 * @param path Dot-notation field path. Leave out to cover the whole form.
 * @returns A field scope when `path` is given, otherwise a whole-form scope.
 * @example
 * getValidationScope('tags.0') // { segments: ['tags', '0'], type: 'field' }
 */
export function getValidationScope(path?: string): ValidationScope {
  if (path === undefined) {
    return { type: 'form' }
  }

  return { segments: splitPath(path), type: 'field' }
}

/**
 * Checks whether a running validation concerns a field, for `isValidating` flags.
 * A field counts as validating while the whole form, the field itself, or any
 * field nested inside it is being validated.
 * @param runScope Scope of the running validation.
 * @param fieldSegments Path of the field being asked about.
 * @returns `true` if the run concerns the field.
 */
export function isFieldAffectedByScope(runScope: ValidationScope, fieldSegments: PathSegments): boolean {
  if (runScope.type === 'form') {
    return true
  }

  return isPathInside(runScope.segments, fieldSegments)
}
