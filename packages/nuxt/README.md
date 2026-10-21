<h1 align="center">
  <img alt="NotForm Logo" loading="lazy" width="50" height="50" decoding="async" data-nimg="1" style="color:transparent" src="https://notformdocs.vercel.app/favicon.svg">
  </br>
  NotForm Nuxt
</h1>
<p align="center">
  Headless, schema-agnostic form management for Vue and Nuxt.
</p>

Official Nuxt integration for NotForm. 

The module registers the core components and composable as Nuxt auto-imports.

## Install

```bash
pnpm add @notform/nuxt
```

Register the module in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@notform/nuxt'],
})
```

## Auto-imports

The module registers `Form`, `Field`, `ArrayField`, `Error`, and `useForm`. 

These APIs are otherwise identical to the core package.

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

See the [Nuxt guide](https://notformdocs.vercel.app/docs/getting-started/nuxt) for setup details.

## License

MIT © [Favour Emeka](https://github.com/favorodera)
