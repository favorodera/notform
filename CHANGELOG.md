# Changelog

## v2.0.0-alpha.2...v2.0.0-alpha.3

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.2...v2.0.0-alpha.3)

### Added

- Enhance not-field component with validation, touch, and dirty states ([26b5606](https://github.com/favorodera/notform/commit/26b5606))
- Implement `validateOn.onChange` and refactor validation state ([9d164a1](https://github.com/favorodera/notform/commit/9d164a1))
- Enhance NotField component with generic path typing and additional instance properties ([e26bcca](https://github.com/favorodera/notform/commit/e26bcca))
- Add validation triggers to NotField component ([2984d97](https://github.com/favorodera/notform/commit/2984d97))
- Add NotFieldEvents and validateOn to NotFieldProps ([71ab1d5](https://github.com/favorodera/notform/commit/71ab1d5))

### Fixed

- Correct error message for missing form instance ([467e218](https://github.com/favorodera/notform/commit/467e218))

### Refactors

- Export useNotForm as default export ([c51bc18](https://github.com/favorodera/notform/commit/c51bc18))
- Introduce readonly initialValues, initialErrors, and validateOn to NotFormInstance ([3910251](https://github.com/favorodera/notform/commit/3910251))

  This commit refactors the `NotFormInstance` type to expose `initialValues`, `initialErrors`, and `validateOn` as readonly properties. These properties were previously omitted from `UseNotFormConfig` but are now directly accessible for better type clarity and immutability.
  Additionally, the `isValidating` property has been changed from a `ComputedRef` to a `Ref`, simplifying its usage and reflecting a more direct state management approach. The `validatingFields` property has been removed as its functionality is now implicitly handled by `isValidating`.

- Remove `bracketNotation` from `TypeFestPaths` configuration ([83e578e](https://github.com/favorodera/notform/commit/83e578e))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-alpha.1...v2.0.0-alpha.2

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.1...v2.0.0-alpha.2)

### Added

- Add NotForm instance provide/inject utilities ([369a6df](https://github.com/favorodera/notform/commit/369a6df))
- Add form utilities for path normalization and comparison ([d1e7517](https://github.com/favorodera/notform/commit/d1e7517))
- Expand NotFormInstance type with detailed properties ([ab8ed40](https://github.com/favorodera/notform/commit/ab8ed40))
- Add NotField component types ([f846e9e](https://github.com/favorodera/notform/commit/f846e9e))
- Export NotForm and NotField components ([e0fc885](https://github.com/favorodera/notform/commit/e0fc885))
- Add NotForm component ([ec65a58](https://github.com/favorodera/notform/commit/ec65a58))
- Introduce NotField component ([2a3eac2](https://github.com/favorodera/notform/commit/2a3eac2))

### Refactors

- Remove unused validation utility functions ([a3b910c](https://github.com/favorodera/notform/commit/a3b910c))
- Remove unused type imports in use-not-form.ts ([2e04c2f](https://github.com/favorodera/notform/commit/2e04c2f))
- Rename `UseNotFormInstance` to `NotFormInstance` and update imports ([44f0464](https://github.com/favorodera/notform/commit/44f0464))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-alpha.0...v2.0.0-alpha.1

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.0...v2.0.0-alpha.1)

### Added

- Define useNotForm API types ([e0b19af](https://github.com/favorodera/notform/commit/e0b19af))
- Add NotForm component types ([579b4b1](https://github.com/favorodera/notform/commit/579b4b1))
- Introduce useNotForm composable ([62b8c55](https://github.com/favorodera/notform/commit/62b8c55))
- Export useNotForm composable and NotForm component types ([5ba4a51](https://github.com/favorodera/notform/commit/5ba4a51))
- Implement useNotForm composable for comprehensive form management ([13e0e31](https://github.com/favorodera/notform/commit/13e0e31))
- Enhance form instance with comprehensive state management ([8908757](https://github.com/favorodera/notform/commit/8908757))
- Add path normalization and comparison utilities ([4e3b5a3](https://github.com/favorodera/notform/commit/4e3b5a3))

### Refactors

- Replace es-toolkit with specialized utility libraries ([fa43ae3](https://github.com/favorodera/notform/commit/fa43ae3))
- Streamline ValidationTrigger and Paths types ([e664afc](https://github.com/favorodera/notform/commit/e664afc))
- Adjust `errorsMap` type to `Partial` ([c8b3289](https://github.com/favorodera/notform/commit/c8b3289))
- Replace dlv and dset with dot-prop ([08fb462](https://github.com/favorodera/notform/commit/08fb462))
- Update ValidationTrigger description for clarity ([5dfc167](https://github.com/favorodera/notform/commit/5dfc167))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v1.0.7...v2.0.0-alpha.0

[compare changes](https://github.com/favorodera/notform/compare/v1.0.7...v2.0.0-alpha.0)

### Added

- Export useNotForm composable types ([27a25ae](https://github.com/favorodera/notform/commit/27a25ae))
- Add UseNotFormOptions type ([e7c131a](https://github.com/favorodera/notform/commit/e7c131a))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
