# NotForm components

Covers the four public components: `NotForm`, `NotField`, `NotArrayField`, and `NotMessage`. The raw component pages hold the full props, slots, examples, and edge cases. Load the page for the component in use instead of working from memory.

## Which page to fetch

| Task | Fetch |
| --- | --- |
| Wrap a form, connect submit/reset, provide the form to descendants | [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) |
| Connect a native or custom input: paths, slot props, events, validation triggers and modes, mount validation, debounce | [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md) |
| Render repeatable or nested rows: item keys, nested arrays, aggregated state, mutation methods | [NotArrayField](https://notformdocs.vercel.app/raw/docs/components/not-array-field.md) |
| Show one validation message anywhere: `as`, forwarded attributes, custom message slot | [NotMessage](https://notformdocs.vercel.app/raw/docs/components/not-message.md) |
| See all four composed into a complete form | [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md) |

If the component is unclear, start with the [LLM index](https://notformdocs.vercel.app/llms.txt).

## Pitfalls

These come straight from the component pages. Check the page before relying on one for anything subtle.

**Form wiring**

- `NotMessage` is a general validation-message component, not a field component. It works anywhere, given a `path`.
- Keep the form instance and component paths aligned with the schema. A mismatched path silently shows nothing.
- Outside a `<NotForm>`, every field component needs an explicit `form` prop. An explicit `form` always beats the injected one.
- `NotForm` only stops the browser's own submit and reset. It does not clear errors or restore values. `@reset="form.reset()"` does that.
- Native validation attributes (`required`, `pattern`, `minlength`) still trigger the browser's UI alongside NotForm's. Add `novalidate` to show only NotForm's messages.

**NotField**

- Spread `v-bind="events"` on native inputs. For custom components, bind handlers individually, for example `@focusout="events.onBlur"` and `@pick="events.onChange"`. The handlers don't need the DOM event.
- Defaults are validation on blur and change. `validateOn` merges over those defaults, so only the triggers you list are overridden.
- `onMount` is a valid `validateOn` trigger but has no entry in `events`, because there's no DOM event for it. It runs once when the field is created.
- `validateOn` decides *which* interactions may trigger validation. `validationMode` decides *how often* they fire once the field has an issue. `eager` (default) revalidates on change and input after the first issue. `lazy` only validates on blur and submit, even if `validateOn` allows more.
- `debounce` delays only input- and change-triggered validation. Blur and submit validation always run immediately.

**NotMessage**

- It shows only the first active error and renders nothing, not even an empty wrapper, when there is none. For every issue, use the `errors` slot prop of `NotField`.
- When `as` is a component, the message is passed as default slot content, not as a prop. That component must render its own `<slot />`. To reshape the message first, use the `NotMessage` default slot.

**NotArrayField**

- Use `:key="item.key"`, never the index.
- Change the array only through the slot's mutation methods (`append`, `prepend`, `insert`, `remove`, `swap`, `move`, `update`). Direct `.push()` or `.splice()` on `form.values` leaves keys and per-item state out of sync.
- `errors` holds only issues on the array's own path, such as an array-level `.min()`. Issues on individual items don't appear there.
- `isValid`, `isTouched`, `isDirty`, and `isValidating` recurse to any depth. An issue on an item or a nested array makes the outer `isValid` false.
- `itemSchema` is for type inference only. It doesn't validate anything.

## Related

- Form state and methods (`values`, `errors`, `validate`, `submit`, `reset`): [composables.md](composables.md)
- Nuxt auto-imports and SSR: [nuxt.md](nuxt.md)
- Something misbehaving: [debugging.md](debugging.md)
