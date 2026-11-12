---
name: notform
description: 'Use when building, debugging, reviewing, or migrating forms with NotForm (the notform package for Vue or @notform/nuxt for Nuxt), including useForm, Form, Field, ArrayField, FieldError, form.field() and form.arrayField(). Routes the agent to the right NotForm documentation pages before it writes code, instead of answering from memory.'
user-invocable: true
---

# NotForm

NotForm's API is small but specific, and its names (`Field`, `useForm`, `form.field()`) are easy to confuse with other form libraries. This skill does not describe the API. It tells you which documentation to read for the task in front of you. Read the pages, then write the code.

Docs: `https://notform.favorodera.dev`

## Procedure

1. **Identify the stack and version.** Check `package.json` for `notform` (Vue) or `@notform/nuxt` (Nuxt) and note the version. In Nuxt, `useForm` and the components are auto-imported.
2. **Handle v3 first.** If the project is on `notform` 3.x, or uses `useNotForm`, `NotForm`, `NotField`, `NotArrayField`, or `NotMessage`, read `migrations/notform-v3` before anything else. The docs describe v4.
3. **Read the index.** Fetch `https://notform.favorodera.dev/llms.txt` to see which pages exist.
4. **Load only the pages the task needs** (table below). Fetch a page as Markdown with `https://notform.favorodera.dev/docs/<section>/<page>.md`. Fetch `https://notform.favorodera.dev/llms-full.txt` only when a task spans many sections or you cannot fetch several pages.
5. **Write code from those pages.** If a behavior or option is not documented, say so. Do not invent NotForm options, props, or methods.
6. **Say which pages you used,** so the user can check your work.

## Choose pages by task

| Task | Read (`<section>/<page>`) |
| --- | --- |
| New form, setup | `getting-started/installation`, `getting-started/quickstart` |
| Nuxt setup, aliases, auto-import problems | `getting-started/nuxt-module` |
| How the pieces fit together | `getting-started/core-concepts` |
| Binding native inputs (checkbox, radio, select, number, file) | `guides/binding-inputs` |
| Schema typing, input vs output, initial values | `guides/schema-input-output`, `guides/typescript`, `composables/use-form` |
| When errors appear, debounce, validation config | `guides/validation`, `components/field` |
| Rendering errors | `guides/errors`, `components/field-error` |
| Submit, reset, form flags | `guides/submission-and-reset`, `guides/form-state` |
| Repeatable or nested lists | `guides/array-fields`, `components/array-field` |
| Errors returned by an API | `recipes/server-errors` |
| Confirm password, dependent fields | `recipes/cross-field-validation` |
| Async checks such as availability | `recipes/async-validation` |
| Editing saved data, unsaved-changes guard | `recipes/editing-existing-data` |
| Multi-step wizard | `recipes/multi-step-forms` |
| Custom component or wrapper | `integrations/custom-components` |
| Nuxt UI, ShadcnVue, Vuetify | `integrations/nuxt-ui`, `integrations/shadcn-vue`, `integrations/vuetify` |
| Component or composable contracts | `components/form`, `components/field`, `components/array-field`, `components/field-error`, `composables/use-form` |
| Exact type names | `reference/types` |
| Something misbehaves | `reference/troubleshooting` |
| Migrating from NotForm v3 | `migrations/notform-v3`, then the page for each API it names |

For a task that touches several rows, read each row's pages. For example, "a registration form with a repeatable phone list and API errors" needs the quickstart, array fields, and server errors.

## Rules that are easy to break

The pages explain each of these. Check them before you finish.

- Create fields with `form.field(path)` and `form.arrayField(path)` and pass the instance to `Field` or `ArrayField`. `Form` provides no context, and `Field` has no `path` prop.
- Bind `field.model` and spread `field.events`, with `v-model` first.
- Schema **input** is what users edit (`form.values`). Schema **output** is what `onSubmit` receives.
- Give `initialValues` for every bound field.
- Array items: key by `item.id`, and change the array only through its methods.
- `field.model` writes and `form.setValue` do not validate.
- Field config is read once, on the first `form.field(path, config)` call for that path.
- Show field errors with `<FieldError :errors="field" />`, and form-level errors from `form.errors`.
- NotForm must be the only owner of a form's state. Do not combine it with another form library or with a component library's own form validation on the same form.
- Import only what `notform` exports. Do not use internal modules.

## When sources disagree

- If the installed package or its types differ from the published docs, trust the installed package's public exports and tell the user about the mismatch.
- If you cannot fetch the docs, say so and ask the user for the pages the task needs. Do not fall back to memory.
- Do not copy documentation prose into application code, and do not write new documentation unless the user asks for it.
