# Contributing to NotForm

Thank you for your interest in contributing to NotForm! We appreciate your time and effort in helping to improve this project.

## Code of Conduct

By participating in this project, you agree to abide by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v24 or later)
- [pnpm](https://pnpm.io/installation) (v10 or later)

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/<your-username>/notform.git
   cd notform
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start development:

   ```bash
   pnpm dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names following this pattern:

- `feat/<feature-name>` - New features
- `fix/<issue-description>` - Bug fixes
- `docs/<what-changed>` - Documentation changes
- `chore/<task>` - Maintenance tasks

### Commit Messages

Write clear, concise commit messages. We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect the meaning of the code
- `refactor:` - A code change that neither fixes a bug nor adds a feature
- `perf:` - A code change that improves performance
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

### Code Style

- Run `pnpm lint` to check for linting errors
- Run `pnpm typecheck` to verify TypeScript types
- Ensure all tests pass with `pnpm test`

## Testing

We use [Vitest](https://vitest.dev/) for testing.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Writing Tests

When adding new features or fixing bugs, please include tests. Create test files in the `future` folder within the respective package:

```
packages/
├── notform/
│   └── future/          # Add test files here for notform features
│       └── your-feature.test.ts
└── notform-nuxt/
    └── future/          # Add test files here for nuxt module features
        └── your-feature.test.ts
```

This helps us validate upcoming features before they are fully integrated.

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if you're changing functionality
3. Add or update tests as appropriate
4. Run the full validation suite:

   ```bash
   pnpm ready
   ```

5. Create a changeset for your changes:

   ```bash
   pnpm changeset
   ```

6. Push your branch and open a Pull Request

## Reporting Bugs

Before creating bug reports, please check existing issues to see if the problem has already been reported.

When filing a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Your environment (OS, Node.js version, pnpm version, etc.)

## Suggesting Features

We welcome feature suggestions! Please open an issue describing:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Questions?

If you have questions, feel free to:

- Open a [Discussion](https://github.com/favorodera/notform/discussions)
- Check the [Documentation](https://notform-docs.vercel.app/)

Thank you for contributing! 🎉
