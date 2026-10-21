# NotForm concepts

Use these pages for behavior and mental models rather than component wiring.

## Read by topic

| Topic | Raw page |
| --- | --- |
| Values, baseline, dirty/touched/valid/submitted/submitting/validating state | https://notformdocs.vercel.app/raw/docs/concepts/form-state.md |
| Standard Schema, validation scope, triggers, eager/lazy, debounce, async concurrency | https://notformdocs.vercel.app/raw/docs/concepts/validation.md |
| Submit lifecycle, `onSubmit`, `isSubmitted`, and `submitCount` | https://notformdocs.vercel.app/raw/docs/concepts/submission.md |
| Stable array identity and state-aware mutations | https://notformdocs.vercel.app/raw/docs/concepts/arrays.md |
| Mapping API failures into `Issue` state | https://notformdocs.vercel.app/raw/docs/concepts/server-errors.md |

## State model

- `values` is live, deeply reactive input-shaped data.
- `errors` is the active `Issue[]` collection. Each issue may identify a field through its path.
- `isDirty` compares current values with the current reset baseline.
- `isTouched` becomes true when fields are touched or a submit attempt is accepted; reset clears it.
- `isValid` is derived from the current error collection and does not run validation.
- `isValidating` reflects active validation runs. New value/array state can invalidate an older run.
- `isSubmitting` covers an accepted submit cycle, including an asynchronous `onSubmit` call.
- `submitCount` counts accepted submit attempts since reset; `isSubmitted` is true when that count is greater than zero, whether the form passed validation or not.

## Validation model

- The schema is a Standard Schema-compatible object schema; the validator stays external to NotForm.
- `validate()` validates the whole form and writes the complete result into shared form errors. Overlapping whole-form calls use last-write-wins semantics.
- `validateField(path)` validates the schema and writes only issues at the requested path or below it. Its returned result is still the schema's full result.
- `getFieldErrors(path)`, `<Field>` slot errors, `<Error>`, and `<ArrayField>`'s `errors` slot are exact-path lookups.
- `<Field>` defaults to blur/change triggers and eager mode. `onInput` and `onMount` are additional configurable triggers; `onMount` is lifecycle behavior, not a DOM event.
- `lazy` suppresses input/change validation. Debounced input/change validation can be cancelled by blur; blur validation runs immediately.
- `setValue()` changes values and dirty state but does not itself validate.
- Value changes and array structural mutations invalidate old in-flight validation results so stale results cannot overwrite newer state.

## Submission model

`form.submit(event?)`:

1. Prevents native default behavior when given an event.
2. Ignores a new submission while another submission is active.
3. Increments `submitCount` for an accepted attempt and sets submission state.
4. Validates the current form values; if values change during an asynchronous validation, it validates the newer snapshot instead.
5. Writes validation issues and skips `onSubmit` when invalid.
6. Clears validation errors and calls `onSubmit` with schema output when valid.
7. Keeps `isSubmitting` active through an asynchronous `onSubmit` handler.

`<Form>` binds native submit to `form.submit` internally. Applications do not need to add `@submit="form.submit"` for normal usage.

## Baselines and reset

`initialValues` establishes the starting baseline. `reset(values?, errors?)` establishes a new complete baseline when replacement values/errors are supplied; it does not merge the supplied values with the old baseline. Reset restores values and baseline errors, clears touched markers and submit count, and cancels active validation/submission work. `<Form>` prevents the browser's native reset action and calls `form.reset()` internally.

## Arrays

Array mutations are form-state bookkeeping, not just value changes. `append`, `prepend`, `insert`, `remove`, `update`, `swap`, and `move` keep render keys and relevant touched/error paths aligned with the affected items. `update` replaces the value while preserving the key and position. Use `item.key` for Vue identity; `item.index` and `item.path` represent the current position. Dirty state remains a comparison of values against the reset baseline.

Array aggregate validity, touched, dirty, and validating state account for the configured array subtree. The `errors` slot prop, however, contains only issues attached exactly to the array path.

## Server errors

Map API failures into Standard Schema-shaped `Issue` objects and call `form.setError()`. Field errors and form-level errors share the same `form.errors` collection. A later validation can replace the current collection.
