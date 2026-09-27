# Contributing to NotForm

Thank you for your interest in contributing to NotForm! We appreciate your time and effort in helping to improve this project.

---

## Code of Conduct

  By participating in this project, you agree to abide by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22 or later
- [pnpm](https://pnpm.io/installation) v11 or later

### Setup

```bash
git clone https://github.com/favorodera/notform.git
cd notform
pnpm install
pnpm dev
```

This will:
- Install all dependencies across the monorepo
- Start all packages in watch mode via Turborepo
- Launch the documentation site at `http://localhost:3000`

---

## Development Workflow

### Branch Naming

  | Pattern | Use |
  |---------|-----|
  | `feat/<feature-name>` | New features |
  | `fix/<issue-description>` | Bug fixes |
  | `docs/<what-changed>` | Documentation changes |
  | `chore/<task>` | Maintenance tasks |

### Commit Messages

  We follow [Conventional Commits](https://www.conventionalcommits.org/). `relizy` reads these to generate changelogs automatically.

  | Prefix | Use |
  |--------|-----|
  | `feat:` | A new feature |
  | `fix:` | A bug fix |
  | `docs:` | Documentation only |
  | `style:` | No logic change |
  | `refactor:` | Neither fix nor feature |
  | `perf:` | Performance improvement |
  | `test:` | Adding or correcting tests |
  | `chore:` | Build process or tooling |

### Code Style

```bash
pnpm lint       # Check linting errors across all packages
pnpm typecheck  # Verify TypeScript types in all packages
pnpm test       # Run all test suites with Vitest
```

---

## Testing

We use [Vitest](https://vitest.dev/) coupled with [Vue Test Utils](https://test-utils.vuejs.org/) in a jsdom environment.

```bash
pnpm test         # Run all tests
pnpm test:watch   # Watch mode for development
```

When adding new features or fixing bugs, please include tests as this helps us validate upcoming features before they are fully integrated.

---

## Playground

  The [NotForm Playground](https://notformdocs.vercel.app/playground) is the fastest way to build a small Vue 3 example without creating a local project. It is useful for learning the API, reproducing issues, manually checking browser behavior, and testing pull-request builds.

### What it supports

  The default playground includes:

  - Vue 3 SFCs with TypeScript and the Monaco editor
  - `notform` and `zod` through the built-in browser import map
  - NotForm's core components and `useNotForm` composable
  - Tailwind CSS in the live preview
  - Editable import maps
  - URL-based sharing and local-session restoration

  The playground is intentionally a browser-level environment. It is not a replacement for Vitest, typechecking, linting, builds, or a full local Nuxt environment.

### Reproduce an issue

  For a bug that can be demonstrated with a small Vue example:

  1. Open the [Playground](https://notformdocs.vercel.app/playground).
  2. Reduce the example to the smallest reproduction you can.
  3. Click **Share** and copy the generated URL.
  4. Paste the URL into the issue or pull request.

  Keep examples free of credentials, private endpoints, and production data.

### Test a pull request with `pkg.pr.new`

  Pull requests publish preview packages through `pkg.pr.new`. The CI workflow in `.github/workflows/ci.yml` publishes the workspace packages after the regular validation job, so a PR can be exercised in the browser before it is merged.

  When a preview is available:

  1. Open the pull request and copy the `pkg.pr.new` URL from its preview comment. A compact core-package URL looks like `https://pkg.pr.new/notform@81`.
  2. Open the [NotForm Playground](https://notformdocs.vercel.app/playground).
  3. Open the **Import Map** and replace the `notform` entry with the corresponding esm.sh PR URL:

```text
https://esm.sh/pr/notform@81?external=vue
```

  4. Leave the playground's `vue` entry unchanged so the PR build resolves Vue from the same runtime as the application.
  5. Reproduce the behavior, then use **Share** and paste the playground URL back into the PR.

  `pkg.pr.new` exposes npm-compatible preview packages for commits and pull requests, while esm.sh supports those packages through its `/pr/` URL form. The `external=vue` parameter keeps Vue as an external bare import so the playground's existing Vue import-map entry can resolve it.

  This is useful for validating a PR's browser-facing behavior and creating a focused example for review. Repository tests and CI remain the authoritative checks for correctness.

---

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if you're changing functionality
3. Add or update tests as appropriate
4. Run the full validation suite:

```bash
pnpm ready
```

This command runs the complete pipeline: install → lint → typecheck → test → build.

5. Commit using Conventional Commits and open a Pull Request.
6. Push your branch and open a Pull Request.

---

## Reporting Bugs

  Before filing a report, check existing issues. When you do file one, include:

  - A clear, descriptive title
  - Steps to reproduce
  - Expected vs. actual behavior
  - Your environment (OS, Node.js version, pnpm version)

---

## Suggesting Features

We welcome feature suggestions! Please open an issue describing:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

---

## Questions?

  If you have questions, feel free to:

  - Open a [Discussion](https://github.com/favorodera/notform/discussions)
  - Check the [Documentation](https://notformdocs.vercel.app/)

  Thank you for contributing! 🎉
