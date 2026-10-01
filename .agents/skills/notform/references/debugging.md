# Debugging NotForm

Use this to route a problem to the authoritative documentation and produce a minimal reproduction. Don't rebuild the product docs here.

## Resource workflow

1. Classify the symptom: composable state, component wiring, arrays, Nuxt setup, or validator behavior.
2. Start with the [LLM index](https://notformdocs.vercel.app/llms.txt) if the symptom spans multiple areas.
3. Fetch the focused raw page:
   - [useNotForm](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md) for values, errors, validation, submit, reset, and async state.
   - [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) for native submit/reset and context.
   - [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md) for paths, events, triggers, modes, and debounce.
   - [NotArrayField](https://notformdocs.vercel.app/raw/docs/components/not-array-field.md) for keys, paths, nested state, and mutations.
   - [NotMessage](https://notformdocs.vercel.app/raw/docs/components/not-message.md) for exact-path message rendering.
   - [Nuxt module](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt-module.md) for auto-imports and SSR.
4. Compare the user's code with the smallest documented example.
5. Inspect the schema path, form instance, bound events, current values, and current errors before suggesting a change.
6. Use the [playground](https://notformdocs.vercel.app/playground) for a shareable browser reproduction.

## Symptom routing

| Symptom | Likely cause to check first | Read |
| --- | --- | --- |
| `setValue`, `validate`, `submit`, `reset`, or server error behavior is off | `setValue` doesn't validate. `reset(values)` replaces the baseline. `validate()` is last-write-wins. | [useNotForm](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md) |
| Page reloads on submit, reset doesn't clear errors, or the injected form is missing | Missing `@submit="form.submit"` or `@reset="form.reset()"`. Field used outside `<NotForm>` without a `form` prop. | [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) |
| Browser validation bubbles appear next to NotForm's messages | Native attributes like `required` trigger the browser's UI. Add `novalidate`. | [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) |
| Error never appears, or doesn't clear while typing | `events` not bound. `validateOn` doesn't include the trigger. `validationMode` is `lazy`. Eager mode only revalidates on input after the first issue. `debounce` is delaying it. | [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md) |
| Errors show on the wrong field or not at all | The `path` doesn't match the schema path exactly. `getFieldErrors` matches exactly, not nested paths. | [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md) |
| Message doesn't render, shows no text, or needs custom markup | When `as` is a component it must render a default `<slot />`. Only the first error is shown. | [NotMessage](https://notformdocs.vercel.app/raw/docs/components/not-message.md) |
| Array rows lose identity, inputs keep the wrong values, or nested errors look wrong | Index used as `:key`. Direct `.push()` or `.splice()` on `form.values`. Item issues expected in the array's `errors`. | [NotArrayField](https://notformdocs.vercel.app/raw/docs/components/not-array-field.md) |
| Components or `useNotForm` not found, or hydration oddities in Nuxt | `notform-nuxt` missing from `modules`. Validator not imported. | [Nuxt module](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt-module.md) |

Treat the "likely cause" column as a place to start looking, not a diagnosis. Confirm against the page and the user's code.

## Guardrails

- Don't assume `setValue` validates unless the composable reference says so.
- Match field and message paths exactly to the schema paths.
- For arrays, don't replace the documented stable-key or mutation behavior with index keys or direct structural mutation.
- A playground reproduction doesn't replace the published documentation.
- Ask for the schema, the relevant template, package versions, and the exact symptom when information is missing.
- Never ask users to include secrets or production data in a reproduction.

## Canonical resources

- [LLM index](https://notformdocs.vercel.app/llms.txt)
- [Full LLM bundle](https://notformdocs.vercel.app/llms-full.txt)
- [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md)
- [Playground](https://notformdocs.vercel.app/playground)

## Related

- API details for the form instance: [composables.md](composables.md)
- API details for the components: [components.md](components.md)
- Nuxt setup: [nuxt.md](nuxt.md)
