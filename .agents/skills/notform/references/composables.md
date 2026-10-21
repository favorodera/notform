# `useForm`

`useForm()` creates the public form instance used by NotForm components. It is exported by the core `notform` package and auto-imported by `@notform/nuxt`.

[Read the full raw reference.](https://notformdocs.vercel.app/raw/docs/composables/use-form.md)

## Usage

```ts
import { useForm } from 'notform'
import { z } from 'zod'

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

const form = useForm({
  schema,
  initialValues: {
    email: '',
    password: '',
  },
  async onSubmit(data) {
    await save(data)
  },
})
```

## Configuration

| Option | Meaning |
| --- | --- |
| `schema` | Required Standard Schema-compatible object schema; accepts a value, ref, or getter |
| `initialValues` | Optional deep-partial schema input used as live values and the initial dirty baseline |
| `initialErrors` | Optional `Issue[]` shown before the first validation run |
| `onSubmit` | Optional handler receiving schema output after successful submit validation; may be async |

## Public API

| API | Use |
| --- | --- |
| `values` | Reactive form input values. |
| `errors` | Active validation issues (`Issue[]`) |
| `getFieldErrors(path)` | Exact-path error lookup; excludes descendant issues |
| `setError(issue)` | Add an issue or replace an issue at the same normalized path |
| `setValue(path, value)` | Typed value update; synchronizes dirty state and invalidates validation but does not validate |
| `validate()` | Whole-form validation; writes whole-form errors with last-write-wins semantics |
| `validateField(path)` | Validates and updates issues scoped to the requested path and its descendants |
| `submit(event?)` | Prevent event default, ignore duplicate active submits, validate and call `onSubmit` only when valid |
| `reset(values?, errors?)` | Restore baseline or replace the full baseline and reset state |
| `isDirty` | Whether current values differ from the reset baseline |
| `isTouched` | Whether a field has been touched or a submit attempt has been accepted |
| `isValid` | Whether the current error collection is empty; does not run validation |
| `isValidating` | Whether any validation run is currently active |
| `isSubmitting` | Whether a submit cycle is currently active, including async `onSubmit` |
| `isSubmitted` | Whether at least one submit attempt has been accepted since reset; does not imply valid submission |
| `submitCount` | Number of accepted submit attempts since reset; reset returns it to zero |

## Important semantics

- Use schema input types for `values` and `initialValues`; use the schema output type for successful validation and `onSubmit`. Transforms/coercions may make input and output different.
- `setValue()` does not trigger validation. Value changes invalidate older in-flight validation results.
- `isValid` is derived from current `errors`, not an implicit validation call.
- Whole-form overlapping validations use last-write-wins semantics for shared error state.
- `validateField()` returns the schema result, while the errors written by that call are scoped to the requested path and descendants.
- `getFieldErrors()` and component error lookups are exact path matches. Do not use them as descendant queries.
- `submit()` revalidates current values if values change while async validation is pending; duplicate submits are ignored while `isSubmitting` is true.
- `reset(values, errors)` replaces, rather than merges with, the existing baseline. Reset clears touched and submit state, restores baseline errors, and invalidates/cancels in-flight validation and submission work.
- `setError()` is the public boundary for server-side or application-specific issues. Later validation can replace the active error collection.

## Form component integration

```vue
<template>
  <Form :form="form">
    <!-- Field, ArrayField, Error, and native controls -->
    <button type="submit">Save</button>
    <button type="reset">Reset</button>
  </Form>
</template>
```

`Form` wires native submit and reset events internally. Call `form.submit()` or `form.reset()` directly from application code when needed; explicit template event bindings are not required for the normal `<Form>` lifecycle.

The `Field` and `ArrayField` composables are used behind their renderless components; application templates should normally use `<Field>` and `<ArrayField>` rather than rely on those internal helpers directly.
