# notform

## 1.0.4

### Patch Changes

- [#32](https://github.com/favorodera/notform/pull/32) [`9747edf`](https://github.com/favorodera/notform/commit/9747edfb3b831054713eff1bd13fe7bf40da17c6) Thanks [@favorodera](https://github.com/favorodera)! - Add `isSubmitting` state to track form submission status

## 1.0.3

### Patch Changes

- [#29](https://github.com/favorodera/notform/pull/29) [`a227c41`](https://github.com/favorodera/notform/commit/a227c41d76533b37dcda9a150315caa7451b93b2) Thanks [@favorodera](https://github.com/favorodera)! - refactor: change setState validation from form-level to field-level

  Refactored setState to use field-level validation instead of form-level validation for better performance and more precise error feedback.

  - Changed from validating entire form to validating only changed fields
  - Improves performance significantly for large forms
  - Provides more precise validation feedback scoped to modified fields
  - Maintains existing validation modes (lazy/eager) behavior

## 1.0.2

### Patch Changes

- [#27](https://github.com/favorodera/notform/pull/27) [`dfe1571`](https://github.com/favorodera/notform/commit/dfe1571fbaf6b1273ce9edf3691dc12e27df38d4) Thanks [@favorodera](https://github.com/favorodera)! - - **NotMessage**:
  - Add `as` prop to specify custom HTML tag (defaults to `span`, e.g., `as="p"`, `as="div"`)
  - Support attribute forwarding: attributes like `class`, `role`, `title` are now applied to the root element
  - When using default slot, attributes are passed via `attributes` prop for manual binding with `v-bind`
  - Improves flexibility for styling and accessibility customization

## 1.0.1

### Patch Changes

- [#19](https://github.com/favorodera/notform/pull/19) [`8c63aee`](https://github.com/favorodera/notform/commit/8c63aee3fed29b3758834243b9bc2d6ae0fc4634) Thanks [@favorodera](https://github.com/favorodera)! - Refine validation triggers for `eager` and `lazy` modes and clarify `ValidationMode` descriptions

## 1.0.0

### Patch Changes

- [#3](https://github.com/favorodera/notform/pull/3) [`8d2b269`](https://github.com/favorodera/notform/commit/8d2b26968cfbf2eebfc606bf20771f75ffe270e4) Thanks [@favorodera](https://github.com/favorodera)! - Initial alpha release

- [#3](https://github.com/favorodera/notform/pull/3) [`9933516`](https://github.com/favorodera/notform/commit/993351645a7d2b51b5e89ef1d0c4cbc034c2694b) Thanks [@favorodera](https://github.com/favorodera)! - Fix workflows

- [`18a8afe`](https://github.com/favorodera/notform/commit/18a8afec42012e626c10cac218ad963baf6856c3) Thanks [@favorodera](https://github.com/favorodera)! - Core refactor

- [#3](https://github.com/favorodera/notform/pull/3) [`27c9a15`](https://github.com/favorodera/notform/commit/27c9a15add885c255976f38b35887d31f9455e35) Thanks [@favorodera](https://github.com/favorodera)! - Documentation initialization

- [#7](https://github.com/favorodera/notform/pull/7) [`75bdc81`](https://github.com/favorodera/notform/commit/75bdc8151552939a21d540d6db70f8bf380d387b) Thanks [@favorodera](https://github.com/favorodera)! - refactor: cleanup exportted types from `notform`
  fix: fixed type components type inference issue on `notform-nuxt`

- [#3](https://github.com/favorodera/notform/pull/3) [`f3bf2c6`](https://github.com/favorodera/notform/commit/f3bf2c6925807734735db60a4697f3c3113461a6) Thanks [@favorodera](https://github.com/favorodera)! - Core cleanup

- [#8](https://github.com/favorodera/notform/pull/8) [`3f74afa`](https://github.com/favorodera/notform/commit/3f74afa91218db1ecc59beb10fdd63430185e5d1) Thanks [@favorodera](https://github.com/favorodera)! - - Refactored `NotForm` props to accept `asChild` and `as` options to to implement dynamic rendering

  - Created a standard schema based simple validator for testing and removed all "library inclined" tests

- [#7](https://github.com/favorodera/notform/pull/7) [`f843ef7`](https://github.com/favorodera/notform/commit/f843ef7bb7e1ee9b4b8efed87bfbe76cb04029d8) Thanks [@favorodera](https://github.com/favorodera)! - refactor: enhance types and cleanup internal structure

- [#7](https://github.com/favorodera/notform/pull/7) [`0702153`](https://github.com/favorodera/notform/commit/07021530b0765ea40bbfda9ad73e9121034b58d3) Thanks [@favorodera](https://github.com/favorodera)! - refactor: simplify `NotMessage` name prop type

## 1.0.0-alpha.9

### Patch Changes

- [`18a8afe`](https://github.com/favorodera/notform/commit/18a8afec42012e626c10cac218ad963baf6856c3) Thanks [@favorodera](https://github.com/favorodera)! - Core refactor

## 1.0.0-alpha.8

### Patch Changes

- [#8](https://github.com/favorodera/notform/pull/8) [`3f74afa`](https://github.com/favorodera/notform/commit/3f74afa91218db1ecc59beb10fdd63430185e5d1) Thanks [@favorodera](https://github.com/favorodera)! - - Refactored `NotForm` props to accept `asChild` and `as` options to to implement dynamic rendering
  - Created a standard schema based simple validator for testing and removed all "library inclined" tests

## 1.0.0-alpha.7

### Patch Changes

- [`0702153`](https://github.com/favorodera/notform/commit/07021530b0765ea40bbfda9ad73e9121034b58d3) Thanks [@favorodera](https://github.com/favorodera)! - refactor: simplify `NotMessage` name prop type

## 1.0.0-alpha.7

### Patch Changes

- 75bdc81: refactor: cleanup exportted types from `notform`
  fix: fixed type components type inference issue on `notform-nuxt`
  - vue@undefined

## 1.0.0-alpha.6

### Patch Changes

- f843ef7: refactor: enhance types and cleanup internal structure

## 1.0.0-alpha.5

### Patch Changes

- f3bf2c6: Core cleanup

## 1.0.0-alpha.4

### Patch Changes

- 27c9a15: Documentation initialization

## 1.0.0-alpha.3

### Patch Changes

- 9933516: Fix workflows

## 1.0.0-alpha.2

### Patch Changes

- 8d2b269: Initial alpha release
