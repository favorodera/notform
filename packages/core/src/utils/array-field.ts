import { parsePath, stringifyPath } from 'dot-prop'
import type { NotFormInstance } from '../types/not-form-instance'
import type {
  ArrayItemIndexMap,
  DotPropPathSegment,
  Issue,
  ObjectSchema,
  Paths,
  PathSegment,
} from '../types/shared'
import { isPathWithinScope, toPropertyKey } from './segments'

/**
 * Parsed array-item path and its nested segments.
 * @template TPathSegment Segment type of the candidate path.
 */
interface ArrayPathLocation<TPathSegment extends PathSegment> {
  /** Normalized index of the array item. */
  index: number

  /** Path segments below the item index. */
  remainingPathSegments: ReadonlyArray<TPathSegment>
}

/**
 * Locates an item path and preserves every segment nested below its index.
 * @template TPathSegment Segment type of the candidate path.
 * @template TArraySegment Segment type of the array field path.
 * @internal
 * @param pathSegments Candidate path, already split.
 * @param arrayFieldPathSegments Array field path, already split.
 * @returns Item index and leftover segments, or `undefined` when the path is not inside the array.
 */
export function locatePathInArrayField<
  TPathSegment extends PathSegment,
  TArraySegment extends PathSegment,
>(
  pathSegments: ReadonlyArray<TPathSegment>,
  arrayFieldPathSegments: ReadonlyArray<TArraySegment>,
): ArrayPathLocation<TPathSegment> | undefined {
  // Require an item-index segment after the array path, not the array path itself.
  if (pathSegments.length <= arrayFieldPathSegments.length || !isPathWithinScope(pathSegments, arrayFieldPathSegments)) {
    return undefined
  }

  // The segment right after the array path should be the item index.
  const itemIndexSegment = toPropertyKey(pathSegments[arrayFieldPathSegments.length])

  // Only numeric or numeric-string segments can identify an array item.
  if (typeof itemIndexSegment !== 'number' && typeof itemIndexSegment !== 'string') {
    return undefined
  }

  const itemIndex = Number(itemIndexSegment)

  // Reject non-numeric, negative, and fractional segments.
  if (!Number.isSafeInteger(itemIndex) || itemIndex < 0) {
    return undefined
  }

  return {
    index: itemIndex,
    // Preserve nested object and nested-array paths when the item moves.
    remainingPathSegments: pathSegments.slice(arrayFieldPathSegments.length + 1),
  }
}

/**
 * Remaps touched or dirty paths after an array mutation.
 * @template TSchema The form schema.
 * @internal
 * @param paths Touched or dirty paths to remap.
 * @param arraySegments Parsed array field path.
 * @param remapIndex Maps an old item index to its new index, or `undefined` if removed.
 */
function remapPathSet<TSchema extends ObjectSchema>(
  paths: Set<Paths<TSchema>>,
  arraySegments: ReadonlyArray<DotPropPathSegment>,
  remapIndex: ArrayItemIndexMap,
) {
  // Mutating `paths` mid-iteration would be unsafe, so collect changes first
  // and apply them in a separate pass below.
  const pathsToRemove: Array<Paths<TSchema>> = []
  const pathsToAdd: Array<Paths<TSchema>> = []

  for (const path of paths) {
    const parsedPath = parsePath(path)

    const location = locatePathInArrayField(
      parsedPath,
      arraySegments,
    )

    // Path isn't inside this array field at all — leave it untouched.
    if (!location) {
      continue
    }

    // Every path inside the array is removed unconditionally: it either
    // gets re-added at its new index below, or was on a removed item and
    // is dropped for good.
    pathsToRemove.push(path)

    const nextIndex = remapIndex(location.index)

    // `undefined` means this item was removed — its state goes with it.
    if (nextIndex === undefined) {
      continue
    }

    // Rebuild the full path at the item's new index, keeping whatever was
    // nested underneath it (e.g. `.name`, `.tags.0`) unchanged.
    const nextPath = stringifyPath([
      ...arraySegments,
      nextIndex,
      ...location.remainingPathSegments,
    ], {
      preferDotForIndices: true,
    })

    pathsToAdd.push(nextPath as Paths<TSchema>)
  }

  for (const path of pathsToRemove) {
    paths.delete(path)
  }

  for (const path of pathsToAdd) {
    paths.add(path)
  }
}

/**
 * Moves touched, dirty, and error state with items, including nested paths.
 *
 * Validating state is not remapped; generation tracking already drops stale results.
 * @template TSchema The form schema.
 * @internal
 * @param form Full form instance.
 * @param arrayPath Dot path of the array field.
 * @param remapIndex Maps an old item index to its new index, or `undefined` if removed.
 */
export function remapArrayFieldState<TSchema extends ObjectSchema>(
  form: NotFormInstance<TSchema>,
  arrayPath: Paths<TSchema>,
  remapIndex: ArrayItemIndexMap,
) {
  const arraySegments = parsePath(arrayPath)

  remapPathSet(
    form.touchedFields,
    arraySegments,
    remapIndex,
  )

  remapPathSet(
    form.dirtyFields,
    arraySegments,
    remapIndex,
  )

  // Errors aren't a plain path Set (they're Issue objects with a path plus
  // a message), so they're remapped by hand rather than via `remapPathSet`.
  const remappedErrors: Array<Issue> = []

  for (const issue of form.errors) {
    // Form-level issues (no path) are never scoped to a field — always kept.
    if (!issue.path) {
      remappedErrors.push(issue)
      continue
    }

    const location = locatePathInArrayField(
      issue.path,
      arraySegments,
    )

    // Issue belongs to some other field entirely — pass it through unchanged.
    if (!location) {
      remappedErrors.push(issue)
      continue
    }

    const nextIndex = remapIndex(location.index)

    // Item was removed — its issue is discarded along with it, rather than
    // being pushed to `remappedErrors`.
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

  // Whole-array replace rather than in-place edits, since indices shifted
  // and the array's length/order may itself have changed.
  form.replaceErrors(remappedErrors)
}

/**
 * Returns an existing-item index or `undefined` for an invalid index.
 * @param index Candidate item index.
 * @param length Current array length.
 * @returns The index when it identifies an existing item; otherwise `undefined`.
 */
export function normalizeExistingIndex(index: number, length: number) {
  if (Number.isSafeInteger(index) && index >= 0 && index < length) {
    return index
  }
}

/**
 * Clamps an insertion index to the valid half-open range `[0, length]`.
 * @param index Candidate insertion index.
 * @param length Current array length.
 * @returns The clamped index, or `undefined` for a non-integer.
 */
export function normalizeInsertionIndex(index: number, length: number) {
  if (!Number.isSafeInteger(index)) {
    return
  }

  return Math.max(0, Math.min(index, length))
}

/**
 * Clamps a move destination to the valid existing-item range.
 * @param index Candidate destination index.
 * @param length Current array length.
 * @returns The clamped index, or `undefined` for an invalid index or empty array.
 */
export function normalizeMoveDestination(index: number, length: number) {
  if (length === 0 || !Number.isSafeInteger(index)) {
    return
  }

  return Math.max(0, Math.min(index, length - 1))
}
