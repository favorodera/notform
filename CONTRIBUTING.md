# Contributing to NotForm

Thank you for contributing to NotForm.

## Code of Conduct

By participating in this project, you agree to follow the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/) 24 or later
- [pnpm](https://pnpm.io/) 11 or later

### Setup

```bash
git clone https://github.com/favorodera/notform.git
cd notform
pnpm install
pnpm dev
```

This starts the monorepo development environment with Turborepo. The documentation site runs at `http://localhost:3000`.

## Development

Use conventional commit messages. Common prefixes are:

- `feat` — new functionality
- `fix` — bug fixes
- `docs` — documentation changes
- `refactor` — code changes without behavior changes
- `perf` — performance improvements

Before opening a pull request, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Add or update tests when changing behavior.

## Documentation

Documentation lives in `apps/docs`.

When changing the public API, update the relevant documentation alongside the code.

## Playground

The [NotForm Playground](https://notformdocs.vercel.app/playground) is useful for small browser-level reproductions and manual checks.

Use automated tests and the local development environment for correctness and integration testing.

Pull requests may also receive preview packages through [`pkg.pr.new`](https://github.com/stackblitz-labs/pkg.pr.new), which can be used to test changes in the Playground before merging.

## Pull Requests

Keep pull requests focused and easy to review.

Before submitting:

1. Add or update tests where appropriate.
2. Update documentation for user-facing changes.
3. Run the project checks locally.
4. Use a conventional commit message.

## Reporting Bugs

Search existing issues before opening a new one.

Include the expected behavior, actual behavior, reproduction steps, and relevant environment details.

For small browser-level issues, a [Playground](https://notformdocs.vercel.app/playground) reproduction is helpful.

## Feature Requests

Open an issue describing the problem, the proposed solution, and any alternatives you considered.

## Questions

For questions and discussion, use [GitHub Discussions](https://github.com/favorodera/notform/discussions) or the [documentation](https://notformdocs.vercel.app/).

Thank you for helping improve NotForm.