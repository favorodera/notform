import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { PathSegments } from './path'

/**
 * A single validation problem reported by a schema.
 *
 * Carries a human-readable `message` and an optional `path` (in segments) that
 * points at the offending value. An issue without a `path` applies to the form as a whole.
 */
export type ValidationIssue = StandardSchemaV1.Issue

/**
 * What started a validation run.
 *
 * - `'field'`: `form.validateField(path)`.
 * - `'form'`: `form.validate()` (manual, whole form).
 * - `'submit'`: `form.submit()`.
 */
export type ValidationOrigin = 'field' | 'form' | 'submit'

/**
 * What a finished validation run hands back to its caller.
 * @template TValue - The type of the validated value on success.
 */
export type ValidationOutcome<TValue> = {
  /** `true` if a newer run superseded this one while it was running. Ignore `result` when set. */
  isStale: boolean

  /** The raw schema result. */
  result: ValidationResult<TValue>
}

/**
 * The raw Standard Schema result of a validation: either `{ value }` on
 * success or `{ issues }` on failure.
 * @template TValue - The type of the validated value on success.
 */
export type ValidationResult<TValue> = StandardSchemaV1.Result<TValue>

/**
 * Book-keeping record for one validation that is currently in flight.
 *
 * Validation is async, so a newer run can make an older one obsolete. Each
 * run is tracked so it can be flagged as stale and its result ignored.
 */
export type ValidationRun = {
  /** Unique, ever-increasing number identifying this run. */
  id: number

  /** `true` once a newer overlapping run has replaced this one; its result must be discarded. */
  isStale: boolean

  /** What started this run. */
  origin: ValidationOrigin

  /** The part of the form this run covers. */
  scope: ValidationScope
}

/**
 * The part of the form a validation run is responsible for.
 *
 * - `{ type: 'form' }`: the whole form.
 * - `{ type: 'field', segments }`: one field, e.g. `'tags.0'` becomes `['tags', 0]`.
 */
export type ValidationScope
  = | { segments: PathSegments, type: 'field' }
    | { type: 'form' }
