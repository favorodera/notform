<div align="center">
<h1>notform-nuxt</h1>
<p><strong>NotForm, seamlessly integrated with Nuxt.</strong></p>
<p>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/notform-nuxt.svg?style=plastic&label=NPM%20Version&color=blue" alt="NPM Version"></a>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dt/notform-nuxt.svg?style=plastic&label=NPM%20Downloads&color=blue" alt="NPM Downloads"></a>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/unpacked-size/notform-nuxt?style=plastic&label=NPM%20Unpacked%20Size&color=blue" alt="NPM Unpacked Size"></a>
</p>
</div>

<br>

`notform-nuxt` is the official Nuxt module for [NotForm](../core). It provides auto-imports for NotForm composables and components, making form development in Nuxt applications seamless and type-safe.

## Installation

```bash
pnpm add notform-nuxt
```

## Setup

Add `notform-nuxt` to the `modules` section of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['notform-nuxt'],
})
```

That's it — all NotForm composables and components are now auto-imported in your Nuxt application.

## What the Module Does

1. **Auto-imports composables** — `useNotForm`, `NotForm`, `NotField`, `NotMessage`, `NotArrayField` are available everywhere without manual imports.
2. **Auto-imports components** — All NotForm components are globally available in your templates.
3. **Type-safe** — Full TypeScript support with auto-completion for all NotForm APIs.

## Usage

After installing the module, you can use NotForm directly in your components:

```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
})

const form = useNotForm({
  onSubmit(values) {
    console.log('Form:', values)
  },
  schema,
})
</script>

<template>
  <NotForm
    :form
    @submit="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{events,path}"
      path="name"
    >
      <label :for="path">
        Name
        <input
          v-bind="events"
          :id="path"
          v-model="form.values.name"
          type="text"
        >
      </label>

      <NotMessage :path="path" />
    </NotField>

    <NotField
      v-slot="{events,path}"
      path="email"
    >
      <label :for="path">
        Email
        <input
          v-bind="events"
          :id="path"
          v-model="form.values.email"
          type="email"
        >
      </label>

      <NotMessage :path="path" />
    </NotField>

    <button type="submit">
      Submit
    </button>

    <button type="reset">
      Reset Form
    </button>
  </NotForm>
</template>
```

No imports needed — everything is auto-imported by the module.

## Prerequisites

- [Nuxt](https://nuxt.com/) v4 or later

## Documentation

For detailed guides, API reference, and examples, visit:
**[notformdocs.vercel.app](https://notformdocs.vercel.app/getting-started/nuxt-module)**

## License

[MIT](../../LICENSE) &copy; [Favour Emeka](https://github.com/favorodera)

