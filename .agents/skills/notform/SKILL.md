---
name: notform
description: "Use when building, configuring, reviewing, or debugging forms with NotForm in Vue 3 or Nuxt; when using `notform` or `@notform/nuxt`; or when working with `useForm`, `<Form>`, `<Field>`, `<ArrayField>`, `<Error>`, Standard Schema validation, typed paths, async validation, server errors, or dynamic arrays."
---

# NotForm

NotForm is a headless form state and validation library for Vue 3 and Nuxt. The application owns markup, styling, accessibility, and UI components; NotForm owns reactive values, validation issues, interaction state, validation timing, submission, reset, and dynamic-array bookkeeping.

Use [Standard Schema](https://standardschema.dev/) validators. Do not invent a NotForm-specific schema API.

The published NotForm docs are the public API source of truth. Load the focused raw page before relying on exact props, slot props, signatures, or edge-case behavior.

## Route the task

| Task | Read |
| --- | --- |
| Create/use a form instance, values, state, errors, validation, submit, reset | [composables.md](references/composables.md) |
| Understand state, validation, submission, arrays, and server errors | [concepts.md](references/concepts.md) |
| Build UI with `Form`, `Field`, `ArrayField`, and `Error` | [components.md](references/components.md) |
| Install/configure Nuxt auto-imports or debug SSR/imports | [nuxt.md](references/nuxt.md) |
| Diagnose unexpected behavior | [debugging.md](references/debugging.md) |

For cross-cutting tasks, load only the relevant references rather than guessing from memory.

## Workflow

1. Inspect the target app and identify whether it uses plain Vue/Vite or Nuxt.
2. Read the matching skill reference file(s).
3. Consult the linked raw docs page when exact props, slots, signatures, or edge-case behavior matters. Use [`/llms.txt`](https://notformdocs.vercel.app/llms.txt) to locate pages and [`/llms-full.txt`](https://notformdocs.vercel.app/llms-full.txt) for tasks spanning several areas.
4. Implement the current public API. Prefer the closest documented example over inventing a new pattern.
5. Run the project's typecheck/tests and verify the behavior in the target application.

## Non-negotiable API rules

- Create forms with `useForm({ schema, initialValues?, initialErrors?, onSubmit? })`.
- `schema` is a Standard Schema-compatible object schema and may be a value, ref, or getter. `values` and `initialValues` use the schema input shape (form values may be deeply partial before validation); successful validation and `onSubmit` use the schema output type.
- `setValue(path, value)` updates the value and dirty tracking, invalidates stale validation, and does not validate by itself.
- `getFieldErrors(path)` is an exact-path query; it does not include descendant issues.
- `validate()` validates the whole form; competing whole-form runs use last-write-wins semantics for shared errors.
- `validateField(path)` validates the schema and scopes the issues it writes to the requested path and its descendants. Use it for parent object/array scopes; do not confuse it with exact-path `getFieldErrors()`.
- `isValid` reflects the current active issue collection; it does not trigger validation.
- `submit(event?)` prevents the provided native event, ignores duplicate submissions while one is active, increments `submitCount` for accepted attempts, validates current values, and calls `onSubmit` only for valid output. `isSubmitted` means at least one accepted submit attempt since the last reset; it does not mean validation succeeded.
- `reset(values?, errors?)` replaces the complete baseline when values/errors are supplied; it does not merge with the prior baseline. Reset clears touched and submission state and cancels active validation/submission work.
- `<Form :form="form">` renders a native form, provides form context, and wires submit/reset internally. Ordinary usage does not need explicit `@submit="form.submit"` or `@reset="form.reset()"` bindings. It prevents native submit navigation and native reset behavior.
- `<Field>` defaults to eager validation with `onBlur` and `onChange` enabled. `onInput` and `onMount` can be enabled with `validateOn`; `onMount` is lifecycle behavior, not an input event. `lazy` suppresses input/change validation; blur and explicit validation remain available. Debounce delays enabled input/change validation, while blur runs immediately.
- `<Error>` renders the first current issue at an exact `path`, and renders nothing when that path has no error.
- `<ArrayField>` exposes stable `item.key` values, current `item.path` values, and state-aware structural methods. Use `item.key` for Vue's `v-for` key and the provided mutation methods when item identity/state must remain aligned. Do not describe `isDirty` as item-identity state: it compares current values with the reset baseline.
- Array aggregate `isValid`, `isTouched`, `isDirty`, and `isValidating` inspect the array path/subtree as appropriate; its `errors` slot value contains only issues attached exactly to the array path.
- `itemSchema` on `<ArrayField>` is used for TypeScript inference of inserted/updated values, not runtime validation. The main form schema validates the array.
- Value changes and structural array mutations invalidate old in-flight validation so stale results cannot overwrite newer state.
- The Nuxt module only provides integration/auto-imports. It does not install or choose a validator, add styling, or change core form behavior.

## Verification

Treat type errors, failing tests, and mismatched runtime behavior as evidence to revisit both the example and the source implementation. Do not claim behavior is documented when it is only an assumption.
