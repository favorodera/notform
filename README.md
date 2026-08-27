<div align="center">
  <img src="https://notformdocs.vercel.app/favicon.svg" alt="NotForm Logo" width="80" height="80">

  <h1>NotForm</h1>

  <p><strong>Headless, Schema-Agnostic Form Management for Vue 3 & Nuxt</strong></p>

  <p>
    <a href="https://github.com/favorodera/notform/blob/main/LICENSE"><img src="https://img.shields.io/github/license/favorodera/notform.svg?style=plastic&label=License" alt="License"></a>
    <a href="https://github.com/favorodera/notform/stargazers"><img src="https://img.shields.io/github/stars/favorodera/notform.svg?style=plastic&label=Stars" alt="GitHub Stars"></a>
    <a href="https://notformdocs.vercel.app/"><img src="https://img.shields.io/badge/-Documentation-blue?style=plastic" alt="NotForm Documentation"></a>
  </p>

  <p>
    <a href="./packages/core"><img src="https://img.shields.io/badge/Core-blue?style=plastic&logo=vuedotjs&logoColor=white" alt="NotForm Core"></a>
    <a href="./packages/nuxt"><img src="https://img.shields.io/badge/Nuxt%20Module-blue?style=plastic&logo=nuxt&logoColor=white" alt="NotForm Nuxt Module"></a>
  </p>
</div>

<br>

NotForm is a headless form validation and state management library for Vue 3 and Nuxt. It provides the logic and state for your forms, while giving you complete control over the UI. Built with TypeScript from the ground up, it integrates seamlessly with any Standard Schema-compatible validator (Zod, Valibot, ArkType) and works with any UI library—native HTML, Nuxt UI, Shadcn, or your own components.

## Features

- **Headless** — Renders nothing. You bring the UI, NotForm brings the logic.
- **Schema-agnostic** — Works with any Standard Schema validator (Zod, Valibot, ArkType, etc.)
- **Type-safe** — Full TypeScript support with inferred types from your schema.
- **Composable** — Built for Vue 3 Composition API with a clean, intuitive API.
- **Lightweight** — Tiny footprint with tree-shaking support.
- **Nuxt-ready** — Official Nuxt module with auto-imports and zero configuration.
- **Flexible** — Use with any UI library—native HTML, Nuxt UI, Shadcn, or your own components.

## Monorepo Structure

This monorepo is managed with [pnpm](https://pnpm.io/) workspaces and [Turborepo](https://turbo.build/repo).

| Path | Package | Description |
|------|---------|-------------|
| [`packages/core`](./packages/core) | `notform` | Core Vue library for form validation and state management |
| [`packages/nuxt`](./packages/nuxt) | `notform-nuxt` | Official Nuxt module with auto-registration |
| [`apps/docs`](./apps/docs) | `docs` | Documentation site built with Nuxt Content |
| [`playgrounds/vue`](./playgrounds/vue) | `vue-playground` | Vue development sandbox |
| [`playgrounds/nuxt`](./playgrounds/nuxt) | `nuxt-playground` | Nuxt development sandbox |

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) v22 or later
- [pnpm](https://pnpm.io/installation) v11 or later

### Getting Started

```bash
# Install all dependencies
pnpm install

# Start all packages in watch mode
pnpm dev

# Build everything
pnpm build

# Lint, typecheck, build, and test in one go
pnpm ready
```

### Useful Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Starts all packages in watch/dev mode via Turborepo |
| `pnpm build` | Production build of all packages |
| `pnpm lint` | Lint all packages with ESLint |
| `pnpm typecheck` | Type-check all packages with `vue-tsc` / `tsc` |
| `pnpm test` | Run all test suites with Vitest |
| `pnpm ready` | Full pipeline: install → lint → typecheck → test → build |

## Documentation

For detailed guides, API reference, and examples, visit **[notformdocs.vercel.app](https://notformdocs.vercel.app/)**.

## License

[MIT](./LICENSE) &copy; [Favour Emeka](https://github.com/favorodera)
