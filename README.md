# NotForm

[![license](https://img.shields.io/github/license/favorodera/notform.svg?style=flat-square)](https://github.com/favorodera/notform/blob/main/LICENSE)
[![github stars](https://img.shields.io/github/stars/favorodera/notform.svg?style=flat-square)](https://github.com/favorodera/notform/stargazers)

**Vue Forms Without the Friction.**

NotForm is a powerful, yet simple form validation and state management library for Vue and Nuxt. It focuses on providing a seamless developer experience with a type-safe API and minimal boilerplate.

## Documentation

Full documentation and examples can be found at:
**[notform-docs.vercel.app](https://notform-docs.vercel.app/)**

## Playground

Playground can be found at:
**[notform-playground](https://stackblitz.com/edit/notform-playground)**

## Features

- **Type-safe:** Built with TypeScript from the ground up.
- **Composable:** Easy to use with Vue 3 Composition API.
- **Lightweight:** Tiny footprint with no unnecessary bloat.
- **Flexible:** Works with any validation library (Yup, Zod, etc.) via Standard Schema.
- **Nuxt Support:** Official Nuxt module for a first-class Nuxt experience.

## Project Structure

This is a monorepo managed with `pnpm` and `turbo`.

- [`packages/notform`](./packages/notform): The core Vue library.
- [`packages/notform-nuxt`](./packages/notform-nuxt): The official Nuxt module.
- [`apps/docs`](./apps/docs): Documentation site built with Nuxt Content.

## Development

### Prerequisites

- [pnpm](https://pnpm.io/installation) (v10 or later)
- Node.js (v24 or later)

### Setup

```bash
# Install dependencies
pnpm install

# Start development in watch mode
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```
