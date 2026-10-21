# NotForm components

Read the focused component reference for exact props, slots, and examples.

| Component | Raw page | Use it for |
| --- | --- | --- |
| `Form` | https://notformdocs.vercel.app/raw/docs/components/form.md | Native form, injected context, automatic submit/reset lifecycle |
| `Field` | https://notformdocs.vercel.app/raw/docs/components/field.md | Typed paths, input event handlers, field state, validation timing |
| `ArrayField` | https://notformdocs.vercel.app/raw/docs/components/array-field.md | Repeatable/nested fields, stable keys, state-aware mutations |
| `Error` | https://notformdocs.vercel.app/raw/docs/components/error.md | First error message at an exact path |

## `Form`

- Requires a `form` prop, normally the return value from `useForm()`.
- Renders a native `<form>` and provides that form instance to descendants.
- Handles native `submit` by calling `form.submit(event)`; submit default behavior is prevented inside the form instance.
- Handles native `reset` by preventing the browser reset and calling `form.reset()`.
- Do not tell users that submit/reset bindings are required for normal `<Form>` usage. The component wires both lifecycle events internally.
- Descendant `<Field>`, `<ArrayField>`, and `<Error>` components use the nearest form context by default. An explicit `form` prop takes priority over injected context.
- Native form attributes such as `method`, `action`, and `novalidate` remain available.

## `Field`

Props:

| Prop | Default | Notes |
| --- | --- | --- |
| `path` | required | Typed schema-input path; nested and dynamic array-item paths are supported |
| `form` | nearest injected form | Explicit instance overrides context |
| `validateOn` | `{ onBlur: true, onChange: true }` | Configures `onBlur`, `onChange`, `onInput`, and `onMount`; merged over defaults |
| `validationMode` | `'eager'` | `'lazy'` suppresses input/change validation, even if those triggers are enabled |
| `debounce` | none | Delays enabled input/change validation; blur is immediate and cancels pending debounce |

The default slot exposes `path`, `events`, `errors`, `isDirty`, `isTouched`, `isValid`, and `isValidating`.

Bind `v-bind="events"` to the input where possible. The exposed `onBlur`, `onChange`, and `onInput` callbacks do not require a DOM event argument. `onMount` is not an exposed DOM handler; when enabled, it runs after the component mounts.

Programmatic updates through `form.setValue()` change values and dirty state but do not automatically validate.

## `ArrayField`

The optional `form` prop overrides injected form context. The required `path` points to an array in the form values. `itemSchema` exists for inserted/updated-value type inference only; the main form schema is the runtime validator.

The default slot exposes `path`, `items`, `errors`, `isValid`, `isTouched`, `isDirty`, `isValidating`, and `append`, `prepend`, `insert`, `remove`, `update`, `swap`, and `move`.

- Use `:key="item.key"` for Vue rendering; do not use the array index as the key.
- `item.index` is the current position and `item.path` follows that position (for example, `users.0`).
- Structural mutations remap item keys and relevant touched/error paths so state stays aligned with moved items. `update()` replaces the value while preserving its key and position.
- Insert indices are clamped; non-integer insertion indices are ignored. Invalid source/item indices for other mutations are ignored; move destinations are clamped to the current bounds.
- Array aggregate flags inspect descendant state, but the `errors` slot prop contains only issues attached exactly to the array path. An error at `users.2.email` can make `users.isValid` false while `users.errors` is empty.
- Use the exposed methods rather than direct `push`, `splice`, or index assignment when preserving render identity and nested touched/error state matters.

## `Error`

- `path` is required and exact; `form` can override injected form context.
- `as` defaults to `'span'` and accepts an element tag or Vue component.
- Renders the first active error at that exact path and renders nothing when no message exists.
- When `as` is a component, the message is passed through its default slot. The default slot exposes `{ message?: string }` for custom rendering.
- Non-prop attributes such as `class`, `id`, and `data-*` are forwarded to the rendered element.
