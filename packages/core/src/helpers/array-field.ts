import { parsePath, stringifyPath } from 'dot-prop'
import type { FormInstance } from '../types/instance'
import type { ArrayItemIndexMap, DotPropPathSegment, Issue, ObjectSchema, Path, PathSegment } from '../types/shared'
import { isPathWithinScope, toPropertyKey } from './segments'

/**
 * Result of resolving an array-item path within a parent array field.
 * @template TPathSegment Remaining path segments under the array item.
 */
interface ArrayPathLocation<TPathSegment extends PathSegment> {
  /** Item index within the array. */
  index: number

  /** Remaining nested segments after the item index. */
  remainingPathSegments: ReadonlyArray<TPathSegment>
}

/**
 * Finds the item index and remaining path for a nested path inside an array field.
 * @template TPathSegment Segment type of the candidate path.
 * @template TArraySegment Segment type of the array-field path.
 * @param pathSegments Fully parsed candidate path.
 * @param arrayFieldPathSegments Fully parsed array field path.
 * @returns The item location when the path is nested under an array item, otherwise `undefined`.
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
 * Updates touched field paths after an array mutation.
 * @template TSchema Schema that defines the paths being remapped.
 * @param paths Set of touched field paths to update.
 * @param arraySegments Parsed path to the array field.
 * @param remapIndex Function that maps each old item index to its new index or removes it.
 */
function remapPathSet<TSchema extends ObjectSchema>(
  paths: Set<Path<TSchema>>,
  arraySegments: ReadonlyArray<DotPropPathSegment>,
  remapIndex: ArrayItemIndexMap,
): void {
  const pathsToRemove: Array<Path<TSchema>> = []
  const pathsToAdd: Array<Path<TSchema>> = []

  // Collect removals and additions separately to avoid mutating the set while iterating.
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
 * Moves field-level touched state and validation issues with array items after a reorder or removal.
 * @template TSchema Object schema that owns the array field.
 * @param form Form instance whose state will be updated.
 * @param arrayPath Path to the mutated array.
 * @param remapIndex Maps each previous item index to a replacement index, or returns `undefined` to remove an item.
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
    // Form-level issues have no field path and must survive array mutations.
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
      // Drop errors belonging to an item that was removed.
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
 * Validates an index against the current array length.
 * @param index Requested item index.
 * @param length Current array length.
 * @returns The input index when it is within bounds, otherwise `undefined`.
 */
export function normalizeExistingIndex(index: number, length: number): number | undefined {
  if (Number.isSafeInteger(index) && index >= 0 && index < length) {
    return index
  }
}

/**
 * Clamps an insertion index into the valid array bounds.
 * @param index Requested insertion index.
 * @param length Current array length.
 * @returns A safe insertion index in the `0..length` range, or `undefined` when the input is not an integer.
 */
export function normalizeInsertionIndex(index: number, length: number): number | undefined {
  if (!Number.isSafeInteger(index)) {
    return
  }

  return Math.max(0, Math.min(index, length))
}

/**
 * Clamps a move destination to the nearest valid item index.
 * @param index Requested destination index.
 * @param length Current array length.
 * @returns A valid destination index, or `undefined` when the array is empty or the input is not an integer.
 */
export function normalizeMoveDestination(index: number, length: number): number | undefined {
  if (length === 0 || !Number.isSafeInteger(index)) {
    return
  }

  return Math.max(0, Math.min(index, length - 1))
}
