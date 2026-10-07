# Debugging NotForm

Route the symptom first, then compare the user's code with the smallest matching documented example.

## Symptom routing

| Symptom | Check first | Raw page |
| --- | --- | --- |
| Values, errors, reset, submit, or server-error state is wrong | `setValue`, reset replacement semantics, `submit`, `setError`, whole-form validation | https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md |
| Validation fires too often, too late, or not at all | `events`, `validateOn`, `validationMode`, `debounce`, `onMount` | https://notformdocs.vercel.app/raw/docs/components/not-field.md |
| Parent validation misses nested issues | `validateField(path)` scope vs `getFieldErrors(path)` exact matching | https://notformdocs.vercel.app/raw/docs/concepts/validation.md |
| Stale async errors appear after a value/array change | validation invalidation and latest-run semantics | https://notformdocs.vercel.app/raw/docs/concepts/validation.md |
| Submit reloads the page | `@submit="form.submit"`; submit prevention lives in `form.submit(event)` | https://notformdocs.vercel.app/raw/docs/components/not-form.md |
| Reset does not restore expected state | `@reset="form.reset()"`; supplied reset values replace the baseline | https://notformdocs.vercel.app/raw/docs/components/not-form.md |
| Wrong field message | exact schema path mismatch; `getFieldErrors` and `NotMessage` are exact-path | https://notformdocs.vercel.app/raw/docs/components/not-field.md |
| Custom error component receives no text | `NotMessage as` uses the default slot; custom components must render that slot | https://notformdocs.vercel.app/raw/docs/components/not-message.md |
| Array rows keep the wrong identity/state | index used as key or direct structural mutation | https://notformdocs.vercel.app/raw/docs/components/not-array-field.md |
| Nuxt APIs are missing | `notform` module setup, auto-imports, or validator import | https://notformdocs.vercel.app/raw/docs/getting-started/nuxt.md |

## Debug checklist

1. Confirm the schema shape and exact path.
2. Confirm the form instance passed to the component or inherited through context.
3. Confirm `events` are bound to the real input/custom component.
4. Inspect `form.values`, `form.errors`, and relevant state flags before and after the interaction.
5. For arrays, inspect `item.key`, `item.path`, and the mutation method used.
6. For async behavior, check whether the value or array changed while validation was in flight.
7. Run the project's typecheck and tests before declaring the fix complete.

Avoid treating a playground reproduction as the source of truth. Never request secrets or production data when building a reproduction.
