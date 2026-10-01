# NotForm with Nuxt

Covers adding NotForm to Nuxt, configuring `notform-nuxt`, auto-imports, and SSR. The published Nuxt guide is authoritative. Don't duplicate its setup steps from memory.

## Resource workflow

1. Fetch the [Nuxt module guide](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt-module.md) for installation, manual registration, auto-imports, type safety, and SSR.
2. Fetch [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md) for package and validator setup.
3. Fetch the [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md) for form usage after installation.
4. Start with the [LLM index](https://notformdocs.vercel.app/llms.txt) when the relevant page is unclear.
5. Once Nuxt is configured, use [composables.md](composables.md) and [components.md](components.md) for the API.

## Focus keywords

Search the Nuxt raw guide for `nuxi module add`, `notform-nuxt`, auto-imports, `useNotForm`, `NotForm`, `NotField`, `NotArrayField`, `NotMessage`, Nuxt 4, and SSR.

## Guidance for answers

- Explain that the module changes installation and imports, not form behavior. Every Quickstart example works the same with or without it, minus the `notform` import line.
- The module registers `useNotForm`, `NotForm`, `NotField`, `NotArrayField`, and `NotMessage` as auto-imports. Types stay fully generic, so `form.values` and field `path` props are still typed from the schema.
- The module does not install a validation library. The application still picks a Standard Schema-compatible validator (for example `zod`) and imports it manually.
- Prefer the CLI installation the guide documents (`nuxi module add notform`). Mention manual setup (add `notform-nuxt` as a dependency and list it in `modules` in `nuxt.config.ts`) only when relevant, for example in a monorepo or a restricted environment.
- `notform-nuxt` is Nuxt-only. For plain Vue or Vite, use the `notform` package and the Installation page.
- Link the exact raw page you used so the user can inspect the full instructions.

## Canonical resources

- [LLM index](https://notformdocs.vercel.app/llms.txt)
- [Full LLM bundle](https://notformdocs.vercel.app/llms-full.txt)
- [Nuxt module](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt-module.md)
- [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md)
- [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md)
- [Nuxt](https://nuxt.com/)
