---
name: components
description: "Use when building a NotForm Vue interface with NotForm, NotField, NotArrayField, or NotMessage, including renderless slots, custom inputs, field validation triggers, dynamic arrays, stable keys, and validation messages."
---

# NotForm components

Use this skill as the routing layer for NotForm's four public components. The published raw component pages contain the complete props, slots, examples, and edge cases; load the page for the component being used instead of duplicating those details here.

## Resource workflow

1. Start with the [NotForm LLM index](https://notformdocs.vercel.app/llms.txt) when the component is unknown.
2. Fetch [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) for the native form wrapper, submit/reset wiring, context provider, and form-level behavior.
3. Fetch [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md) for paths, slot props, input events, validation triggers, validation modes, mount validation, and debounce.
4. Fetch [NotArrayField](https://notformdocs.vercel.app/raw/docs/components/not-array-field.md) for dynamic rows, item metadata, stable keys, nested arrays, state aggregation, and mutation methods.
5. Fetch [NotMessage](https://notformdocs.vercel.app/raw/docs/components/not-message.md) for exact-path messages, `as`, forwarded attributes, and custom message slots.
6. Fetch the [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md) when the user needs a complete composition of the components.

## Component routing

| User task | Resource |
| --- | --- |
| Wrap a form and connect submit/reset | [NotForm raw reference](https://notformdocs.vercel.app/raw/docs/components/not-form.md) |
| Connect a native or custom input | [NotField raw reference](https://notformdocs.vercel.app/raw/docs/components/not-field.md) |
| Render repeatable or nested rows | [NotArrayField raw reference](https://notformdocs.vercel.app/raw/docs/components/not-array-field.md) |
| Display one validation message anywhere | [NotMessage raw reference](https://notformdocs.vercel.app/raw/docs/components/not-message.md) |

## Guardrails

- `NotMessage` is a general validation-message component, not a field component.
- Keep the form instance and component paths aligned with the schema.
- When a component is outside `NotForm`, consult the component reference for explicit `form` usage.
- For arrays, follow the raw reference's stable-key and mutation-method rules rather than inventing array handling.
- For form state and methods, use the `composables` skill and the [useNotForm raw reference](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md).

## Canonical resources

- [LLM index](https://notformdocs.vercel.app/llms.txt)
- [Full LLM bundle](https://notformdocs.vercel.app/llms-full.txt)
- [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md)
- [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md)
- [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md)
- [NotArrayField](https://notformdocs.vercel.app/raw/docs/components/not-array-field.md)
- [NotMessage](https://notformdocs.vercel.app/raw/docs/components/not-message.md)
