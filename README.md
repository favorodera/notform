<p align="center">
<img alt="header" src="https://shieldcn.dev/header/transparent.svg?title=NotForm&amp;subtitle=Headless%2C+schema-agnostic+form+management+for+Vue+3&amp;logo=https%3A%2F%2Fnotformdocs.vercel.app%2Ffavicon.svg&amp;size=wide&amp;mode=dark&amp;font=fira-code" />
</p>

<p align="center">
<a href="https://github.com/favorodera/notform"><img alt="license" src="https://shieldcn.dev/github/favorodera/notform/license.svg?size=xs&amp;variant=outline&amp;font=fira-code" /></a>
<a href="https://github.com/favorodera/notform"><img alt="stars" src="https://shieldcn.dev/github/favorodera/notform/stars.svg?size=xs&amp;variant=outline&amp;font=fira-code" /></a>
<a href="https://notformdocs.vercel.app/"><img alt="Custom badge" src="https://shieldcn.dev/badge/Documentation.svg?size=xs&amp;variant=outline&amp;font=fira-code" /></a>
<a href="https://github.com/sponsors/favorodera"><img alt="badge" src="https://shieldcn.dev/badge/Sponsor%20this%20project-FF69B4.svg?variant=outline&amp;size=xs&amp;font=fira-code&amp;" /></a>
</p>

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

### Array Fields

`NotArrayField` provides renderless operations for dynamic arrays while preserving stable item keys during reordering.

```vue
<script setup lang="ts">
import { NotArrayField, NotField, NotForm, NotMessage, useNotForm } from 'notform'
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
  <NotArrayField
    v-slot="{ items, append, remove }"
    path="tags"
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
