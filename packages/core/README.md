<div align="center">
<h1><code>notform</code></h1>
<p><strong>Headless form management for Vue 3</strong></p>
<p>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/v/notform.svg?style=plastic&label=Version" alt="Version"></a>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/dm/notform.svg?style=plastic&label=Downloads&color=blue" alt="Downloads"></a>
<a href="https://npmx.dev/package/notform"><img src="https://img.shields.io/npm/unpacked-size/notform?style=plastic&label=Unpacked%20Size" alt="Unpacked Size"></a>
</p>
</div>

`notform` is the core NotForm package for Vue 3.

It provides reactive form state, schema-based validation, field state, submission handling, and renderless components that work with any UI you choose.

## Installation

```bash
pnpm add notform
```

Install a Standard Schema-compatible validator separately, for example:

```bash
pnpm add zod
```

## Basic Usage

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
    console.log('Submitted:', values)
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

## API

The core package exports:

- `useNotForm`
- `NotForm`
- `NotField`
- `NotMessage`
- `NotArrayField`

The form instance manages values, errors, touched and dirty state, validation, submission state, and reset behavior.

## Array Fields

`NotArrayField` provides renderless operations for dynamic arrays while preserving stable item keys during reordering.

```vue
<NotArrayField
  path="tags"
  v-slot="{ items, append, remove }"
>
  <div
    v-for="(item, index) in items"
    :key="item.key"
  >
    <NotField :path="item.path" v-slot="{ events, path }">
      <label :for="path">Tag {{ index + 1 }}</label>
      <input
        :id="path"
        v-model="form.values.tags[index]"
        v-bind="events"
        :name="path"
        type="text"
      >
      <NotMessage :path="path" />
    </NotField>

    <button type="button" @click="remove(index)">
      Remove
    </button>
  </div>

  <button type="button" @click="append('')">
    Add tag
  </button>
</NotArrayField>
```

## Type Safety

Field paths and related APIs are inferred from your schema, including nested paths.

## Requirements

- Vue 3
- Node.js 24 or later for development in this repository
- A Standard Schema-compatible validator

## Development

From the repository root:

```bash
pnpm install
pnpm --filter notform test
pnpm --filter notform typecheck
pnpm --filter notform build
```

## License

[MIT](../../LICENSE) © [Favour Emeka](https://github.com/favorodera)
