---
name: nuxt
description: "Use when adding NotForm to Nuxt, configuring notform-nuxt, using auto-imported components, checking SSR behavior, or finding the correct NotForm documentation and raw Markdown reference."
---

# NotForm with Nuxt

Use this skill for Nuxt installation and documentation routing. The published Nuxt guide is authoritative; do not duplicate its setup instructions here.

## Resource workflow

1. Fetch the [Nuxt module raw guide](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt-module.md) for installation, manual registration, auto-imports, type safety, and SSR.
2. Fetch [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md) for package and validator setup.
3. Fetch the [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md) for form usage after installation.
4. Start with the [LLM index](https://notformdocs.vercel.app/llms.txt) when the relevant page is unclear.
5. Use the `composables` and `components` skills for the API after Nuxt has been configured.

## Focus keywords

Search the Nuxt raw guide for `nuxi module add`, `notform-nuxt`, auto-imports, `useNotForm`, `NotForm`, `NotField`, `NotArrayField`, `NotMessage`, Nuxt 4, and SSR.

## Guidance for answers

- Explain that the Nuxt module changes installation and imports, not form behavior.
- Remember that the module does not install a validation library; the application still chooses a Standard Schema-compatible validator.
- Prefer the CLI installation documented by the guide; mention manual setup only when relevant.
- Link the exact raw page used so the user can inspect the complete instructions.

## Canonical resources

- [LLM index](https://notformdocs.vercel.app/llms.txt)
- [Full LLM bundle](https://notformdocs.vercel.app/llms-full.txt)
- [Nuxt module](https://notformdocs.vercel.app/raw/docs/getting-started/nuxt-module.md)
- [Installation](https://notformdocs.vercel.app/raw/docs/getting-started/installation.md)
- [Quickstart](https://notformdocs.vercel.app/raw/docs/getting-started/quickstart.md)
- [Nuxt](https://nuxt.com/)
