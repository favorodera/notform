<div align="center">
<img src="https://notformdocs.vercel.app/favicon.svg" alt="NotForm Logo" width="80" height="80">

<h1>NotForm</h1>

<p><strong>Headless, schema-agnostic form management for Vue 3</strong></p>

<p>
<a href="https://github.com/favorodera/notform/blob/main/LICENSE"><img src="https://img.shields.io/github/license/favorodera/notform.svg?style=plastic&label=License" alt="License"></a>
<a href="https://github.com/favorodera/notform/stargazers"><img src="https://img.shields.io/github/stars/favorodera/notform.svg?style=plastic&label=Stars" alt="GitHub Stars"></a>
<a href="https://notformdocs.vercel.app/"><img src="https://img.shields.io/badge/-Documentation-blue?style=plastic" alt="NotForm Documentation"></a>
</p>
</div>

NotForm provides the form state, validation, field state, submission lifecycle, and dynamic array-field primitives for Vue 3 while you decide how the form looks and behaves. There are no opinionated inputs, styles, or UI components built into the core.

Validation is schema-driven supporting any [Standard Schema](https://standardschema.dev/) compatible validator, state is reactive, and the API is designed for typed field paths and Vue's Composition API.

## Packages

| Package | Description |
| --- | --- |
| [`notform`](./packages/core) | Core Vue 3 form management and headless components |
| [`notform-nuxt`](./packages/nuxt) | Official Nuxt integration with auto-imports |

## Install

### Vue 3

```bash
pnpm add notform
```

### Nuxt

```bash
npx nuxi module add notform
```

Then install a Standard Schema-compatible validator, for example:

```bash
pnpm add zod
```

## Quick Start

```vue
<script setup lang="ts">
import { NotField, NotForm, NotMessage, useNotForm } from 'notform'
import { z } from 'zod'

const schema = z.object({
  email: z.email('Enter a valid email address'),
  name: z.string('Enter a valid name'),
})

const form = useNotForm({
  initialValues: {
    email: '',
    name: '',
  },
  onSubmit(values) {
    console.log(values)
  },
  schema,
})
</script>

<template>
  <NotForm
    :form="form"
    @submit.prevent="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{ events, path }"
      path="name"
    >
      <div>
        <label :for="path">Name</label>

        <input
          :id="path"
          v-model="form.values.name"
          v-bind="events"
          name="name"
          type="text"
          autocomplete="name"
        >

        <NotMessage :path="path" />
      </div>
    </NotField>

    <NotField
      v-slot="{ events, path }"
      path="email"
    >
      <div>
        <label :for="path">Email address</label>

        <input
          :id="path"
          v-model="form.values.email"
          v-bind="events"
          name="email"
          type="email"
          autocomplete="email"
        >

        <NotMessage :path="path" />
      </div>
    </NotField>

    <button type="submit">
      Submit
    </button>

    <button type="reset">
      Reset
    </button>
  </NotForm>
</template>
```

## Development

This repository is a pnpm workspace managed with Turborepo.

```bash
pnpm install
pnpm dev
```

Common checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm ready
```

## License

[MIT](./LICENSE) © [Favour Emeka](https://github.com/favorodera)
