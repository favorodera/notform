<p align="center">
<img alt="header" src="https://shieldcn.dev/header/surface.svg?title=NotForm%28Core%29&amp;subtitle=Headless%2C+schema-agnostic+form+management+for+Vue+3&amp;logo=https%3A%2F%2Fnotformdocs.vercel.app%2Ffavicon.svg&amp;size=wide&amp;mode=dark&amp;font=fira-code" />
</p>

<p align="center">
<a href="https://www.npmjs.com/package/notform"><img alt="version" src="https://shieldcn.dev/npm/notform.svg?variant=secondary&amp;size=xs&amp;font=fira-code&amp;label=Version" /></a>
<a href="https://www.npmjs.com/package/notform"><img alt="downloads" src="https://shieldcn.dev/npm/dm/notform.svg?variant=secondary&amp;size=xs&amp;font=fira-code&amp;label=Downloads" /></a>
<a href="https://www.npmjs.com/package/notform"><img alt="Custom badge" src="https://shieldcn.dev/bundlephobia/min/notform.svg?variant=secondary&amp;size=xs&amp;font=fira-code&amp;label=Unpacked+Size" /></a>
</p>

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

### Single Fields

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
    @submit="form.submit"
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

### Array Fields

`NotArrayField` provides renderless operations for dynamic arrays while preserving stable item keys during reordering.

```vue
<script setup lang="ts">
import { NotArrayField, NotField, NotForm, NotMessage, useNotForm } from 'notform'
import { z } from 'zod'

const tagSchema = z.string()

const schema = z.object({
  tags: z.array(tagSchema).optional(),
})

const form = useNotForm({
  initialValues: {
    tags: [''],
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
    @submit="form.submit"
    @reset="form.reset()"
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
          v-slot="{ events, path }"
          :path="item.path"
        >
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
        Add tag
      </button>
    </NotArrayField>
  </NotForm>
</template>
```

## Requirements

- Vue 3
- Node.js 24 or later for development in this repository
- A Standard Schema-compatible validator

## License

[MIT](../../LICENSE) © [Favour Emeka](https://github.com/favorodera)
