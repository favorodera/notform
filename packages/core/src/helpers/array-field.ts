import { parsePath, stringifyPath } from 'dot-prop'
import type { FormInstance } from '../types/instance'
import type { ArrayItemIndexMap, DotPropPathSegment, Issue, ObjectSchema, Path, PathSegment } from '../types/shared'
import { isPathWithinScope, toPropertyKey } from './segments'

interface ArrayPathLocation<TPathSegment extends PathSegment> {
  index: number
  remainingPathSegments: ReadonlyArray<TPathSegment>
}

/**
 * @param pathSegments
 * @param arrayFieldPathSegments
 */
export function locatePathInArrayField<
  TPathSegment extends PathSegment,
  TArraySegment extends PathSegment,
>(
  pathSegments: ReadonlyArray<TPathSegment>,
  arrayFieldPathSegments: ReadonlyArray<TArraySegment>,
): ArrayPathLocation<TPathSegment> | undefined {
  if (pathSegments.length <= arrayFieldPathSegments.length || !isPathWithinScope(pathSegments, arrayFieldPathSegments)) {
    return undefined
  }

  const itemIndexSegment = toPropertyKey(pathSegments[arrayFieldPathSegments.length])

  if (typeof itemIndexSegment !== 'number' && typeof itemIndexSegment !== 'string') {
    return undefined
  }

  const itemIndex = Number(itemIndexSegment)

  if (!Number.isSafeInteger(itemIndex) || itemIndex < 0) {
    return undefined
  }

  if (typeof itemIndexSegment === 'string' && String(itemIndex) !== itemIndexSegment) {
    return undefined
  }

  return {
    index: itemIndex,
    remainingPathSegments: pathSegments.slice(arrayFieldPathSegments.length + 1),
  }
}

/**
 * @param paths
 * @param arraySegments
 * @param remapIndex
 */
function remapPathSet<TSchema extends ObjectSchema>(
  paths: Set<Path<TSchema>>,
  arraySegments: ReadonlyArray<DotPropPathSegment>,
  remapIndex: ArrayItemIndexMap,
) {
  const pathsToRemove: Array<Path<TSchema>> = []
  const pathsToAdd: Array<Path<TSchema>> = []

  for (const path of paths) {
    const location = locatePathInArrayField(parsePath(path), arraySegments)

    if (!location) {
      continue
    }

    pathsToRemove.push(path)

    const nextIndex = remapIndex(location.index)
    if (nextIndex === undefined) {
      continue
    }

    pathsToAdd.push(stringifyPath([
      ...arraySegments,
      nextIndex,
      ...location.remainingPathSegments,
    ], { preferDotForIndices: true }) as Path<TSchema>)
  }

  for (const path of pathsToRemove) {
    paths.delete(path)
  }

  for (const path of pathsToAdd) {
    paths.add(path)
  }
}

/**
 * Moves touched paths and validation issues with array items.
 * @param form
 * @param arrayPath
 * @param remapIndex
 */
export function remapArrayFieldState<TSchema extends ObjectSchema>(
  form: FormInstance<TSchema>,
  arrayPath: Path<TSchema>,
  remapIndex: ArrayItemIndexMap,
) {
  const arraySegments = parsePath(arrayPath)

  remapPathSet(form.touchedFields, arraySegments, remapIndex)

  const remappedErrors: Array<Issue> = []

  for (const issue of form.errors) {
    if (!issue.path) {
      remappedErrors.push(issue)
      continue
    }

    const location = locatePathInArrayField(issue.path, arraySegments)
    if (!location) {
      remappedErrors.push(issue)
      continue
    }

    const nextIndex = remapIndex(location.index)
    if (nextIndex === undefined) {
      continue
    }

    remappedErrors.push({
      ...issue,
      path: [
        ...arraySegments,
        nextIndex,
        ...location.remainingPathSegments,
      ],
    })
  }

  form.replaceErrors(remappedErrors)
}

/**
 * @param index
 * @param length
 */
export function normalizeExistingIndex(index: number, length: number) {
  if (Number.isSafeInteger(index) && index >= 0 && index < length) {
    return index
  }
}

/**
 * @param index
 * @param length
 */
export function normalizeInsertionIndex(index: number, length: number) {
  if (!Number.isSafeInteger(index)) {
    return
  }

  return Math.max(0, Math.min(index, length))
}

/**
 * @param index
 * @param length
 */
export function normalizeMoveDestination(index: number, length: number) {
  if (length === 0 || !Number.isSafeInteger(index)) {
    return
  }

  return Math.max(0, Math.min(index, length - 1))
}
