# Changelog

## v3.0.1...v4.0.0

[compare changes](https://github.com/favorodera/notform/compare/v3.0.1...v4.0.0)

### Added

- **nuxt:** Add Nuxt module for NotForm ([f57f7ec](https://github.com/favorodera/notform/commit/f57f7ec))

  - Enable seamless NotForm integration in Nuxt apps
  - Auto-import components and composables
  - Allow aliasing component and composable names
  - Update workspace setup and ESLint rules

- **vue:** Support dynamic array fields ([9e5881d](https://github.com/favorodera/notform/commit/9e5881d))

  - Enable dynamic form lists with array mutations
  - Keep field identity and state across renders
  - Preserve validation issues across list updates
  - Add FieldError to simplify error rendering

- **docs:** Add documentation site and playground ([2bad47b](https://github.com/favorodera/notform/commit/2bad47b))

  - Add docs site with interactive REPL playground
  - Export UseFormInstance type for type inference
  - Include FieldError in Nuxt module auto-imports
  - Add scripts to sync playground worker files

- **docs:** Update content and components for v4 ([8b8a8a4](https://github.com/favorodera/notform/commit/8b8a8a4))

  - Introduce AppCard component for better content display
  - Overhaul ArrayField item removal logic
  - Update getting started content for v4
  - Revamp landing page features
  - Adjust app config and dependencies


### Refactors

- **workspace:** Prepare repository for v4 rewrite ([45add4c](https://github.com/favorodera/notform/commit/45add4c))

  - Remove legacy docs and Nuxt module packages
  - Clear core package components and composables
  - Add local playground for core package
  - Update workspace config and dependencies

- **repo:** Update project name to notform ([5e550ff](https://github.com/favorodera/notform/commit/5e550ff))

  - Standardize monorepo references to notform
  - Remove unused CSS and page transitions in docs
  - Update docs metadata for clarity


### Documentation

- **nuxt:** Clarify package usage in README ([53b9c7a](https://github.com/favorodera/notform/commit/53b9c7a))

  - Clarify auto-import and dependency requirements
  - Improve wording for API consistency with Vue


### Chores

- **nuxt:** Run prepare before build ([fd3af06](https://github.com/favorodera/notform/commit/fd3af06))

  - Ensure generated types exist before build
  - Align build script with dev and lint tasks

- **pkg:** Update engine configuration schema ([279771e](https://github.com/favorodera/notform/commit/279771e))

  - Update devEngines structure across workspace
  - Add automatic download strategy for engines

- **vue:** Disable jsonc array newline rule ([8dd172c](https://github.com/favorodera/notform/commit/8dd172c))

  - Allow flexible array formatting in package.json

- **eslint:** Disable jsonc array-bracket-newline ([1df18ba](https://github.com/favorodera/notform/commit/1df18ba))

### 🎨 Styles

- **nuxt:** Fix indentation in eslint config ([ebf65f7](https://github.com/favorodera/notform/commit/ebf65f7))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v4.0.0-alpha.3...v4.0.0-beta.0

[compare changes](https://github.com/favorodera/notform/compare/v4.0.0-alpha.3...v4.0.0-beta.0)

No relevant changes for this release


## v4.0.0-alpha.2...v4.0.0-alpha.3

[compare changes](https://github.com/favorodera/notform/compare/v4.0.0-alpha.2...v4.0.0-alpha.3)

No relevant changes for this release


## v4.0.0-alpha.1...v4.0.0-alpha.2

[compare changes](https://github.com/favorodera/notform/compare/v4.0.0-alpha.1...v4.0.0-alpha.2)

### Chores

- **eslint:** Disable jsonc array-bracket-newline ([1df18ba](https://github.com/favorodera/notform/commit/1df18ba))

### 🎨 Styles

- **nuxt:** Fix indentation in eslint config ([ebf65f7](https://github.com/favorodera/notform/commit/ebf65f7))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v4.0.0-alpha.0...v4.0.0-alpha.1

[compare changes](https://github.com/favorodera/notform/compare/v4.0.0-alpha.0...v4.0.0-alpha.1)

### Chores

- **vue:** Disable jsonc array newline rule ([8dd172c](https://github.com/favorodera/notform/commit/8dd172c))

  - Allow flexible array formatting in package.json

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v3.0.1...v4.0.0-alpha.0

[compare changes](https://github.com/favorodera/notform/compare/v3.0.1...v4.0.0-alpha.0)

### Added

- **nuxt:** Add Nuxt module for NotForm ([f57f7ec](https://github.com/favorodera/notform/commit/f57f7ec))

  - Enable seamless NotForm integration in Nuxt apps
  - Auto-import components and composables
  - Allow aliasing component and composable names
  - Update workspace setup and ESLint rules

- **vue:** Support dynamic array fields ([9e5881d](https://github.com/favorodera/notform/commit/9e5881d))

  - Enable dynamic form lists with array mutations
  - Keep field identity and state across renders
  - Preserve validation issues across list updates
  - Add FieldError to simplify error rendering

- **docs:** Add documentation site and playground ([2bad47b](https://github.com/favorodera/notform/commit/2bad47b))

  - Add docs site with interactive REPL playground
  - Export UseFormInstance type for type inference
  - Include FieldError in Nuxt module auto-imports
  - Add scripts to sync playground worker files

- **docs:** Update content and components for v4 ([8b8a8a4](https://github.com/favorodera/notform/commit/8b8a8a4))

  - Introduce AppCard component for better content display
  - Overhaul ArrayField item removal logic
  - Update getting started content for v4
  - Revamp landing page features
  - Adjust app config and dependencies


### Refactors

- **workspace:** Prepare repository for v4 rewrite ([45add4c](https://github.com/favorodera/notform/commit/45add4c))

  - Remove legacy docs and Nuxt module packages
  - Clear core package components and composables
  - Add local playground for core package
  - Update workspace config and dependencies

- **repo:** Update project name to notform ([5e550ff](https://github.com/favorodera/notform/commit/5e550ff))

  - Standardize monorepo references to notform
  - Remove unused CSS and page transitions in docs
  - Update docs metadata for clarity


### Documentation

- **nuxt:** Clarify package usage in README ([53b9c7a](https://github.com/favorodera/notform/commit/53b9c7a))

  - Clarify auto-import and dependency requirements
  - Improve wording for API consistency with Vue


### Chores

- **nuxt:** Run prepare before build ([fd3af06](https://github.com/favorodera/notform/commit/fd3af06))

  - Ensure generated types exist before build
  - Align build script with dev and lint tasks

- **pkg:** Update engine configuration schema ([279771e](https://github.com/favorodera/notform/commit/279771e))

  - Update devEngines structure across workspace
  - Add automatic download strategy for engines

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
