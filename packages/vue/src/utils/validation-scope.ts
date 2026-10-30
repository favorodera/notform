import type { ValidationScope } from '../types/validation'
import { isPathInside, splitPath } from './path'

/**
 * Checks whether two validation runs cover any of the same part of the form.
 *
 * - A whole-form scope overlaps with everything.
 * - Two field scopes overlap when one path is the same as, or nested inside,
 * the other (`'user'` and `'user.name'` overlap; `'user'` and `'team'` do not).
 * @param firstScope Scope of the first run.
 * @param secondScope Scope of the second run.
 * @returns `true` if the scopes overlap.
 */
export function doValidationScopesOverlap(firstScope: ValidationScope, secondScope: ValidationScope): boolean {
  if (firstScope.type === 'form' || secondScope.type === 'form') {
    return true
  }

  // check both directions: either path may be the parent of the other
  const isFirstInsideSecond = isPathInside(firstScope.segments, secondScope.segments)
  const isSecondInsideFirst = isPathInside(secondScope.segments, firstScope.segments)

  return isFirstInsideSecond || isSecondInsideFirst
}

/**
 * Builds the scope for a validation run.
 * @param path Dot-notation field path. Leave out to cover the whole form.
 * @returns A field scope when `path` is given, otherwise a whole-form scope.
 * @example
 * getValidationScope() // { type: 'form' }
 * getValidationScope('tags.0') // { segments: ['tags', 0], type: 'field' }
 */
export function getValidationScope(path?: string): ValidationScope {
  if (path === undefined) {
    return { type: 'form' }
  }

  return { segments: splitPath(path), type: 'field' }
}
