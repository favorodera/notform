import { reactive, readonly } from 'vue'
import type { ValidationOrigin, ValidationRun } from '../types/validation'
import { doesScopeCover, getValidationScope } from '../utils/validation-scope'

/**
 * Creates a tracker for validations that are currently running.
 *
 * Validation is async, so a second one can start before the first finishes.
 * The registry marks the older run stale, so its result is dropped instead of
 * overwriting fresher data.
 * @returns Functions to start a run, finish a run, and invalidate every run.
 * @remarks One registry per form.
 * @example
 * const run = runs.startRun('field', 'email')
 * // ... await validation ...
 * if (!run.isStale) {
 *   applyResult()
 * }
 * runs.finishRun(run)
 */
export function createValidationRunRegistry() {
  /** Id of the most recently started run. Only ever goes up. */
  let latestRunId = 0

  /** Runs that started but have not finished, keyed by run id. */
  const activeRuns = reactive(new Map<number, ValidationRun>())

  /**
   * Registers a run and marks the older runs it replaces as stale.
   *
   * A run replaces another when its result would overwrite it (see `doesScopeCover`).
   * A running submit is never replaced by a non-submit run: a field check or a
   * manual `validate()` must not cancel a submit in progress.
   * @param origin What started the run.
   * @param path Dot-notation field path. Leave out for a whole-form run.
   * @returns The new run. Check `run.isStale` after awaiting.
   */
  function startRun(origin: ValidationOrigin, path?: string): ValidationRun {
    const newRun: ValidationRun = {
      id: ++latestRunId,
      isStale: false,
      origin,
      scope: getValidationScope(path),
    }

    for (const [activeRunId, activeRun] of activeRuns) {
      const isSparedSubmit = origin !== 'submit' && activeRun.origin === 'submit'

      if (isSparedSubmit || !doesScopeCover(newRun.scope, activeRun.scope)) {
        continue
      }

      activeRun.isStale = true
      activeRuns.delete(activeRunId)
    }

    activeRuns.set(newRun.id, newRun)

    return newRun
  }

  /**
   * Removes a run from the active list, whether it succeeded, failed or went stale. Safe to call twice.
   * @param run The run returned by `startRun`.
   */
  function finishRun(run: ValidationRun): void {
    activeRuns.delete(run.id)
  }

  /** Marks every active run stale and empties the list (form reset, value change, schema change). */
  function markAllRunsStale(): void {
    for (const run of activeRuns.values()) {
      run.isStale = true
    }

    activeRuns.clear()
  }

  return {
    activeRuns: readonly(activeRuns),
    finishRun,
    markAllRunsStale,
    startRun,
  }
}
