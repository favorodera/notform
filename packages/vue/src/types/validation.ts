import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { PathSegments } from './path'

/**
 * A single validation problem reported by a schema: a human-readable `message`
 * and an optional `path` (in segments). An issue without a `path` applies to the whole form.
 */
export type ValidationIssue = StandardSchemaV1.Issue

/**
 * What started a validation run.
 *
 * - `'field'`: `form.validateField(path)` (also blur / change / input events).
 * - `'form'`: `form.validate()`.
 * - `'submit'`: `form.submit()`.
 */
export type ValidationOrigin = 'field' | 'form' | 'submit'

/**
 * What a finished validation run hands back.
 * @template TValue - Type of the validated value on success.
 */
export type ValidationOutcome<TValue> = {
  /** `true` if a newer run, or a value change, made this one obsolete. Ignore `result` when set. */
  isStale: boolean

  /** The raw schema result. */
  result: ValidationResult<TValue>
}

/**
 * The raw Standard Schema result: `{ value }` on success, `{ issues }` on failure.
 * @template TValue - Type of the validated value on success.
 */
export type ValidationResult<TValue> = StandardSchemaV1.Result<TValue>

/**
 * Book-keeping record of one validation that is in flight. Validation is
 * async, so each run is tracked to be flagged stale and have its result ignored.
 */
export type ValidationRun = {
  /** Unique, ever-increasing number. */
  id: number

  /** `true` once the run became obsolete; its result must be discarded. */
  isStale: boolean

  /** What started the run. */
  origin: ValidationOrigin

  /** The part of the form the run covers. */
  scope: ValidationScope
}

/**
 * The part of the form a run is about.
 *
 * - `{ type: 'form' }`: the whole form.
 * - `{ type: 'field', segments }`: one field, e.g. `'tags.0'` becomes `['tags', '0']`.
 */
export type ValidationScope
  = | { segments: PathSegments, type: 'field' }
    | { type: 'form' }
