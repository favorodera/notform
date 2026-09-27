<p align="center">
<img alt="header" src="https://shieldcn.dev/header/surface.svg?title=NotForm%28Nuxt+Module%29&amp;subtitle=Headless%2C+schema-agnostic+form+management+for+Vue+3&amp;logo=https%3A%2F%2Fnotformdocs.vercel.app%2Ffavicon.svg&amp;size=wide&amp;mode=dark&amp;font=fira-code" />
</p>

<p align="center">
<a href="https://www.npmjs.com/package/notform-nuxt"><img alt="version" src="https://shieldcn.dev/npm/notform-nuxt.svg?variant=secondary&amp;size=xs&amp;font=fira-code&amp;label=Version" /></a>
<a href="https://www.npmjs.com/package/notform-nuxt"><img alt="downloads" src="https://shieldcn.dev/npm/dm/notform-nuxt.svg?variant=secondary&amp;size=xs&amp;font=fira-code&amp;label=Downloads" /></a>
<a href="https://www.npmjs.com/package/notform-nuxt"><img alt="Custom badge" src="https://shieldcn.dev/bundlephobia/min/notform-nuxt.svg?variant=secondary&amp;size=xs&amp;font=fira-code&amp;label=Unpacked+Size" /></a>
</p>

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

## Basic Usage

You can use NotForm without importing the composable or components in your Vue files:

## Basic Usage

### Single Fields

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

- Nuxt 4 or later
- Node.js 24 or later for development in this repository
- A Standard Schema-compatible validator

## License

[MIT](../../LICENSE) © [Favour Emeka](https://github.com/favorodera)
