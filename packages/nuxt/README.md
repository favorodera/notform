<div align="center">
<h1><code>notform-nuxt</code></h1>
<p><strong>NotForm integration for Nuxt</strong></p>
<p>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/notform-nuxt.svg?style=plastic&label=Version" alt="Version"></a>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dm/notform-nuxt.svg?style=plastic&label=Downloads&color=blue" alt="Downloads"></a>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/unpacked-size/notform-nuxt?style=plastic&label=Unpacked%20Size" alt="Unpacked Size"></a>
</p>
</div>

`notform-nuxt` is the official Nuxt module for [NotForm](../core).

It integrates the NotForm core package with Nuxt's auto-import system so the composable and components are available directly in your Nuxt application.

## Installation

The module is available through the Nuxt Modules Registry:

```bash
npx nuxi module add notform
```

Or install it directly:

```bash
pnpm add notform-nuxt
```

## Setup

Add the module to `nuxt.config.ts` when installing manually:

```ts
export default defineNuxtConfig({
  modules: ['notform-nuxt'],
})
```

That's it. The NotForm composable and components are auto-imported in your Nuxt application.

## Usage

You can use NotForm without importing the composable or components in your Vue files:

```vue
<script setup lang="ts">
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
  schema,
})
</script>

<template>
  <NotForm
    :form="form"
    @submit.prevent="form.submit"
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
  </NotForm>
</template>
```

## What It Adds

The module provides Nuxt integration for the APIs exported by `notform`:

- `useNotForm`
- `NotForm`
- `NotField`
- `NotMessage`
- `NotArrayField`

The form behavior itself is provided by the core `notform` package.

## Requirements

- Nuxt 4 or later
- Node.js 24 or later for development in this repository
- A Standard Schema-compatible validator

## Development

From the repository root:

```bash
pnpm install
pnpm --filter notform-nuxt typecheck
pnpm --filter notform-nuxt build
```

## License

[MIT](../../LICENSE) © [Favour Emeka](https://github.com/favorodera)
