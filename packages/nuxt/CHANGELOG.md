# Changelog

## v2.1.3...v2.2.0

[compare changes](https://github.com/favorodera/notform/compare/v2.1.3...v2.2.0)

### Refactors

- **nuxt:** Consolidate package dependencies ([fca865d](https://github.com/favorodera/notform/commit/fca865d))

  - Move notform-nuxt to dependencies
  - Remove direct dependency on core package
  - Update module to resolve paths dynamically
  - Clean up documentation and workspace references


### Documentation

- **readme:** Update pipeline order and fix zod examples ([ef1170a](https://github.com/favorodera/notform/commit/ef1170a))

### Chores

- **repo:** Update dependencies and project structure ([7d1298a](https://github.com/favorodera/notform/commit/7d1298a))

  - Upgrade dependencies and CI workflows
  - Improve form component UX and accessibility
  - Standardize issue templates and documentation
  - Refactor playground styles and configurations

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.1.2...v2.1.3

[compare changes](https://github.com/favorodera/notform/compare/v2.1.2...v2.1.3)

No relevant changes for this release


## v2.1.1...v2.1.2

[compare changes](https://github.com/favorodera/notform/compare/v2.1.1...v2.1.2)

### Refactors

- **core:** Cleanup code and types ([158bb3e](https://github.com/favorodera/notform/commit/158bb3e))

  - remove unused runtime files from nuxt package
  - clean up code comments and type definitions
  - standardize formatting and indentation
  - remove redundant eslint-disable comments

- **nuxt:** Migrate to direct dependency on notform ([6aad8d8](https://github.com/favorodera/notform/commit/6aad8d8))

  - Remove runtime wrapper files for components and composables
  - Update module to import directly from notform
  - Update dependencies to include notform as peer
  - Clean up playground and docs configurations


### Chores

- **lint:** Migrate to shared eslint configuration ([1c8c5df](https://github.com/favorodera/notform/commit/1c8c5df))

  - Replace local configs with unified factory setup
  - Update dependencies for consistent linting
  - Add missing eslint configuration files
  - Remove redundant legacy config files


### Styling

- **repo:** Fix indentation and formatting across codebase ([4c7f460](https://github.com/favorodera/notform/commit/4c7f460))

  - Fix indentation in tests and playgrounds
  - Reorder peer dependencies in nuxt package
  - Reorder dependencies in pnpm workspace catalog

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.1.0...v2.1.1

[compare changes](https://github.com/favorodera/notform/compare/v2.1.0...v2.1.1)

### Refactors

- **nuxt:** Update vite optimization strategy ([a7a37d4](https://github.com/favorodera/notform/commit/a7a37d4))

  - Remove manual exclude of notform package
  - Add dequal and dot-prop to vite optimizeDeps
  - Use extendViteConfig for better compatibility

- **nuxt:** Remove vite dependency pre-bundling ([7a06674](https://github.com/favorodera/notform/commit/7a06674))

  - remove optimizeDeps configuration for dependencies
  - update documentation to reflect changes


### Documentation

- **nuxt:** Update README with installation and usage ([9e56bfd](https://github.com/favorodera/notform/commit/9e56bfd))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0...v2.1.0

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0...v2.1.0)

### Documentation

- Simplify project tagline in READMEs - Remove "Vue Forms Without the Friction." - Update core package description to include components ([88c2afc](https://github.com/favorodera/notform/commit/88c2afc))

### Chores

- Update dependencies and build script ([92e2ad9](https://github.com/favorodera/notform/commit/92e2ad9))
- Update dependencies and build scripts ([62fffb7](https://github.com/favorodera/notform/commit/62fffb7))
- Update dependencies and lint root config ([50ab98c](https://github.com/favorodera/notform/commit/50ab98c))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0...v2.1.0-alpha.0

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0...v2.1.0-alpha.0)

### Documentation

- Simplify project tagline in READMEs - Remove "Vue Forms Without the Friction." - Update core package description to include components ([88c2afc](https://github.com/favorodera/notform/commit/88c2afc))

### Chores

- Update dependencies and build script ([92e2ad9](https://github.com/favorodera/notform/commit/92e2ad9))
- Update dependencies and build scripts ([62fffb7](https://github.com/favorodera/notform/commit/62fffb7))
- Update dependencies and lint root config ([50ab98c](https://github.com/favorodera/notform/commit/50ab98c))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v1.0.7...v2.0.0

[compare changes](https://github.com/favorodera/notform/compare/v1.0.7...v2.0.0)

### Added

- Initialize nuxt module structure ([0c82c65](https://github.com/favorodera/notform/commit/0c82c65))
- Update package.json with new metadata and configuration ([5ab7c57](https://github.com/favorodera/notform/commit/5ab7c57))
- Introduce Vue playground app and refactor Nuxt module ([120417e](https://github.com/favorodera/notform/commit/120417e))
- Add notform package dependency ([8f4aa2e](https://github.com/favorodera/notform/commit/8f4aa2e))
- Register notform components, composables, and types for Nuxt module ([da073ce](https://github.com/favorodera/notform/commit/da073ce))
- Expose notform components ([cbc8516](https://github.com/favorodera/notform/commit/cbc8516))
- Expose useNotForm composable ([8446552](https://github.com/favorodera/notform/commit/8446552))
- Expose notform types from module ([987d38c](https://github.com/favorodera/notform/commit/987d38c))

### Refactors

- Remove explicit type injection for notform module` ([dff28f2](https://github.com/favorodera/notform/commit/dff28f2))
- Replace direct type re-export with virtual module and alias ([bb7cee3](https://github.com/favorodera/notform/commit/bb7cee3))
- Remove unused NotFormModuleOptions interface ([5d897b8](https://github.com/favorodera/notform/commit/5d897b8))
- Remove virtual module and type alias for #notform ([25f8a81](https://github.com/favorodera/notform/commit/25f8a81))

### Documentation

- Update README with new branding and documentation link ([f15fc99](https://github.com/favorodera/notform/commit/f15fc99))
- Add introduction page and update docs navigation ([11b5162](https://github.com/favorodera/notform/commit/11b5162))
- Update documentation links ([2590ebe](https://github.com/favorodera/notform/commit/2590ebe))
- Update documentation link ([f79cf09](https://github.com/favorodera/notform/commit/f79cf09))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-beta.2...v2.0.0-beta.3

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-beta.2...v2.0.0-beta.3)

### Refactors

- Remove virtual module and type alias for #notform ([25f8a81](https://github.com/favorodera/notform/commit/25f8a81))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-beta.1...v2.0.0-beta.2

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-beta.1...v2.0.0-beta.2)

No relevant changes for this release


## v2.0.0-beta.0...v2.0.0-beta.1

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-beta.0...v2.0.0-beta.1)

### Documentation

- Update documentation link ([f79cf09](https://github.com/favorodera/notform/commit/f79cf09))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-alpha.9...v2.0.0-beta.0

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.9...v2.0.0-beta.0)

No relevant changes for this release


## v2.0.0-alpha.7...v2.0.0-alpha.9

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.7...v2.0.0-alpha.9)

### Documentation

- Update documentation links ([2590ebe](https://github.com/favorodera/notform/commit/2590ebe))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-alpha.6...v2.0.0-alpha.7

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.6...v2.0.0-alpha.7)

### Added

- Add notform package dependency ([8f4aa2e](https://github.com/favorodera/notform/commit/8f4aa2e))
- Register notform components, composables, and types for Nuxt module ([da073ce](https://github.com/favorodera/notform/commit/da073ce))
- Expose notform components ([cbc8516](https://github.com/favorodera/notform/commit/cbc8516))
- Expose useNotForm composable ([8446552](https://github.com/favorodera/notform/commit/8446552))
- Expose notform types from module ([987d38c](https://github.com/favorodera/notform/commit/987d38c))

### Refactors

- Remove explicit type injection for notform module` ([dff28f2](https://github.com/favorodera/notform/commit/dff28f2))
- Replace direct type re-export with virtual module and alias ([bb7cee3](https://github.com/favorodera/notform/commit/bb7cee3))
- Remove unused NotFormModuleOptions interface ([5d897b8](https://github.com/favorodera/notform/commit/5d897b8))

### Documentation

- Update README with new branding and documentation link ([f15fc99](https://github.com/favorodera/notform/commit/f15fc99))
- Add introduction page and update docs navigation ([11b5162](https://github.com/favorodera/notform/commit/11b5162))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-alpha.5...v2.0.0-alpha.6

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.5...v2.0.0-alpha.6)

### Added

- Initialize nuxt module structure ([0c82c65](https://github.com/favorodera/notform/commit/0c82c65))
- Update package.json with new metadata and configuration ([5ab7c57](https://github.com/favorodera/notform/commit/5ab7c57))
- Introduce Vue playground app and refactor Nuxt module ([120417e](https://github.com/favorodera/notform/commit/120417e))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
