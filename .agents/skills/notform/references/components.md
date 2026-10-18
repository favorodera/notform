# NotForm components

Read the focused component page for exact props, slots, and examples.

| Component | Raw page | Use it for |
| --- | --- | --- |
| `NotForm` | https://notformdocs.vercel.app/raw/docs/components/not-form.md | Native `<form>`, context, submit/reset wiring |
| `NotField` | https://notformdocs.vercel.app/raw/docs/components/not-field.md | Typed paths, events, field state, validation timing |
| `NotArrayField` | https://notformdocs.vercel.app/raw/docs/components/not-array-field.md | Repeatable/nested fields, stable keys, mutations |
| `NotMessage` | https://notformdocs.vercel.app/raw/docs/components/not-message.md | First exact-path error rendering |

## `NotForm`

- Renders a real native `<form>`.
- Provides the form instance through context.
- Prevents native reset behavior.
- Does **not** call `form.submit()` or `form.reset()` automatically.
- Bind `@submit="form.submit"` and `@reset="form.reset()"` explicitly.
- Submit prevention happens inside `form.submit(event)`.
- An explicit `form` prop is required and identifies the provided form instance.

## `NotField`

Props:

| Prop | Default | Notes |
| --- | --- | --- |
| `path` | required | Typed schema input path |
| `form` | injected | Explicit form overrides context |
| `validateOn` | `{ onBlur: true, onChange: true }` | Supports `onBlur`, `onChange`, `onInput`, `onMount` |
| `validationMode` | `eager` | `lazy` suppresses continuous invalid-field revalidation while editing |
| `debounce` | — | Delays input/change validation; blur runs immediately |

The default slot exposes `path`, `events`, `errors`, `isDirty`, `isTouched`, `isValid`, and `isValidating`.

Bind `v-bind="events"` to native inputs. For custom components, bind the handlers individually; the handlers do not require a DOM event object.

## `NotArrayField`

The default slot exposes `path`, `items`, `errors`, `isValid`, `isTouched`, `isDirty`, `isValidating`, plus `append`, `prepend`, `insert`, `remove`, `update`, `swap`, and `move`.

Use `:key="item.key"`. `item.path` follows the item's current index. Array aggregate state recurses through nested descendants, while `errors` stays exact to the array path.

`itemSchema` only improves mutation value inference; the main form schema remains the runtime validator.

## `NotMessage`

- `path` is required and exact.
- `form` can override injected context.
- `as` defaults to `'span'`.
- Renders the first active error only.
- Renders nothing when there is no active message.
- When `as` is a component, the message is passed through its default slot.
- The default slot exposes `{ message?: string }`.
- Non-prop attributes are forwarded to the rendered root.
