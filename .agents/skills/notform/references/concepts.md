# NotForm concepts

Use these pages for behavior and mental models rather than component wiring.

## Read by topic

| Topic | Raw page |
| --- | --- |
| Values, baseline, dirty/touched/valid/submitting/validating state | [Form State](https://notformdocs.vercel.app/raw/docs/concepts/form-state.md) |
| Standard Schema, validation scope, triggers, eager/lazy, debounce, async concurrency | [Validation](https://notformdocs.vercel.app/raw/docs/concepts/validation.md) |
| Submit lifecycle and `onSubmit` behavior | [Submission](https://notformdocs.vercel.app/raw/docs/concepts/submission.md) |
| Stable array identity and state-aware mutations | [Dynamic Arrays](https://notformdocs.vercel.app/raw/docs/concepts/arrays.md) |
| Mapping API failures into `Issue` state | [Server Errors](https://notformdocs.vercel.app/raw/docs/concepts/server-errors.md) |

## State model

- `values` is the live input data.
- `errors` is the active `Issue[]` collection.
- `isDirty` is based on deep comparison with the current baseline.
- `isTouched` tracks interaction, including submit-time touching.
- `isValid` is derived from `errors`; it does not run validation.
- `isValidating` stays true while active validation runs remain or until they are invalidated by a newer form change.
- `isSubmitting` covers the submit lifecycle, including async `onSubmit`.

## Validation model

- The schema is Standard Schema-compatible and takes an object input.
- `validate()` writes the whole-form result to `form.errors`.
- Whole-form validation is last-write-wins for shared state.
- `validateField(path)` validates the schema but writes only issues at `path` or below it.
- `getFieldErrors(path)` only returns issues whose path exactly equals `path`.
- Changing values or structurally changing arrays invalidates older async results.

## Submission model

`form.submit(event?)`:

1. prevents native submit when an event is provided
2. marks current fields touched
3. synchronizes dirty state for the current form shape
4. validates the complete form
5. skips `onSubmit` when invalid
6. calls `onSubmit` with schema output when valid
7. keeps `isSubmitting` active through async submission

A second submit while one is active is ignored.

## Baselines and reset

`initialValues` establishes the starting baseline. `reset(values?, errors?)` establishes a new complete baseline when arguments are supplied; it does not merge with the old baseline. Reset clears touched/dirty state and invalidates in-flight validation.

## Arrays

Array mutations are part of form-state bookkeeping, not just value changes. `append`, `prepend`, `insert`, `remove`, `update`, `swap`, and `move` keep item identity and nested touched/dirty/error state aligned with the moved item.

## Server errors

Map API failures into Standard Schema-shaped `Issue` objects and call `form.setError()`. Field errors and form-level errors share the same `form.errors` collection. A later validation can replace the current collection.
