# Debugging NotForm

Route the symptom first, then compare the user's code with the smallest matching current example.

## Symptom routing

| Symptom | Check first | Raw page |
| --- | --- | --- |
| Values, errors, reset, submit, or server-error state is wrong | `setValue`, reset replacement semantics, `submit`, `setError`, whole-form validation | https://notformdocs.vercel.app/raw/docs/composables/use-form.md |
| Validation fires too often, too late, or not at all | `events`, `validateOn`, `validationMode`, `debounce`, `onMount` | https://notformdocs.vercel.app/raw/docs/components/field.md |
| Parent validation misses nested issues | `validateField(path)` scope vs `getFieldErrors(path)` exact matching | https://notformdocs.vercel.app/raw/docs/concepts/validation.md |
| Stale async errors appear after a value/array change | validation invalidation and latest-run semantics | https://notformdocs.vercel.app/raw/docs/concepts/validation.md |
| Native form submits/reloads unexpectedly | Confirm the app uses current `<Form :form="form">`; it wires `form.submit(event)` internally. For a manually managed native form, call `form.submit(event)` yourself. | https://notformdocs.vercel.app/raw/docs/components/form.md |
| Reset does not restore expected state | Supplied reset values replace the complete baseline; `<Form>` prevents native reset and calls `form.reset()` | https://notformdocs.vercel.app/raw/docs/composables/use-form.md |
| Wrong field message | Check exact schema path; `getFieldErrors`, `<Field>` slot errors, and `<Error>` are exact-path lookups | https://notformdocs.vercel.app/raw/docs/components/error.md |
| Custom error component receives no text | `<Error as="...">` passes the message through its default slot; alternatively consume `{ message }` from the slot | https://notformdocs.vercel.app/raw/docs/components/error.md |
| Array rows keep the wrong identity/state | Confirm `:key="item.key"`; use the provided mutation methods rather than direct structural mutations | https://notformdocs.vercel.app/raw/docs/components/array-field.md |
| `isSubmitted`/`submitCount` seem unexpected | An accepted submit attempt increments the count even when validation fails; reset returns it to zero | https://notformdocs.vercel.app/raw/docs/concepts/submission.md |
| Nuxt APIs are missing or have the wrong name | Confirm `@notform/nuxt`, the `modules` entry, and any `notform.aliases` configuration | https://notformdocs.vercel.app/raw/docs/getting-started/nuxt.md |

## Debug checklist

1. Confirm the installed `notform`/`@notform/nuxt` version and schema shape.
2. Confirm the exact field path and whether the intended query is exact-path or subtree-scoped.
3. Confirm the correct `form` instance is passed or inherited from `<Form>` context.
4. Confirm `events` are bound to the actual input/custom component, and inspect `validateOn`, `validationMode`, and `debounce`.
5. Inspect `form.values`, `form.errors`, and the relevant dirty/touched/validation/submission flags before and after the interaction.
6. For arrays, inspect `item.key`, `item.path`, and the mutation method used; avoid index-based Vue keys.
7. For async behavior, check whether values changed or a reset occurred while validation/submission was in flight.
8. Run the project's typecheck and tests before declaring the fix complete.

Avoid treating a playground reproduction as the source of truth. Never request secrets or production data when building a reproduction.
