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

interface ArrayPathLocation<TPathSegment extends PathSegment> {
  index: number
  remainingPathSegments: ReadonlyArray<TPathSegment>
}

/**
 * Locates a field path inside an array field, e.g. `users.1.email` under
 * `users`, or `users.1.addresses.0.city` under `users` — `remainingPathSegments`
 * holds whatever comes after the index, however many segments deep that is.
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
  // `<=` (not `<`) rules out the array's own path too: a path must have at
  // least one segment past the array path — the item index — to be "inside" it.
  if (pathSegments.length <= arrayFieldPathSegments.length || !isPathWithinScope(pathSegments, arrayFieldPathSegments)) {
    return undefined
  }

  // The segment right after the array path should be the item index.
  const itemIndexSegment = toPropertyKey(pathSegments[arrayFieldPathSegments.length])

  // An object key (not number/string) here means this isn't actually an
  // array index position — bail rather than force a bad match.
  if (typeof itemIndexSegment !== 'number' && typeof itemIndexSegment !== 'string') {
    return undefined
  }

  const itemIndex = Number(itemIndexSegment)

  // Guards against non-numeric-looking string keys (e.g. an object field
  // that happens to share the array's path prefix) and negative/fractional
  // values that can't be a real array index.
  if (!Number.isSafeInteger(itemIndex) || itemIndex < 0) {
    return undefined
  }

  return {
    index: itemIndex,
    // Everything past the index, at any depth — lets callers relocate state
    // nested arbitrarily deep inside the item, not just the item's own path.
    remainingPathSegments: pathSegments.slice(arrayFieldPathSegments.length + 1),
  }
}

/**
 * Rewrites paths in a set after an array mutation. Paths outside the array are left as-is.
 * @template TSchema The form schema.
 * @internal
 * @param paths Touched or dirty path set.
 * @param arraySegments Split array field path.
 * @param remapIndex Previous item index → next index, or `undefined` if removed.
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
 * Moves touched, dirty, and error state with array items after a structural
 * mutation. Because {@linkcode locatePathInArrayField} keeps whatever follows the
 * item's index as `remainingPathSegments`, this already handles state nested
 * arbitrarily deep inside an item — a field on an object item, or an item
 * inside a nested array of its own — not just the item's own top-level path.
 *
 * Validating state is not remapped; generation tracking already drops stale results.
 * @template TSchema The form schema.
 * @internal
 * @param form Full form instance.
 * @param arrayPath Dot path of the array field.
 * @param remapIndex Previous item index → next index, or `undefined` if removed.
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
