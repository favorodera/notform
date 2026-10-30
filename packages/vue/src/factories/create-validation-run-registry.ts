import { reactive } from 'vue'
import type { ValidationOrigin, ValidationRun } from '../types/validation'
import { doValidationScopesOverlap, getValidationScope } from '../utils/validation-scope'

/**
 * Creates a tracker for validations that are currently running.
 *
 * Validation is asynchronous, so the user can trigger a second validation
 * before the first one finishes (typing quickly, submitting while a field
 * check is running). The registry lets a newer run mark any older overlapping
 * run as stale, so the old result is thrown away instead of overwriting fresh data.
 * @returns Functions to start a run, finish a run, and invalidate every run.
 * @remarks One registry is created per form.
 * @example
 * const runs = createValidationRunRegistry()
 * const run = runs.startRun('field', 'email')
 * // ... await validation ...
 * if (!run.isStale) {
 *   applyResult()
 * }
 * runs.finishRun(run)
 */
export function createValidationRunRegistry() {
  /** Id given to the most recently started run. Ids only ever go up. */
  let latestRunId = 0

  /** Runs that have started but not finished yet, keyed by run id. */
  const activeRuns = reactive(new Map<number, ValidationRun>())

  /**
   * Registers a new run and marks every overlapping active run as stale.
   *
   * A running submit is spared by non-submit runs: a field check or manual
   * `validate()` must never cancel a submit that is already in progress.
   * @param origin What started the run.
   * @param path Dot-notation field path. Leave out for a whole-form run.
   * @returns The new run. Check `run.isStale` after awaiting to see if it was replaced.
   */
  function startRun(origin: ValidationOrigin, path?: string): ValidationRun {
    const newRun: ValidationRun = {
      id: ++latestRunId,
      isStale: false,
      origin,
      scope: getValidationScope(path),
    }

    for (const [activeRunId, activeRun] of activeRuns) {
      const shouldSpareSubmitRun = origin !== 'submit' && activeRun.origin === 'submit'

      // only runs covering the same part of the form can make each other stale
      if (shouldSpareSubmitRun || !doValidationScopesOverlap(activeRun.scope, newRun.scope)) {
        continue
      }

      activeRun.isStale = true
      activeRuns.delete(activeRunId)
    }

    activeRuns.set(newRun.id, newRun)

    return newRun
  }

  /**
   * Removes a run from the active list. Call it when the run is done,
   * whether it succeeded, failed, or went stale. Safe to call twice.
   * @param run The run returned by `startRun`.
   */
  function finishRun(run: ValidationRun): void {
    activeRuns.delete(run.id)
  }

  /**
   * Marks every active run as stale and empties the list, e.g. when the form
   * is reset and in-flight results must no longer be applied.
   * @remarks Not called anywhere yet; kept for upcoming reset support.
   */
  function markAllRunsStale(): void {
    for (const run of activeRuns.values()) {
      run.isStale = true
    }

    activeRuns.clear()
  }

  return {
    finishRun,
    markAllRunsStale,
    startRun,
  }
}
