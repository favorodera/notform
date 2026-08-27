<div align="center">
<h1><code>notform-nuxt</code></h1>
<p><strong>Headless Form Management, Seamlessly Integrated with Nuxt</strong></p>
<p>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/notform-nuxt.svg?style=plastic&label=NPM%20Version&color=blue" alt="NPM Version"></a>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dt/notform-nuxt.svg?style=plastic&label=NPM%20Downloads&color=blue" alt="NPM Downloads"></a>
<a href="https://npmx.dev/package/notform-nuxt" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/unpacked-size/notform-nuxt?style=plastic&label=NPM%20Unpacked%20Size&color=blue" alt="NPM Unpacked Size"></a>
</p>
</div>

`notform-nuxt` is the official Nuxt module for [NotForm](../core). It provides auto-imports for NotForm composables and components, making form development in Nuxt applications seamless and type-safe. Works with any Standard Schema-compatible validator (Zod, Valibot, ArkType) and any UI library.

## Installation

```bash
npx nuxi module add notform
```

Alternatively, install manually:

```bash
pnpm add notform-nuxt
```

## Setup

Add `notform-nuxt` to the `modules` section of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['notform-nuxt'],
})
```

That's it — all NotForm composables and components are now auto-imported in your Nuxt application.

## What the Module Does

1. **Auto-imports composables** — `useNotForm`, `NotForm`, `NotField`, `NotMessage`, `NotArrayField` are available everywhere without manual imports.
2. **Auto-imports components** — All NotForm components are globally available in your templates.
3. **Type-safe** — Full TypeScript support with auto-completion for all NotForm APIs.

## Prerequisites

- [Nuxt](https://nuxt.com/) v4 or later

## Documentation

For detailed guides, API reference, and examples, visit:
**[notformdocs.vercel.app](https://notformdocs.vercel.app/)**

## License

[MIT](../../LICENSE) &copy; [Favour Emeka](https://github.com/favorodera)
