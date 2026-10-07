# `useNotForm`

The public composable creates the form instance used by NotForm components.

[Read the full raw reference.](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md)

## Usage

```ts
const form = useNotForm({
  schema,
  initialValues: {
    email: '',
  },
  initialErrors: [],
  async onSubmit(data) {
    await save(data)
  },
})
```

## Configuration

| Option | Meaning |
| --- | --- |
| `schema` | Required Standard Schema-compatible object schema; accepts a value, ref, or getter |
| `initialValues` | Optional deep-partial schema input used as values and baseline |
| `initialErrors` | Optional initial `Issue[]` shown before validation |
| `onSubmit` | Optional handler receiving schema output after successful submit validation |

## Public API

| API | Use |
| --- | --- |
| `values` | Reactive form input values |
| `errors` | Active validation issues |
| `getFieldErrors(path)` | Exact-path error lookup |
| `setError(issue)` | Upsert/add a validation issue |
| `setValue(path, value)` | Typed value update; does not validate |
| `validate()` | Whole-form validation |
| `validateField(path)` | Scoped validation for a path and its descendants |
| `submit(event?)` | Touch, validate, then call `onSubmit` when valid |
| `reset(values?, errors?)` | Restore or replace the baseline |
| `isDirty` | Any value differs from baseline |
| `isTouched` | At least one field is touched |
| `isValid` | `errors` is empty |
| `isValidating` | Validation is active |
| `isSubmitting` | Submission is active |

## Important semantics

- Use the schema's **input** type for `values` and `initialValues`; use the schema's **output** type for successful validation and `onSubmit`.
- `setValue()` does not trigger validation.
- `isValid` is derived state, not an implicit validation call.
- `validate()` is last-write-wins for shared form errors.
- `validateField()` includes descendant issues for object/array scopes.
- `reset(values, errors)` replaces the baseline instead of merging.
- `setError()` is the boundary for server-side/application-specific issues.

Field helper composables are implementation details behind the renderless components; application code normally uses `NotField` and `NotArrayField`.
