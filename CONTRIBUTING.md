# Contributing to NotForm

By participating, you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Setup

Requires Node.js 24 or later and pnpm 12 (both pinned in `package.json`).

```bash
git clone https://github.com/favorodera/notform.git
cd notform
pnpm install
pnpm dev
```

`pnpm dev` builds the packages in watch mode and serves the docs site at `http://localhost:3000`. Run `pnpm play` to open the Vue playground.

| Path | Contents |
| --- | --- |
| `packages/vue` | `notform`, the core package |
| `packages/nuxt` | `@notform/nuxt`, the Nuxt module |
| `docs` | Documentation site |

## Before you open a pull request

Run the checks CI runs:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Or run all of them at once with `pnpm ready`.

- Add or update tests in `packages/vue/tests` when you change behavior.
- Update the docs in `docs/content/docs` when you change the public API.
- If you add, rename, or remove a docs page, update the page table in `.agents/skills/notform/SKILL.md`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org) with the package as the scope, for example `feat(vue): add field reset` or `fix(nuxt): resolve alias conflict`.

Commits of type `feat`, `fix`, `perf`, `refactor`, `docs`, and `chore` appear in the changelog. `ci`, `styles`, `build`, and `test` do not.

## Pull requests

Keep each pull request focused on one change, fill in the template, and link the issue it addresses.

## Issues and questions

Search existing issues first, then use the bug report or feature request template. A bug report needs a minimal reproduction. For questions and ideas, use [GitHub Discussions](https://github.com/favorodera/notform/discussions).