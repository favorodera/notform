# Changelog

## v2.0.0-alpha.4...v2.0.0-alpha.5

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.4...v2.0.0-alpha.5)

### Added

- Export NotMessage component and its types ([1a3164a](https://github.com/favorodera/notform/commit/1a3164a))
- Add NotMessage component ([1bbe563](https://github.com/favorodera/notform/commit/1bbe563))
- Add NotMessage component types ([7548cc6](https://github.com/favorodera/notform/commit/7548cc6))

### Refactors

- Remove redundant type assertions for form values ([be0db65](https://github.com/favorodera/notform/commit/be0db65))
- Remove unnecessary 'form' prop from NotField ([7850b98](https://github.com/favorodera/notform/commit/7850b98))
- Simplify NotField usage by removing explicit form prop ([b49b859](https://github.com/favorodera/notform/commit/b49b859))

### Documentation

- Revamp README for NotForm project ([e9b9463](https://github.com/favorodera/notform/commit/e9b9463))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-alpha.3...v2.0.0-alpha.4

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.3...v2.0.0-alpha.4)

### Added

- Configure tsdown to not bundle common dependencies ([cbd5b02](https://github.com/favorodera/notform/commit/cbd5b02))
- Add validationMode option to UseNotFormConfig ([5c15c76](https://github.com/favorodera/notform/commit/5c15c76))
- Introduce ValidationMode type ([2cb9b32](https://github.com/favorodera/notform/commit/2cb9b32))
- Add validation mode and form state flags to NotFormInstance ([5949fa4](https://github.com/favorodera/notform/commit/5949fa4))
- Enhance NotField with validationMode and state flags ([d9179fb](https://github.com/favorodera/notform/commit/d9179fb))
- Add validationMode and simplify all fields tracking in useNotForm ([af09d86](https://github.com/favorodera/notform/commit/af09d86))
- Enhance NotField with validation modes and state tracking ([16a0e49](https://github.com/favorodera/notform/commit/16a0e49))

### Fixed

- Prevent inject from throwing error when key is not found ([29e7244](https://github.com/favorodera/notform/commit/29e7244))

### Refactors

- Simplify NotField type handling ([292ee00](https://github.com/favorodera/notform/commit/292ee00))
- Optimize array mutations in `useNotForm` error handling ([1cc7333](https://github.com/favorodera/notform/commit/1cc7333))
- Streamline NotFormInstance API and enhance documentation ([069953f](https://github.com/favorodera/notform/commit/069953f))
- Streamline NotField component types and API ([cc9ba51](https://github.com/favorodera/notform/commit/cc9ba51))
- Improve useNotForm composable reactivity and utilities ([56fd40e](https://github.com/favorodera/notform/commit/56fd40e))

  This commit refactors the `useNotForm` composable to enhance its reactivity and introduce several new utility functions.
  Key changes include:
  - **Reactive State Management**: Replaced `ref()` with `reactive()` for `values`, `errors`, `touchedFields`, and `dirtyFields` to ensure better compatibility with Pinia and maintain consistent reactivity. `values` is now directly reactive, allowing for cleaner access like `form.values.email`.
  - **New Utility Functions**:
      - `runSchema()`: Validates the schema against the current form values.
      - `touchAllFields()`: Marks all current leaf paths as touched.
      - `dirtyAllFields()`: Marks all current leaf paths as dirty.
      - `unDirtyField()`: Removes a path from the dirty set without public exposure.
  - **Improved `setValue`**: The `setValue` function now correctly updates the `values` object, touches the field, and manages the dirty state based on comparison with `initialValues`. It also triggers validation on change if configured.
  - **Enhanced Error Handling**: The `setError` and `setErrors` functions now correctly update the reactive `errors` array. `getFieldErrors` is more robust in path comparison.
  - **Refined Validation**: `validateField` now correctly removes stale errors for the specific field before re-validating, ensuring accurate error reporting.
  - **Reset Functionality**: The `reset` function has been improved to handle the replacement of `initialValues` and `initialErrors` more effectively, including updating the `values` object in-place to preserve reactive bindings. It also clears touched and dirty fields.
  - **MarkRaw Instance**: The returned `NotFormInstance` is now marked as raw to prevent Vue from deeply unwrapping it, maintaining the intended reactive structure.
  - **Removed Redundant State**: Removed `allTouched` and `allDirty` refs as their functionality is now handled by checking the size of `touchedFields` and `dirtyFields` respectively.
  - **Code Cleanup**: Various minor code improvements for clarity and consistency.

- Streamline NotForm generic types and form instance prop ([8853dc7](https://github.com/favorodera/notform/commit/8853dc7))
- Simplify NotField generics and internal logic ([96af8b8](https://github.com/favorodera/notform/commit/96af8b8))

### Documentation

- Improve JSDoc comments and error message for NotForm instance utilities ([e7be8d7](https://github.com/favorodera/notform/commit/e7be8d7))
- Add usage guidance for NotFieldSlotProps value prop ([26707cc](https://github.com/favorodera/notform/commit/26707cc))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


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
