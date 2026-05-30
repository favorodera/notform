<div align="center">
<h1>notform-nuxt</h1>
<p><strong>NotForm, seamlessly integrated with Nuxt.</strong></p>
<p>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/notform-nuxt.svg?style=plastic&label=NPM%20Version&color=blue" alt="NPM Version"></a>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dw/notform-nuxt.svg?style=plastic&label=NPM%20Downloads&color=blue" alt="NPM Downloads"></a>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/unpacked-size/notform-nuxt?style=plastic&label=NPM%20Unpacked%20Size&color=blue" alt="NPM Unpacked Size"></a>
</p>
</div>

<br>

`notform-nuxt` is the official Nuxt module for [NotForm](../core). It provides auto-imports for NotForm composables and components, making form development in Nuxt applications seamless and type-safe.

## Installation

```bash
pnpm add notform
pnpm add -D notform-nuxt
```

## Setup

Add `notform-nuxt` to the `modules` section of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    'notform-nuxt'
  ]
})
```

That's it — all NotForm composables and components are now auto-imported in your Nuxt application.

## What the Module Does

1. **Auto-imports composables** — `useNotForm`, `NotForm`, `NotField`, `NotMessage`, `NotArrayField` are available everywhere without manual imports.
2. **Auto-imports components** — All NotForm components are globally available in your templates.
3. **Type-safe** — Full TypeScript support with auto-completion for all NotForm APIs.
4. **Nuxt-optimized** — Pre-bundles dependencies for faster dev startup and better HMR.

## Usage

After installing the module, you can use NotForm directly in your components:

```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

const form = useNotForm({
  schema,
  onSubmit: (values) => {
    console.log('Form submitted:', values)
  },
})
</script>

<template>
  <NotForm :form="form" @submit="form.submit">
    <NotField path="name">
      <input v-model="form.values.name" type="text" />
      <NotMessage path="name" />
    </NotField>
    <NotField path="email">
      <input v-model="form.values.email" type="email" />
      <NotMessage path="email" />
    </NotField>
    <button type="submit">Submit</button>
  </NotForm>
</template>
```

No imports needed — everything is auto-imported by the module.

## Prerequisites

- [Nuxt](https://nuxt.com/) v4 or later
- [NotForm](../core) core package

## Documentation

For detailed guides, API reference, and examples, visit:
**[notformdocs.vercel.app](https://notformdocs.vercel.app/getting-started/nuxt-module)**

## License

[MIT](../../LICENSE) &copy; [Favour Emeka](https://github.com/favorodera)

