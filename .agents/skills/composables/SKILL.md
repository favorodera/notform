---
name: composables
description: "Use when building a Vue form with NotForm's useNotForm composable, choosing a schema, initializing form state, validating values, handling server errors, submitting, resetting, or reading form state."
---

# NotForm composables

Use this skill as the routing layer for `useNotForm`. The published NotForm documentation is the source of truth; do not recreate its API reference from memory.

## Resource workflow

1. Start with the [NotForm LLM index](https://notformdocs.vercel.app/llms.txt).
2. For a complete first form, fetch the [Quickstart raw Markdown](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md).
3. For signatures, options, return values, validation, errors, submission, or reset, fetch the [useNotForm raw Markdown reference](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md).
4. For installation or validator choice, fetch [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md).
5. For a form using the renderless wrapper, also fetch [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) and use the `components` skill.

## Focus keywords

When searching the raw composable reference, look for:

- `UseNotFormConfig`, `schema`, `initialValues`, `initialErrors`, and `onSubmit`
- `values`, `errors`, `setValue`, `getFieldErrors`, and `setError`
- `validate`, `validateField`, `submit`, and `reset`
- `isDirty`, `isTouched`, `isValid`, `isValidating`, and `isSubmitting`
- typed dot paths, schema input/output, Standard Schema, async validation, and last-write-wins

## Guidance for answers

- Prefer a documented example over an invented API.
- Keep the validator separate from NotForm; NotForm supports Standard Schema-compatible validators.
- Distinguish programmatic `setValue` from validation; consult the raw reference for exact behavior.
- Link the relevant raw page in the answer when the user needs continued reference.
- For component wiring, defer to [NotForm](https://notformdocs.vercel.app/raw/docs/components/not-form.md) and [NotField](https://notformdocs.vercel.app/raw/docs/components/not-field.md), not this skill alone.

## Canonical resources

- [LLM index](https://notformdocs.vercel.app/llms.txt)
- [Full LLM bundle](https://notformdocs.vercel.app/llms-full.txt)
- [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md)
- [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md)
- [useNotForm](https://notformdocs.vercel.app/raw/docs/composables/use-not-form.md)
- [Standard Schema](https://standardschema.dev/)
