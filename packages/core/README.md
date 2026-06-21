<div align="center">
<h1>notform</h1>
<p><strong>Vue Forms Without the Friction</strong></p>
<p>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/v/notform.svg?style=plastic&label=NPM%20Version&color=blue" alt="NPM Version"></a>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/dw/notform.svg?style=plastic&label=NPM%20Downloads&color=blue" alt="NPM Downloads"></a>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/unpacked-size/notform?style=plastic&label=NPM%20Unpacked%20Size&color=blue" alt="NPM Unpacked Size"></a>
</p>
</div>

<br>

`notform` is the core package of the NotForm ecosystem. It provides type-safe form validation and state management for Vue 3 applications with minimal boilerplate. Built with TypeScript from the ground up, it offers a composable API that integrates perfectly with Vue 3's Composition API.

## Installation

```bash
pnpm add notform
```

## How It Works

NotForm follows a **composable-first** approach. Forms are managed through the `useNotForm` composable which handles validation, state, and submission logic in a type-safe manner.

Each form consists of:

- **A schema** — Defined using any validation library that supports [Standard Schema](https://standard-schema.dev/) (Zod, Yup, etc.)
- **Form state** — Managed reactively with full TypeScript support
- **Validation** — Automatic validation based on your schema with error messages
- **Submission handling** — Built-in submission lifecycle with loading states

### Basic Usage

```vue
<script setup lang="ts">
import { NotField, NotForm, NotMessage, useNotForm } from 'notform'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
})

const form = useNotForm({
  onSubmit: (values) => {
    console.log('Form submitted:', values)
  },
  schema,
})
</script>

<template>
  <NotForm
    :form="form"
    @submit="form.submit"
  >
    <NotField path="name">
      <input
        v-model="form.values.name"
        type="text"
      >

      <NotMessage path="name" />
    </NotField>

    <NotField path="email">
      <input
        v-model="form.values.email"
        type="email"
      >

      <NotMessage path="email" />
    </NotField>

    <button type="submit">
      Submit
    </button>
  </NotForm>
</template>
```

### Validation Libraries

NotForm works with any validation library that implements the Standard Schema interface:

- **Zod** — TypeScript-first schema validation
- **Yup** — JavaScript schema builder
- **Valibot** — Modular and type-safe schema validation
- And any other Standard Schema-compatible library

## Features

- **Type-safe** — Full TypeScript support with inferred types from your schema
- **Composable** — Use with Vue 3 Composition API for flexible form management
- **Lightweight** — Tiny footprint with tree-shaking support
- **Flexible** — Works with any Standard Schema-compatible validation library
- **Array fields** — Built-in support for dynamic array fields with add/remove operations
- **Minimal boilerplate** — Get started quickly with simple, intuitive APIs

## Documentation

For detailed guides, API reference, and examples, visit:
**[notformdocs.vercel.app](https://notformdocs.vercel.app/)**

## License

[MIT](../../LICENSE) &copy; [Favour Emeka](https://github.com/favorodera)

