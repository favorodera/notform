---
name: debugging
description: "Use when a NotForm form is not validating, values are not updating, messages are missing, submit or reset behaves unexpectedly, async validation is confusing, array state is wrong, or a NotForm Nuxt integration needs troubleshooting."
---

# Debugging NotForm

Use this skill to route a problem to the authoritative NotForm documentation and produce a minimal reproduction. Do not rebuild the product documentation inside this skill.

## Resource workflow

1. Classify the symptom: composable state, component wiring, arrays, Nuxt setup, or validator behavior.
2. Start with the [NotForm LLM index](https://notformdocs.vercel.app/llms.txt) if the symptom spans multiple areas.
3. Fetch the focused raw page:
   - [useNotForm](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md) for values, errors, validation, submit, reset, and async state.
   - [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) for native submit/reset and context.
   - [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md) for paths, events, triggers, modes, and debounce.
   - [NotArrayField](https://notformdocs.vercel.app/raw/docs/components/not-array-field.md) for keys, paths, nested state, and mutations.
   - [NotMessage](https://notformdocs.vercel.app/raw/docs/components/not-message.md) for exact-path message rendering.
   - [Nuxt module](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt-module.md) for auto-imports and SSR.
4. Compare the user's code with the smallest documented example.
5. Inspect the schema path, form instance, bound events, current values, and current errors before suggesting a change.
6. Use the [NotForm playground](https://notformdocs.vercel.app/playground) for a shareable browser reproduction.

## Symptom routing

| Symptom | First resource |
| --- | --- |
| `setValue`, `validate`, `submit`, `reset`, or server error behavior | [useNotForm](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md) |
| Browser reload, reset, or missing injected form | [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) |
| Missing field errors or wrong validation timing | [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md) |
| Message does not render or needs custom markup | [NotMessage](https://notformdocs.vercel.app/raw/docs/components/not-message.md) |
| Array rows lose identity or nested errors look wrong | [NotArrayField](https://notformdocs.vercel.app/raw/docs/components/not-array-field.md) |
| Nuxt imports or hydration setup | [Nuxt module](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt-module.md) |

## Guardrails

- Do not assume `setValue` validates unless the composable reference says so.
- Match field and message paths exactly to the schema paths.
- For arrays, do not replace documented stable-key or mutation behavior with index keys or direct structural mutation.
- Do not treat a playground reproduction as a replacement for the published documentation.
- Ask for the schema, relevant template, package versions, and exact symptom when information is missing.
- Never ask users to include secrets or production data in a reproduction.

## Canonical resources

- [LLM index](https://notformdocs.vercel.app/llms.txt)
- [Full LLM bundle](https://notformdocs.vercel.app/llms-full.txt)
- [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md)
- [Playground](https://notformdocs.vercel.app/playground)
