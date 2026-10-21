# NotForm with Nuxt

[Read the full raw Nuxt guide.](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt.md)

## Install

Install the official integration package:

```bash
pnpm add @notform/nuxt
```

Register it in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@notform/nuxt'],
})
```

## Auto-imports

The module auto-imports the core exports:

- `useForm`
- `Form`
- `Field`
- `ArrayField`
- `Error`

Install and import a Standard Schema-compatible validator separately (for example, Zod). The module does not choose or install a validator.

## Aliases

Use the `notform` module config key to rename selected auto-imports:

```ts
export default defineNuxtConfig({
  modules: ['@notform/nuxt'],
  notform: {
    aliases: {
      Form: 'AppForm',
      useForm: 'useAppForm',
    },
  },
})
```

Supported alias keys are `Form`, `Field`, `ArrayField`, `Error`, and `useForm`. Only configure aliases you want to change; unlisted exports keep their default names.

## Rules

- Nuxt changes installation and import ergonomics, not form behavior.
- The same `useForm` composable and components work with or without the module.
- `<Form>` receives the form instance via `:form="form"` and supplies it to descendant components through Vue context.
- `<Form>` handles native submit and reset events internally; explicit `@submit` and `@reset` bindings are not required for ordinary usage.
- Keep each form instance inside normal Vue setup code. Do not reuse a form instance created at module scope across server requests.
- For plain Vue/Vite, install `notform` and import the exports from `notform`; do not install the Nuxt integration just to use the core API.

## When to load more

After Nuxt setup, use [composables.md](composables.md), [components.md](components.md), and [concepts.md](concepts.md) for the form API and behavior.
