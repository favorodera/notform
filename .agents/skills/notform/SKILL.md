---
name: notform
description: "Use when building, configuring, or debugging forms with NotForm, the headless Standard Schema form library for Vue 3 and Nuxt (`notform`, `notform-nuxt`). Covers useNotForm, NotForm, NotField, NotArrayField, NotMessage, validation, submit/reset, dynamic arrays, and Nuxt setup. Use whenever the user mentions NotForm or imports from 'notform'."
---

# NotForm

NotForm is a headless form library for Vue 3 and Nuxt. It owns form *state* (values, errors, touched and dirty flags, validation triggers) and leaves markup and styling to the application. Validation goes through [Standard Schema](https://standardschema.dev), so any compatible validator works (Zod, Valibot, ArkType, and others) and the NotForm API stays the same whichever one the project uses.

The published documentation is the source of truth for the API. This skill's job is to get you to the right page quickly. Props, slot props, and option names are easy to get subtly wrong from memory, so fetch the page instead of reconstructing it.

## Pick a reference

Read the file that matches the task. Most real tasks need two: a typical form uses `composables.md` for the form instance and `components.md` for the markup.

| Task | Read |
| --- | --- |
| Create a form, choose or write a schema, set initial values, validate, submit, reset, handle server errors, read form state | [references/composables.md](references/composables.md) |
| Wire inputs and markup: `NotForm`, `NotField`, `NotArrayField`, `NotMessage`, slots, custom inputs, dynamic arrays | [references/components.md](references/components.md) |
| Add NotForm to a Nuxt app, auto-imports, SSR | [references/nuxt.md](references/nuxt.md) |
| Something is not validating, updating, rendering, submitting, or resetting as expected | [references/debugging.md](references/debugging.md) |

For Nuxt projects, read `nuxt.md` first for setup, then the others for API usage.

## Workflow

1. Read the matching reference file(s) above.
2. Fetch the raw documentation pages those files link to. If the right page is unclear, start with the [LLM index](https://notformdocs.vercel.app/llms.txt). For tasks that span installation, composables, components, and Nuxt, or when links can't be followed, use the [full bundle](https://notformdocs.vercel.app/llms-full.txt).
3. Implement with documented APIs and the closest documented example. Don't invent options.
4. Name the doc page you relied on, and say so when something is an assumption rather than documented behavior.
5. Verify in the user's application (typecheck, tests, running the form). This skill doesn't replace that.

If you can't fetch URLs in this environment, ask the user to paste the relevant raw page, and flag that your answer hasn't been checked against the current docs.

## Core ideas

- `useNotForm({ schema, initialValues, initialErrors, onSubmit })` creates the form instance. `<NotForm :form="form">` provides it to descendant fields. Any field component can instead take an explicit `form` prop, which wins over the injected one and is required outside a `<NotForm>`.
- `NotField` and `NotArrayField` are renderless and expose state through their default slot. `NotForm` renders a native `<form>`. `NotMessage` renders a `<span>` by default and nothing at all when there is no error.
- Field paths are dot paths typed from the schema (`email`, `user.email`). A path given to `NotField` or `NotMessage` must match the schema path exactly.
- `NotForm` stops the browser's default submit and reset, but doesn't call anything for you. Bind `@submit="form.submit"` and `@reset="form.reset()"` yourself.
- For arrays, key rows by `item.key` (never the index) and change the array only through the slot's mutation methods.
- `setValue` does not run validation.
- The Nuxt module changes how NotForm is imported, not how it behaves, and it doesn't install a validator.

## Shape of a form

This is the Quickstart's login form, trimmed. Use it for orientation, then follow the Quickstart and the component references for the full walkthrough. In Nuxt, the `notform` import line goes away because of auto-imports.

```vue
<script setup lang="ts">
import { NotField, NotForm, NotMessage, useNotForm } from 'notform'
import { z } from 'zod'

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string('Invalid input').min(8, 'At least 8 characters'),
})

const form = useNotForm({
  async onSubmit(data) {
    console.log('Form submitted:', data)
  },
  schema,
})
</script>

<template>
  <NotForm
    :form="form"
    @submit="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{ events, path }"
      path="email"
    >
      <label :for="path">Email</label>

      <input
        :id="path"
        v-model="form.values.email"
        v-bind="events"
        type="email"
      >

      <NotMessage :path="path" />
    </NotField>

    <button
      type="submit"
      :disabled="form.isSubmitting"
    >
      Submit
    </button>
  </NotForm>
</template>
```

## Canonical resources

- [Documentation](https://notformdocs.vercel.app/)
- [LLM index](https://notformdocs.vercel.app/llms.txt)
- [Full LLM bundle](https://notformdocs.vercel.app/llms-full.txt)
- [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md)
- [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md)
- [Playground](https://notformdocs.vercel.app/playground)
- [Standard Schema](https://standardschema.dev/)
