<div align="center">
<img src="https://notformdocs.vercel.app/favicon.svg" alt="NotForm Logo" width="80" height="80">
<h1>NotForm</h1>
<p><strong>Vue Forms Without the Friction</strong></p>
<p>
<a href="https://github.com/favorodera/notform/blob/main/LICENSE"><img src="https://img.shields.io/github/license/favorodera/notform.svg?style=plastic&label=License&color=blue" alt="License"></a>
<a href="https://github.com/favorodera/notform/stargazers"><img src="https://img.shields.io/github/stars/favorodera/notform.svg?style=plastic&label=Stars&color=blue" alt="GitHub Stars"></a>
<a href="https://notformdocs.vercel.app/"><img src="https://img.shields.io/badge/-Documentation-blue?style=plastic" alt="NotForm Documentation"></a>
</p>
<p>
<a href="https://codewiki.google/github.com/favorodera/notform"><img src="https://img.shields.io/badge/-Ask%20Code%20Wiki-blue?style=plastic&logo=google-gemini&logoColor=white" alt="Ask Code Wiki"></a>
<a href="https://deepwiki.com/favorodera/notform"><img src="https://img.shields.io/badge/-Ask%20Devin-blue?style=plastic&logo=windsurf&logoColor=white" alt="Ask Devin"></a>
</p>
<p>
<a href="./packages/core"><img src="https://img.shields.io/badge/Core-blue?style=plastic&logo=vuedotjs&logoColor=white" alt="NotForm Core"></a>
<a href="./packages/nuxt"><img src="https://img.shields.io/badge/Nuxt%20Module-blue?style=plastic&logo=nuxt&logoColor=white" alt="NotForm Nuxt Module"></a>
</p>
</div>

<br>

NotForm is a powerful, yet simple form validation and state management library for Vue and Nuxt. It focuses on providing a seamless developer experience with a type-safe API and minimal boilerplate. Built with TypeScript from the ground up, it offers a composable API that integrates perfectly with Vue 3's Composition API.

## Features

- **Type-safe** — Built with TypeScript from the ground up for end-to-end type safety.
- **Composable** — Easy to use with Vue 3 Composition API for flexible form management.
- **Lightweight** — Tiny footprint with no unnecessary bloat, keeping your bundles small.
- **Flexible** — Works with any validation library (Yup, Zod, etc.) via Standard Schema integration.
- **Nuxt-ready** — Drop in the [`notform-nuxt`](./packages/nuxt) module for auto-registration and zero config.
- **Minimal boilerplate** — Get started quickly with simple, intuitive APIs.

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

## License

[MIT](./LICENSE) &copy; [Favour Emeka](https://github.com/favorodera)
