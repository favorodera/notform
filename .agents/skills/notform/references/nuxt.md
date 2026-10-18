# NotForm with Nuxt

[Read the full raw Nuxt guide.](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt.md)

## Install

Recommended:

```bash
npx nuxi module add notform
```

Manual setup:

```bash
pnpm add notform-nuxt
```

```ts
export default defineNuxtConfig({
  modules: [
    'notform-nuxt',
  ],
})
```

## Auto-imports

The module exposes:

- `useNotForm`
- `NotForm`
- `NotField`
- `NotArrayField`
- `NotMessage`

Import the validator normally. The module does not install or choose one.

## Rules

- Nuxt changes installation/import ergonomics, not form behavior.
- The same components and composable work with or without the module.
- Keep each form instance inside normal Vue setup code.
- Do not reuse one form instance from module scope across requests.
- For plain Vue/Vite, use `notform` instead of `notform-nuxt`.

## When to load more

After Nuxt setup, use [composables.md](composables.md), [components.md](components.md), and [concepts.md](concepts.md) for the form API and behavior.
