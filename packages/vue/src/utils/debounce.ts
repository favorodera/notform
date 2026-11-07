/**
 * Cleans up a debounce delay so it is always safe to hand to `setTimeout`.
 * @param delayInMilliseconds The delay requested by the user, if any.
 * @returns `undefined` when no delay was given; otherwise the delay clamped to
 * `0` or more (negative, `NaN` and `Infinity` all become `0`).
 * @example
 * normalizeDebounce(undefined) // undefined
 * normalizeDebounce(-50) // 0
 */
export function normalizeDebounce(delayInMilliseconds?: number): number | undefined {
  if (delayInMilliseconds === undefined) {
    return
  }

  return Number.isFinite(delayInMilliseconds) ? Math.max(0, delayInMilliseconds) : 0
}
