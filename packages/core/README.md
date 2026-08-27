<div align="center">
<h1>notform</h1>
<p><strong>Headless, Schema-Agnostic Form Management for Vue 3</strong></p>
<p>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/v/notform.svg?style=plastic&label=NPM%20Version&color=blue" alt="NPM Version"></a>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/dt/notform.svg?style=plastic&label=NPM%20Downloads&color=blue" alt="NPM Downloads"></a>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/unpacked-size/notform?style=plastic&label=NPM%20Unpacked%20Size&color=blue" alt="NPM Unpacked Size"></a>
</p>
</div>

<br>

`notform` is the core package of the NotForm ecosystem. It provides headless form validation and state management for Vue 3 applications. Built with TypeScript from the ground up, it offers a composable API that integrates perfectly with Vue 3's Composition API and works with any Standard Schema-compatible validator.

## Installation

```bash
pnpm add notform
```

## How It Works

NotForm follows a **headless, composable-first** approach. Forms are managed through the `useNotForm` composable which handles validation, state, and submission logic in a type-safe manner.

Each form consists of:

- **A schema** — Defined using any validation library that supports [Standard Schema](https://standardschema.dev) (Zod, Valibot, ArkType, etc.)
- **Form state** — Managed reactively with full TypeScript support
- **Validation** — Automatic validation based on your schema with error messages
- **Submission handling** — Built-in submission lifecycle with loading states
- **Your UI** — NotForm renders nothing—you bring your own components

## Basic Usage

Import the components and composable you need:

```vue
<script setup lang="ts">
import { NotField, NotForm, NotMessage, useNotForm } from 'notform'
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
    @submit.prevent="form.submit"
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

## Array Fields

NotForm includes built-in support for dynamic array fields with add, remove, and reorder operations:

```vue
<script setup lang="ts">
import { NotArrayField, NotField, NotForm, NotMessage, useNotForm } from 'notform'
import { z } from 'zod'

const tagSchema = z.string().min(1, 'Tag cannot be empty')

const schema = z.object({
  tags: z.array(tagSchema).min(1, 'At least one tag is required'),
})

const form = useNotForm({
  schema,
})
</script>

<template>
  <NotForm
    :form
    @submit.prevent="form.submit"
  >
    <NotArrayField
      v-slot="{ items, append, remove }"
      path="tags"
      :item-schema="tagSchema"
    >
      <div
        v-for="(item, index) in items"
        :key="item.key"
      >
        <NotField
          v-slot="{ events }"
          :path="item.path"
        >
          <input
            v-bind="events"
            :id="item.path"
            v-model="form.values.tags[index]"
            type="text"
          >
        </NotField>

        <button
          type="button"
          @click="remove(index)"
        >
          Remove
        </button>
      </div>

      <button
        type="button"
        @click="append('')"
      >
        Add Tag
      </button>

      <NotMessage path="tags" />
    </NotArrayField>
  </NotForm>
</template>
```

## Validation Libraries

NotForm works with any validation library that implements the Standard Schema interface:

- **Zod** — TypeScript-first schema validation
- **Valibot** — Modular and type-safe schema validation
- **ArkType** — High-performance runtime type checking
- And any other Standard Schema-compatible library

## Components and Composables

### Composables

- `useNotForm` — Main composable for creating form instances

### Components

- `NotForm` — Form wrapper component that provides form context
- `NotField` — Field component for individual form inputs
- `NotMessage` — Error message display component
- `NotArrayField` — Array field component for dynamic form arrays

## Features

- **Headless** — Renders nothing. You bring the UI, NotForm brings the logic.
- **Schema-agnostic** — Works with any Standard Schema validator (Zod, Valibot, ArkType, etc.)
- **Type-safe** — Full TypeScript support with inferred types from your schema
- **Composable** — Built for Vue 3 Composition API with a clean, intuitive API
- **Lightweight** — Tiny footprint with tree-shaking support
- **Array fields** — Built-in support for dynamic array fields with add/remove operations
- **Flexible** — Use with any UI library—native HTML, Nuxt UI, Shadcn, or your own components

## Documentation

For detailed guides, API reference, and examples, visit:
**[notformdocs.vercel.app](https://notformdocs.vercel.app/)**

## License

[MIT](../../LICENSE) &copy; [Favour Emeka](https://github.com/favorodera)
