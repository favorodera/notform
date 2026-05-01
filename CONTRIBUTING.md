# Contributing to NotForm

Thank you for your interest in contributing to NotForm! We appreciate your time and effort in helping to improve this project.

---

## Table of Contents

  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
  - [Development Workflow](#development-workflow)
  - [Testing](#testing)
  - [Pull Request Process](#pull-request-process)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)

---

## Code of Conduct

By participating in this project, you agree to abide by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Getting Started

### Prerequisites

  - [Node.js](https://nodejs.org/) (v22 or later)
  - [pnpm](https://pnpm.io/installation) (v10 or later)

### Setup

```bash
git clone https://github.com/favorodera/notform.git
cd notform
pnpm install
pnpm dev
```

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
pnpm lint       # check linting errors
pnpm typecheck  # verify TypeScript types
pnpm test       # run all tests
```

---

## Testing

  We use [Vitest](https://vitest.dev/) coupled with [Vue Test Utils](https://test-utils.vuejs.org/) in a jsdom environment.

```bash
pnpm test         # run all tests
pnpm test:watch   # watch mode
```

  When adding new features or fixing bugs, please include tests as this helps us validate upcoming features before they are fully integrated.

---

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if you're changing functionality
3. Add or update tests as appropriate
4. Run the full validation suite:

```bash
pnpm ready
```

5. Commit using Conventional Commits and open a Pull Request.
6. Push your branch and open a Pull Request.

---

## Reporting Bugs

  Before filing a report, check existing issues. When you do file one, include:

  - A clear, descriptive title
  - Steps to reproduce
  - Expected vs. actual behaviour
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
