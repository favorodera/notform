---
name: notform
description: "Use when building, configuring, reviewing, or debugging forms with NotForm in Vue 3 or Nuxt; when using `notform` or `notform-nuxt`; or when working with `useNotForm`, `<NotForm>`, `<NotField>`, `<NotArrayField>`, `<NotMessage>`, Standard Schema validation, typed paths, async validation, server errors, or dynamic arrays."
---

# NotForm

NotForm is a headless form state and validation library for Vue 3 and Nuxt. The application owns markup, styling, accessibility, and UI components; NotForm owns values, errors, touched/dirty state, validation timing, submission, reset, and dynamic-array bookkeeping.

Use [Standard Schema](https://standardschema.dev/) validators. Do not invent a NotForm-specific schema API.

The published NotForm docs are the public API source of truth. Load the focused raw page before relying on exact props, slot props, signatures, or edge-case behavior.

## Route the task

| Task | Read |
| --- | --- |
| Create/use a form instance, values, state, errors, validation, submit, reset | [composables.md](references/composables.md) |
| Understand state/validation/submission/arrays/server errors | [concepts.md](references/concepts.md) |
| Build UI with `NotForm`, `NotField`, `NotArrayField`, `NotMessage` | [components.md](references/components.md) |
| Add NotForm to Nuxt or debug Nuxt SSR/imports | [nuxt.md](references/nuxt.md) |
| Diagnose unexpected behavior | [debugging.md](references/debugging.md) |

For a cross-cutting task, load the smallest relevant set instead of guessing from memory.

## Workflow

1. Inspect the target app and identify whether it is plain Vue/Vite or Nuxt.
2. Read the matching skill reference file(s).
3. Fetch the linked raw docs page(s) when exact behavior matters. Use [`/llms.txt`](https://notformdocs.vercel.app/llms.txt) to find the page; use [`/llms-full.txt`](https://notformdocs.vercel.app/llms-full.txt) when the task spans multiple areas.
4. Implement the documented API. Prefer the closest documented example over inventing a new pattern.
5. Run the project's typecheck/tests and verify the behavior in the target application.

## Non-negotiable API rules

- Create forms with `useNotForm({ schema, initialValues?, initialErrors?, onSubmit? })`.
- `form.values` and `initialValues` use the schema input type; `onSubmit` and successful validation use schema output.
- `setValue()` updates the value and dirty state, invalidates stale validation, and does not validate by itself.
- `getFieldErrors(path)` is an exact-path query; it does not include descendant issues.
- `validate()` validates the whole form and uses last-write-wins semantics for shared errors.
- `validateField(path)` scopes written issues to the path and its descendants, so parent object/array validation can include nested issues.
- `form.isValid` reflects the current error collection; it does not trigger validation.
- `NotForm` renders a native `<form>` and provides form context. It handles native reset prevention, but submit prevention is performed by `form.submit(event)`.
- Bind `@submit="form.submit"` and `@reset="form.reset()"` when using `<NotForm>`.
- `NotField` defaults to `onBlur` and `onChange`, with `eager` validation mode. `onInput`, `onMount`, `lazy`, and `debounce` are opt-in behaviors.
- `NotMessage` renders the first exact-path error and renders nothing when there is no message.
- `NotArrayField` owns stable item keys and structural mutations. Use `item.key` as the Vue key and mutation methods instead of direct `push()`/`splice()` when row identity/state must stay synchronized.
- Array aggregate state (`isValid`, `isTouched`, `isDirty`, `isValidating`) includes descendants; array `errors` is exact-match to the array path.
- `itemSchema` is an inference aid for `NotArrayField`; the main form schema performs runtime validation.
- Value changes and structural array mutations invalidate older in-flight async validation so stale results cannot overwrite newer state.
- The Nuxt module adds integration and auto-imports. It does not install a validator or change NotForm behavior.

## Verification

Treat type errors, failing tests, and mismatched runtime behavior as evidence to revisit the docs and the actual form code before changing the API usage. Do not claim behavior is documented when it is only an assumption.
