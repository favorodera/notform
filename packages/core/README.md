<h1 align="center">
  <img alt="NotForm Logo" loading="lazy" width="50" height="50" decoding="async" data-nimg="1" style="color:transparent" src="https://notformdocs.vercel.app/favicon.svg">
  </br>
  NotForm
</h1>
<p align="center">
  Headless, schema-agnostic form management for Vue and Nuxt.
</p>

NotForm manages reactive form values, validation, field state, submission, and dynamic arrays while leaving markup, styling, and layout to your application.

## Install

```bash
pnpm add notform zod
```

NotForm does not bundle a validator. You can use any library that implements [Standard Schema](https://standardschema.dev/).

## Use

Create a form instance with `useForm`, then pass it to `Form`. `Field`, `ArrayField`, and `Error` can resolve the nearest form automatically.

```vue
<script setup lang="ts">
import { useForm } from 'notform'
import { z } from 'zod'

const schema = z.object({ email: z.email() })
const form = useForm({
  initialValues: { email: '' },
  schema,
})
</script>

<template>
  <Form :form="form">
    <Field
      v-slot="{ events }"
      path="email"
    >
      <input
        v-model="form.values.email"
        v-bind="events"
      >
    </Field>

    <Error path="email" />

    <button type="submit">
      Submit
    </button>
  </Form>
</template>
```

See the [Documentation](https://notformdocs.vercel.app/) for validation, submission, and array-field guides.

## License

MIT © [Favour Emeka](https://github.com/favorodera)
