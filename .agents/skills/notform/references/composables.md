# NotForm composables

Covers `useNotForm`: choosing a schema, initializing form state, validating, handling server errors, submitting, resetting, and reading form state. The published reference is the source of truth. Don't recreate its API from memory.

## Which page to fetch

| Task | Fetch |
| --- | --- |
| A complete first form | [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md) |
| Signatures, options, return values, validation, errors, submit, reset | [useNotForm](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md) |
| Installation or validator choice | [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md) |
| A form that uses the renderless wrapper | [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md), plus [components.md](components.md) |

If the page is unclear, start with the [LLM index](https://notformdocs.vercel.app/llms.txt).

## Focus keywords

When searching the raw composable reference, look for:

- `UseNotFormConfig`, `schema`, `initialValues`, `initialErrors`, and `onSubmit`
- `values`, `errors`, `setValue`, `getFieldErrors`, and `setError`
- `validate`, `validateField`, `submit`, and `reset`
- `isDirty`, `isTouched`, `isValid`, `isValidating`, and `isSubmitting`
- typed dot paths, schema input/output, Standard Schema, async validation, and last-write-wins

## Guidance for answers

- Prefer a documented example over an invented API.
- Keep the validator separate from NotForm. NotForm accepts Standard Schema-compatible validators, and the schema's input must be an object.
- The schema can be passed directly, as a ref, or as a getter.
- `initialValues` is typed against the schema's *input*, while `onSubmit` receives the schema's *output*. They differ when the schema transforms data (for example `z.coerce.number()`).
- Distinguish programmatic `setValue` from validation. Check the reference for exact behavior.
- Link the relevant raw page in the answer when the user needs continued reference.
- For component wiring, defer to [components.md](components.md) and the NotForm and NotField pages, not this file alone.

## Pitfalls

These come straight from the `useNotForm` page. Check it before relying on one for anything subtle.

- `setValue()` updates the value and recomputes `isDirty`, but doesn't validate. Call `validate()` or `validateField(path)` afterward if you need it.
- `isValid` reflects the current `errors` collection. It doesn't run validation.
- `getFieldErrors(path)` matches the path exactly. An issue on `groups.0.name` is not returned for `groups.0`.
- `validate()` is last-write-wins. Each call resolves with its own result, but only the most recently started call writes to `form.errors`.
- `validateField(path)` accepts any granularity (a leaf, a whole array, one item). On failure it adds issues to the form's errors.
- `reset(values, errors)` replaces the baseline instead of merging with it. A key missing from the new `values` is gone afterward. `reset()` with no arguments restores the current baseline.
- `submit(event)` calls `event.preventDefault()` immediately, so `@submit="form.submit"` is enough to stop the browser's own submission. Without an `onSubmit`, submitting still validates but has nothing to run on success.
- `setError` upserts an issue at the same path, or appends it. Use it for server-side validation results. The reference has a working demo, and shows the exact `Issue` path shape.

## Canonical resources

- [LLM index](https://notformdocs.vercel.app/llms.txt)
- [Full LLM bundle](https://notformdocs.vercel.app/llms-full.txt)
- [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md)
- [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md)
- [useNotForm](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md)
- [Standard Schema](https://standardschema.dev/)
