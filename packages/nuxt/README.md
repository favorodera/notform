<h1 align="center">
  <img alt="NotForm Logo" loading="lazy" width="50" height="50" decoding="async" data-nimg="1" style="color:transparent" src="https://notformdocs.vercel.app/favicon.svg">
  </br>
  NotForm for Nuxt
</h1>

<p align="center">
  Official Nuxt integration for NotForm.
</p>

This module registers NotForm's components and composable so you can use them in any page or component without importing them. The APIs are exactly the ones in the core package.

## Install

```bash
pnpm add @notform/nuxt
```

The module brings `notform` with it. Add `notform` to your own dependencies only if you want to import its types directly.

Register the module in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@notform/nuxt'],
})
```

## Auto-imports

The module registers `Form`, `Field`, `ArrayField`, `FieldError`, and `useForm`. 

These APIs are otherwise identical to the vue package.

Use `notform.aliases` to change selected names:

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

See the [Nuxt guide](https://notformdocs.vercel.app/docs/getting-started/nuxt-module) for setup details.

## License

MIT © [Favour Emeka](https://github.com/favorodera)
