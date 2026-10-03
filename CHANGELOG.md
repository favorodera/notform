# Changelog

## v3.0.0...v3.0.1

[compare changes](https://github.com/favorodera/notform/compare/v3.0.0...v3.0.1)

### Fixed

- **core:** Forward attrs to form element ([9d29d23](https://github.com/favorodera/notform/commit/9d29d23))

  - Forward undeclared attributes to native form
  - Update logical properties in docs styles
  - Clarify component rendering documentation

- **docs:** Update SVG favicon path to logo.svg ([f43ab3e](https://github.com/favorodera/notform/commit/f43ab3e))

### Refactors

- **skills:** Consolidate NotForm agent skills ([388374c](https://github.com/favorodera/notform/commit/388374c))

  - Merge individual NotForm skills into a single skill
  - Reroute references to dedicated markdown files
  - Update main README to reflect new skill structure
  - Adjust docs for `skills add` command to `favorodera/notform`

- **skills:** Consolidate NotForm agent skills ([#102](https://github.com/favorodera/notform/pull/102))

### Documentation

- **repl:** Clarify sync script comment ([e58cd1a](https://github.com/favorodera/notform/commit/e58cd1a))

  - Simplify postinstall explanation for repl sync

- **repl:** Clarify sync script comment ([a31564c](https://github.com/favorodera/notform/commit/a31564c))

  - Simplify postinstall explanation for repl sync

- **agents:** Add agent skills documentation ([bf6f46c](https://github.com/favorodera/notform/commit/bf6f46c))

  - Add skills.sh definitions for NotForm
  - Guide agents on composables, components, and Nuxt
  - Include troubleshooting and canonical doc routing

- **docs:** Expand working with ai docs section ([ccf0a45](https://github.com/favorodera/notform/commit/ccf0a45))

  - Move AI guide to dedicated documentation section
  - Add agent skills page and update llms.txt guide
  - Adjust prose link styles and editor options

- **agent-skills:** Simplify installation guide ([fe87f39](https://github.com/favorodera/notform/commit/fe87f39))

  - Remove redundant agent and global flag examples
  - Streamline setup instructions for skills CLI

- **ai:** Consolidate agent skills into a single page ([1250d6d](https://github.com/favorodera/notform/commit/1250d6d))

  - Simplify AI agent skill documentation
  - Merge multiple skill descriptions into one comprehensive guide
  - Improve clarity and ease of use for AI coding assistants

- **ai:** Use relative links for llms documentation ([44f450d](https://github.com/favorodera/notform/commit/44f450d))

  - Replace absolute documentation URLs with relative paths
  - Ensure links work across different host environments

- **ai:** Rename llms.txt doc slug and link ([263117e](https://github.com/favorodera/notform/commit/263117e))

  - Rename file to avoid route collision with dot
  - Update internal documentation link to new slug
  - Capitalize page title for consistency

- **ai:** Mark raw and external links explicitly ([f37e96f](https://github.com/favorodera/notform/commit/f37e96f))

  - Add external attributes to raw doc links
  - Ensure files and external sites open properly

- **agent-skill:** Update link label to llms-txt ([a88b270](https://github.com/favorodera/notform/commit/a88b270))

  - Clarify target document path in agent skill tip

### ❤️ Contributors

- Favour Emeka <favorodera@gmail.com>
- Favour  Emeka ([@favorodera](https://github.com/favorodera))


## v2.2.5...v3.0.0

[compare changes](https://github.com/favorodera/notform/compare/v2.2.5...v3.0.0)

### Added

- **core:** Add NotMessage component ([3153679](https://github.com/favorodera/notform/commit/3153679))

  - Add NotMessage to render field validation errors
  - Introduce helper to cast public API to instance
  - Support passing public API directly to components

- **core:** Introduce NotField component ([7cd110f](https://github.com/favorodera/notform/commit/7cd110f))

  - Add NotField component for scoped field state
  - Expose syncDirtyState on form instance
  - Update docs demos to use unwrapped state and NotField

- **core:** Add types for NotArrayField component ([317ca55](https://github.com/favorodera/notform/commit/317ca55))

  - Add NotArrayField props, slots, and item types
  - Broaden schema helper bounds to StandardSchemaV1

- **core:** Export NotArrayField component and types ([1275627](https://github.com/favorodera/notform/commit/1275627))

  - Expose array field component from core entry point
  - Allow consumers to use array field definitions

- **core:** Add NotArrayField component and state ([72fbffe](https://github.com/favorodera/notform/commit/72fbffe))

  - add NotArrayField and useNotArrayField composable
  - support stable keys and array state mutations
  - split engine test suite into focused unit tests
  - update documentation and workspace dependencies

- **core:** Support deep nested array field states ([c3882a5](https://github.com/favorodera/notform/commit/c3882a5))

  - recurse isValid, isTouched, and isDirty in arrays
  - remap state at any nesting depth on array mutation
  - update docs and comments for nested array behaviors

- **docs:** Update footer layout and navigation ([99bb7bc](https://github.com/favorodera/notform/commit/99bb7bc))

  - Move playground menu from header to footer
  - Add author details and license info to footer
  - Clean up obsolete TOC footer links

- **docs:** Restructure documentation routing under /docs ([369a2b8](https://github.com/favorodera/notform/commit/369a2b8))

  - Move docs pages under /docs subpath structure
  - Update navigation, search filters, and redirects
  - Refresh header and footer navigation menus
  - Update docs content links and navigation paths

- **docs:** Add interactive repl playground ([152dd9e](https://github.com/favorodera/notform/commit/152dd9e))

  - Add Monaco-based REPL editor component
  - Support URL state synchronization and sharing
  - Add loading spinner component for playground
  - Configure Vite optimization for repl dependencies

- **docs:** Persist playground state to local storage ([a8dd18f](https://github.com/favorodera/notform/commit/a8dd18f))

  - Save playground hash to localStorage across reloads
  - Update Vue import map to Vue 3.5 in REPL
  - Streamline Monaco editor setup and hash sync logic

- **docs:** Improve playground editor setup ([e7721bd](https://github.com/favorodera/notform/commit/e7721bd))

  - Add custom repl workers for Monaco and Vue
  - Extract template code and styles into raw files
  - Expand default playground example with arrays
  - Disable sticky scroll in editor options

- **docs:** Self-host repl web workers ([39e62b7](https://github.com/favorodera/notform/commit/39e62b7))

  - sync repl workers to public assets on install
  - route worker requests to local bundled scripts
  - simplify catalog definitions in pnpm workspace
  - rename playground default template file

- **playground:** Enhance editor with restore functionality ([5657e4f](https://github.com/favorodera/notform/commit/5657e4f))

  - Adds a "Restore" button to the playground editor.
  - Implements logic to save and restore previous REPL states.
  - Removes the static `README.vue` from the playground.
  - Updates ESLint rules for playground templates.
  - Refactors `useLocalStorage` usage in the editor.


### Fixed

- **core:** Ref-count validating fields and reset baseline ([46d63be](https://github.com/favorodera/notform/commit/46d63be))

  - Add ref-counting for concurrent field validation
  - Wipe initialValues clean on reset with nextValues
  - Add comprehensive tests for form instance engine

- **core:** Isolate array errors from item errors ([80279df](https://github.com/favorodera/notform/commit/80279df))

  - Exclude item errors from array field errors
  - Keep isValid checking both array and item errors
  - Document NotArrayField slot properties

- **core:** Normalize validation function outputs ([f71edcf](https://github.com/favorodera/notform/commit/f71edcf))

  - Standardize result format for validation methods
  - Ensure validateField returns only targeted issues
  - Add tests for field-specific validation cases


### Refactors

- **playground:** Replace local apps with online links ([11078b7](https://github.com/favorodera/notform/commit/11078b7))

  - Remove local vue and nuxt playground packages
  - Add StackBlitz links to issue templates and docs
  - Add playground menu button to documentation header
  - Update contributing guide with playground details

- **core:** Simplify architecture and core API ([d659f31](https://github.com/favorodera/notform/commit/d659f31))

  - Remove redundant components and utility files
  - Split form instance creation into composables
  - Modularize internal types and public API

- **core:** Relax NotFormAPI type constraints ([0ea85c7](https://github.com/favorodera/notform/commit/0ea85c7))

  - Remove strict exact property requirement
  - Prevent overly restrictive type matching

- **core:** Extract useNotField composable ([0d876cc](https://github.com/favorodera/notform/commit/0d876cc))

  - extract field logic from component to composable
  - improve type inference across field components

- **core:** Refine internal API and update docs ([2f72562](https://github.com/favorodera/notform/commit/2f72562))

  - expose syncAllDirtyStates in instance
  - omit internal methods from public NotFormAPI
  - update documentation snippets and types description

- **core:** Align field events with slot type ([9e3b84f](https://github.com/favorodera/notform/commit/9e3b84f))

  - Align event bindings directly with slot types
  - Remove unused onMount from field events payload

- **core:** Derive NotFormAPI using Pick ([6b9cf8c](https://github.com/favorodera/notform/commit/6b9cf8c))

  - Simplify public API type by allowlisting members
  - Remove type-fest Except dependency
  - Clean up unnecessary type assertions

- **core:** Reorganize instance factories and tests ([cd26ab4](https://github.com/favorodera/notform/commit/cd26ab4))

  - Move createNotFormInstance to factories
  - Move form instance injection key and provider to utils
  - Extract test helpers and split unit test suites
  - Decouple composable tests from component mounting

- **docs:** Modernize playground and layout setup ([267a55a](https://github.com/favorodera/notform/commit/267a55a))

  - add dedicated playground layout without footer
  - streamline REPL state sync and sharing actions
  - update playground templates and theme tokens
  - replace content-based landing page with components


### Documentation

- **readme:** Update code examples and badges ([39ee348](https://github.com/favorodera/notform/commit/39ee348))

  - Update submit handler and array field examples
  - Refresh badge URLs across documentation READMEs

- Improve branding and clean up demos ([27bfdcd](https://github.com/favorodera/notform/commit/27bfdcd))

  - Capitalize package titles in README headers
  - Remove redundant key display in array demo

- **content:** Restructure and enrich component docs ([b7246e2](https://github.com/favorodera/notform/commit/b7246e2))

  - update markdown formatting and inline code types
  - convert component tables to field-group layouts
  - align not-field slot types and default props

- **not-field:** Simplify event handlers section ([38f85c3](https://github.com/favorodera/notform/commit/38f85c3))

  - Streamline slot event handler documentation

- **not-form:** Restructure component documentation ([999dd80](https://github.com/favorodera/notform/commit/999dd80))

  - Add useNotForm imports in code snippets
  - Reorganize props and slot documentation into API
  - Move component details to introduction section

- **components:** Standardize docs and API structure ([92a0267](https://github.com/favorodera/notform/commit/92a0267))

  - Align NotMessage docs with field-group API style
  - Add template wrappers to component examples
  - Standardize usage sections across components

- **getting-started:** Clarify schema validation ([a12fb7a](https://github.com/favorodera/notform/commit/a12fb7a))

  - Highlight Standard Schema validator support
  - Emphasize flexibility to swap libraries

- **content:** Refine copy and fix indentation ([a16c5f1](https://github.com/favorodera/notform/commit/a16c5f1))

  - Improve readability in installation guide
  - Fix tip block indentation in NotMessage docs

- **docs:** Update guides and add advanced documentation ([1269ed5](https://github.com/favorodera/notform/commit/1269ed5))

  - add guide for AI coding assistant integration
  - add server errors and schema validation docs
  - add demo preview for native NotField component
  - update navigation config and content structure

- **demos:** Remove duplicate label in array demo ([883edd0](https://github.com/favorodera/notform/commit/883edd0))

  - Clean up redundant field label in native demo

- **not-field:** Fix wording in component guide ([daa5436](https://github.com/favorodera/notform/commit/daa5436))

  - clarify description for single property fields

- **not-array-field:** Restructure docs and api ([8c224aa](https://github.com/favorodera/notform/commit/8c224aa))

  - Update component documentation to field-group format
  - Streamline props documentation and inline types
  - Normalize JSDoc comments in type definitions

- **not-array-field:** Correct itemSchema details ([52f946d](https://github.com/favorodera/notform/commit/52f946d))

  - Fix copy-paste error describing the itemSchema prop
  - Clarify schema role in typing mutation methods
  - Provide relevant example for itemSchema usage

- **array-field:** Clarify array field slot properties ([cb05f75](https://github.com/favorodera/notform/commit/cb05f75))

  - Add `lang="ts-type"` to boolean values
  - Clarify `isTouched` and `isDirty` descriptions
  - Update `isValidating` example for better context

- **not-array-field:** Add details for `items` slot prop ([7ba01fd](https://github.com/favorodera/notform/commit/7ba01fd))
- **not-array-field:** Document append method ([4b4d9c9](https://github.com/favorodera/notform/commit/4b4d9c9))

  - document append slot prop and usage example
  - fix MDC field-group nesting formatting

- **components:** Format NotArrayField code examples ([8525cc1](https://github.com/favorodera/notform/commit/8525cc1))

  - Fix indentation in NotArrayField code snippets
  - Remove redundant comment and blank lines

- **not-array-field:** Document prepend and insert ([fdf2659](https://github.com/favorodera/notform/commit/fdf2659))

  - Add documentation for prepend and insert slots
  - Fix missing imports and template tags in examples

- **not-array-field:** Add array operation examples ([f591f01](https://github.com/favorodera/notform/commit/f591f01))

  - Document `remove` operation
  - Document `update` operation
  - Document `swap` operation
  - Document `move` operation

- **not-array-field:** Add caution on using array index as key ([4ec0d02](https://github.com/favorodera/notform/commit/4ec0d02))

  - Explain why using array index as key is problematic
  - Remove redundant example for itemSchema prop
  - Clarify `NotArrayFieldItem` key property

- **native:** Demonstrate nested array fields ([6b7ae40](https://github.com/favorodera/notform/commit/6b7ae40))

  - Support nested arrays in NotArrayField demo
  - Update demo schema to groups containing tags
  - Add UI controls for managing nested tag items

- **apps:** Adjust demo spacing and clean up text ([a82bd01](https://github.com/favorodera/notform/commit/a82bd01))

  - reduce margins in array field demo
  - remove outdated link in schema validation docs

- **use-not-form:** Refactor documentation for clarity and brevity ([2727ce3](https://github.com/favorodera/notform/commit/2727ce3))

  - Improve `useNotForm` composable documentation
  - Use Vue Type hints for better readability
  - Restructure API section to be more concise
  - Remove verbose examples and descriptions

- **use-not-form:** Document return value properties ([f0c5918](https://github.com/favorodera/notform/commit/f0c5918))

  - Document errors, getFieldErrors, and isDirty
  - Provide example usage for isDirty property

- **use-not-form:** Document isSubmitting field ([a1d9673](https://github.com/favorodera/notform/commit/a1d9673))

  - Add isSubmitting state property documentation
  - Clarify isDirty field description for consistency

- **use-not-form:** Document form state flags ([cf449ea](https://github.com/favorodera/notform/commit/cf449ea))

  - Document isTouched, isValid, and isValidating props
  - Provide template examples and usage notes

- **use-not-form:** Specify generic type for return ([acbac5f](https://github.com/favorodera/notform/commit/acbac5f))

  - Clarify NotFormAPI return type generic parameter

- **useNotForm:** Add documentation for reset method ([7d2b839](https://github.com/favorodera/notform/commit/7d2b839))
- **use-not-form:** Document setError method ([8ad880e](https://github.com/favorodera/notform/commit/8ad880e))

  - Add documentation for manual error handling
  - Include usage example for server-side errors

- **use-not-form:** Document setValue and submit ([a0a2de5](https://github.com/favorodera/notform/commit/a0a2de5))

  - Document setValue and submit form methods
  - Clarify behavior around validation and dirty state
  - Refine JSDoc description for setValue in core types

- **docs:** Document useNotForm validate method ([865ad26](https://github.com/favorodera/notform/commit/865ad26))

  - Add documentation for validate return method
  - Describe success and failure behaviors

- **use-not-form:** Document validateField and values ([31761f4](https://github.com/favorodera/notform/commit/31761f4))

  - Document validateField method for single fields
  - Document reactive values property and usage

- **use-not-form:** Embed demo for setError ([fc4e4bf](https://github.com/favorodera/notform/commit/fc4e4bf))

  - Replace static code snippet with live demo preview
  - Remove redundant initialValues in demo component

- **getting-started:** Simplify guides and remove advanced section ([4aea5c9](https://github.com/favorodera/notform/commit/4aea5c9))

  - Move Standard Schema explanation to getting started
  - Streamline installation and quickstart guides
  - Add demo dependency disclaimer to code blocks
  - Remove redundant advanced documentation section

- **nuxt:** Expand nuxt-module getting started guide ([c46184b](https://github.com/favorodera/notform/commit/c46184b))

  - Add multi-PM code groups for CLI and manual setup
  - Clarify auto-imports with before/after examples
  - Detail type safety and SSR hydration behavior
  - Add next steps link to quickstart guide

- **docs:** Clarify AI assistant integration guide ([feb3020](https://github.com/favorodera/notform/commit/feb3020))

  - explain why AI models need fresh docs
  - detail llms.txt vs llms-full.txt use cases
  - add prompt guidance and next steps section

- **not-form:** Clarify behavior and native events ([707bc12](https://github.com/favorodera/notform/commit/707bc12))

  - Explain provide/inject behavior for fields
  - Clarify native submit and reset event handling
  - Document novalidate and slot usage constraints
  - Update spellchecker dictionary entries

- **not-field:** Clarify validation triggers and modes ([3513d3a](https://github.com/favorodera/notform/commit/3513d3a))

  - Document onMount validation trigger behavior
  - Clarify validateOn vs validationMode difference
  - Remove outdated validate method reference
  - Fix indentation in code examples

- **content:** Clarify component rendering behavior ([3d15775](https://github.com/favorodera/notform/commit/3d15775))

  - Clarify renderless vs rendering components
  - Document NotMessage DOM rendering details
  - Explain attribute fallthrough on NotMessage
  - Detail slot behavior for custom as components

- **not-array-field:** Clarify array mutations ([430e950](https://github.com/favorodera/notform/commit/430e950))

  - Add caution about direct array mutations
  - Clarify schema prop usage for type inference
  - Explain errors vs item-level validation
  - Document state handling during array mutations

- **core:** Improve TSDoc formatting and links ([f1bccff](https://github.com/favorodera/notform/commit/f1bccff))

  - Use linkcode tags for symbol references
  - Format multi-line doc comments for readability
  - Clarify prop and slot descriptions

- **playground:** Add documentation and links ([dc86e56](https://github.com/favorodera/notform/commit/dc86e56))

  - add playground and ai usage documentation
  - update issue templates to include docs playground
  - enhance playground seo metadata and layout
  - update contributing and readme links

- **playground:** Update docs and workflow guides ([940119b](https://github.com/favorodera/notform/commit/940119b))

  - streamline issue and pull request templates
  - add guidance for testing pkg.pr.new in playground
  - include README file in default playground template
  - update playground documentation and descriptions

- **navigation:** Update changelog links ([b1e77d4](https://github.com/favorodera/notform/commit/b1e77d4))

  - Remove unused changelog item from header menu
  - Add releases link to docs table of contents footer

- **content:** Update documentation and layout styling ([129cf0c](https://github.com/favorodera/notform/commit/129cf0c))

  - adjust doc styles and footer layout dimensions
  - refine markdown links, code snippets, and tags
  - update vscode settings and recommended extensions

- **core:** Add explanatory inline code comments ([b80aac9](https://github.com/favorodera/notform/commit/b80aac9))

  - Clarify rationale behind array field mutation logic
  - Document validation lifecycle timing and guards
  - Explain reactivity preservation and staleness checks
  - Detail path matching and normalization behavior

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.2.5...v3.0.0-alpha.0

[compare changes](https://github.com/favorodera/notform/compare/v2.2.5...v3.0.0-alpha.0)

### Added

- **core:** Add NotMessage component ([3153679](https://github.com/favorodera/notform/commit/3153679))

  - Add NotMessage to render field validation errors
  - Introduce helper to cast public API to instance
  - Support passing public API directly to components

- **core:** Introduce NotField component ([7cd110f](https://github.com/favorodera/notform/commit/7cd110f))

  - Add NotField component for scoped field state
  - Expose syncDirtyState on form instance
  - Update docs demos to use unwrapped state and NotField

- **core:** Add types for NotArrayField component ([317ca55](https://github.com/favorodera/notform/commit/317ca55))

  - Add NotArrayField props, slots, and item types
  - Broaden schema helper bounds to StandardSchemaV1

- **core:** Export NotArrayField component and types ([1275627](https://github.com/favorodera/notform/commit/1275627))

  - Expose array field component from core entry point
  - Allow consumers to use array field definitions

- **core:** Add NotArrayField component and state ([72fbffe](https://github.com/favorodera/notform/commit/72fbffe))

  - add NotArrayField and useNotArrayField composable
  - support stable keys and array state mutations
  - split engine test suite into focused unit tests
  - update documentation and workspace dependencies

- **core:** Support deep nested array field states ([c3882a5](https://github.com/favorodera/notform/commit/c3882a5))

  - recurse isValid, isTouched, and isDirty in arrays
  - remap state at any nesting depth on array mutation
  - update docs and comments for nested array behaviors

- **docs:** Update footer layout and navigation ([99bb7bc](https://github.com/favorodera/notform/commit/99bb7bc))

  - Move playground menu from header to footer
  - Add author details and license info to footer
  - Clean up obsolete TOC footer links

- **docs:** Restructure documentation routing under /docs ([369a2b8](https://github.com/favorodera/notform/commit/369a2b8))

  - Move docs pages under /docs subpath structure
  - Update navigation, search filters, and redirects
  - Refresh header and footer navigation menus
  - Update docs content links and navigation paths

- **docs:** Add interactive repl playground ([152dd9e](https://github.com/favorodera/notform/commit/152dd9e))

  - Add Monaco-based REPL editor component
  - Support URL state synchronization and sharing
  - Add loading spinner component for playground
  - Configure Vite optimization for repl dependencies

- **docs:** Persist playground state to local storage ([a8dd18f](https://github.com/favorodera/notform/commit/a8dd18f))

  - Save playground hash to localStorage across reloads
  - Update Vue import map to Vue 3.5 in REPL
  - Streamline Monaco editor setup and hash sync logic

- **docs:** Improve playground editor setup ([e7721bd](https://github.com/favorodera/notform/commit/e7721bd))

  - Add custom repl workers for Monaco and Vue
  - Extract template code and styles into raw files
  - Expand default playground example with arrays
  - Disable sticky scroll in editor options

- **docs:** Self-host repl web workers ([39e62b7](https://github.com/favorodera/notform/commit/39e62b7))

  - sync repl workers to public assets on install
  - route worker requests to local bundled scripts
  - simplify catalog definitions in pnpm workspace
  - rename playground default template file

- **playground:** Enhance editor with restore functionality ([5657e4f](https://github.com/favorodera/notform/commit/5657e4f))

  - Adds a "Restore" button to the playground editor.
  - Implements logic to save and restore previous REPL states.
  - Removes the static `README.vue` from the playground.
  - Updates ESLint rules for playground templates.
  - Refactors `useLocalStorage` usage in the editor.


### Fixed

- **core:** Ref-count validating fields and reset baseline ([46d63be](https://github.com/favorodera/notform/commit/46d63be))

  - Add ref-counting for concurrent field validation
  - Wipe initialValues clean on reset with nextValues
  - Add comprehensive tests for form instance engine

- **core:** Isolate array errors from item errors ([80279df](https://github.com/favorodera/notform/commit/80279df))

  - Exclude item errors from array field errors
  - Keep isValid checking both array and item errors
  - Document NotArrayField slot properties

- **core:** Normalize validation function outputs ([f71edcf](https://github.com/favorodera/notform/commit/f71edcf))

  - Standardize result format for validation methods
  - Ensure validateField returns only targeted issues
  - Add tests for field-specific validation cases


### Refactors

- **playground:** Replace local apps with online links ([11078b7](https://github.com/favorodera/notform/commit/11078b7))

  - Remove local vue and nuxt playground packages
  - Add StackBlitz links to issue templates and docs
  - Add playground menu button to documentation header
  - Update contributing guide with playground details

- **core:** Simplify architecture and core API ([d659f31](https://github.com/favorodera/notform/commit/d659f31))

  - Remove redundant components and utility files
  - Split form instance creation into composables
  - Modularize internal types and public API

- **core:** Relax NotFormAPI type constraints ([0ea85c7](https://github.com/favorodera/notform/commit/0ea85c7))

  - Remove strict exact property requirement
  - Prevent overly restrictive type matching

- **core:** Extract useNotField composable ([0d876cc](https://github.com/favorodera/notform/commit/0d876cc))

  - extract field logic from component to composable
  - improve type inference across field components

- **core:** Refine internal API and update docs ([2f72562](https://github.com/favorodera/notform/commit/2f72562))

  - expose syncAllDirtyStates in instance
  - omit internal methods from public NotFormAPI
  - update documentation snippets and types description

- **core:** Align field events with slot type ([9e3b84f](https://github.com/favorodera/notform/commit/9e3b84f))

  - Align event bindings directly with slot types
  - Remove unused onMount from field events payload

- **core:** Derive NotFormAPI using Pick ([6b9cf8c](https://github.com/favorodera/notform/commit/6b9cf8c))

  - Simplify public API type by allowlisting members
  - Remove type-fest Except dependency
  - Clean up unnecessary type assertions

- **core:** Reorganize instance factories and tests ([cd26ab4](https://github.com/favorodera/notform/commit/cd26ab4))

  - Move createNotFormInstance to factories
  - Move form instance injection key and provider to utils
  - Extract test helpers and split unit test suites
  - Decouple composable tests from component mounting

- **docs:** Modernize playground and layout setup ([267a55a](https://github.com/favorodera/notform/commit/267a55a))

  - add dedicated playground layout without footer
  - streamline REPL state sync and sharing actions
  - update playground templates and theme tokens
  - replace content-based landing page with components


### Documentation

- **readme:** Update code examples and badges ([39ee348](https://github.com/favorodera/notform/commit/39ee348))

  - Update submit handler and array field examples
  - Refresh badge URLs across documentation READMEs

- Improve branding and clean up demos ([27bfdcd](https://github.com/favorodera/notform/commit/27bfdcd))

  - Capitalize package titles in README headers
  - Remove redundant key display in array demo

- **content:** Restructure and enrich component docs ([b7246e2](https://github.com/favorodera/notform/commit/b7246e2))

  - update markdown formatting and inline code types
  - convert component tables to field-group layouts
  - align not-field slot types and default props

- **not-field:** Simplify event handlers section ([38f85c3](https://github.com/favorodera/notform/commit/38f85c3))

  - Streamline slot event handler documentation

- **not-form:** Restructure component documentation ([999dd80](https://github.com/favorodera/notform/commit/999dd80))

  - Add useNotForm imports in code snippets
  - Reorganize props and slot documentation into API
  - Move component details to introduction section

- **components:** Standardize docs and API structure ([92a0267](https://github.com/favorodera/notform/commit/92a0267))

  - Align NotMessage docs with field-group API style
  - Add template wrappers to component examples
  - Standardize usage sections across components

- **getting-started:** Clarify schema validation ([a12fb7a](https://github.com/favorodera/notform/commit/a12fb7a))

  - Highlight Standard Schema validator support
  - Emphasize flexibility to swap libraries

- **content:** Refine copy and fix indentation ([a16c5f1](https://github.com/favorodera/notform/commit/a16c5f1))

  - Improve readability in installation guide
  - Fix tip block indentation in NotMessage docs

- **docs:** Update guides and add advanced documentation ([1269ed5](https://github.com/favorodera/notform/commit/1269ed5))

  - add guide for AI coding assistant integration
  - add server errors and schema validation docs
  - add demo preview for native NotField component
  - update navigation config and content structure

- **demos:** Remove duplicate label in array demo ([883edd0](https://github.com/favorodera/notform/commit/883edd0))

  - Clean up redundant field label in native demo

- **not-field:** Fix wording in component guide ([daa5436](https://github.com/favorodera/notform/commit/daa5436))

  - clarify description for single property fields

- **not-array-field:** Restructure docs and api ([8c224aa](https://github.com/favorodera/notform/commit/8c224aa))

  - Update component documentation to field-group format
  - Streamline props documentation and inline types
  - Normalize JSDoc comments in type definitions

- **not-array-field:** Correct itemSchema details ([52f946d](https://github.com/favorodera/notform/commit/52f946d))

  - Fix copy-paste error describing the itemSchema prop
  - Clarify schema role in typing mutation methods
  - Provide relevant example for itemSchema usage

- **array-field:** Clarify array field slot properties ([cb05f75](https://github.com/favorodera/notform/commit/cb05f75))

  - Add `lang="ts-type"` to boolean values
  - Clarify `isTouched` and `isDirty` descriptions
  - Update `isValidating` example for better context

- **not-array-field:** Add details for `items` slot prop ([7ba01fd](https://github.com/favorodera/notform/commit/7ba01fd))
- **not-array-field:** Document append method ([4b4d9c9](https://github.com/favorodera/notform/commit/4b4d9c9))

  - document append slot prop and usage example
  - fix MDC field-group nesting formatting

- **components:** Format NotArrayField code examples ([8525cc1](https://github.com/favorodera/notform/commit/8525cc1))

  - Fix indentation in NotArrayField code snippets
  - Remove redundant comment and blank lines

- **not-array-field:** Document prepend and insert ([fdf2659](https://github.com/favorodera/notform/commit/fdf2659))

  - Add documentation for prepend and insert slots
  - Fix missing imports and template tags in examples

- **not-array-field:** Add array operation examples ([f591f01](https://github.com/favorodera/notform/commit/f591f01))

  - Document `remove` operation
  - Document `update` operation
  - Document `swap` operation
  - Document `move` operation

- **not-array-field:** Add caution on using array index as key ([4ec0d02](https://github.com/favorodera/notform/commit/4ec0d02))

  - Explain why using array index as key is problematic
  - Remove redundant example for itemSchema prop
  - Clarify `NotArrayFieldItem` key property

- **native:** Demonstrate nested array fields ([6b7ae40](https://github.com/favorodera/notform/commit/6b7ae40))

  - Support nested arrays in NotArrayField demo
  - Update demo schema to groups containing tags
  - Add UI controls for managing nested tag items

- **apps:** Adjust demo spacing and clean up text ([a82bd01](https://github.com/favorodera/notform/commit/a82bd01))

  - reduce margins in array field demo
  - remove outdated link in schema validation docs

- **use-not-form:** Refactor documentation for clarity and brevity ([2727ce3](https://github.com/favorodera/notform/commit/2727ce3))

  - Improve `useNotForm` composable documentation
  - Use Vue Type hints for better readability
  - Restructure API section to be more concise
  - Remove verbose examples and descriptions

- **use-not-form:** Document return value properties ([f0c5918](https://github.com/favorodera/notform/commit/f0c5918))

  - Document errors, getFieldErrors, and isDirty
  - Provide example usage for isDirty property

- **use-not-form:** Document isSubmitting field ([a1d9673](https://github.com/favorodera/notform/commit/a1d9673))

  - Add isSubmitting state property documentation
  - Clarify isDirty field description for consistency

- **use-not-form:** Document form state flags ([cf449ea](https://github.com/favorodera/notform/commit/cf449ea))

  - Document isTouched, isValid, and isValidating props
  - Provide template examples and usage notes

- **use-not-form:** Specify generic type for return ([acbac5f](https://github.com/favorodera/notform/commit/acbac5f))

  - Clarify NotFormAPI return type generic parameter

- **useNotForm:** Add documentation for reset method ([7d2b839](https://github.com/favorodera/notform/commit/7d2b839))
- **use-not-form:** Document setError method ([8ad880e](https://github.com/favorodera/notform/commit/8ad880e))

  - Add documentation for manual error handling
  - Include usage example for server-side errors

- **use-not-form:** Document setValue and submit ([a0a2de5](https://github.com/favorodera/notform/commit/a0a2de5))

  - Document setValue and submit form methods
  - Clarify behavior around validation and dirty state
  - Refine JSDoc description for setValue in core types

- **docs:** Document useNotForm validate method ([865ad26](https://github.com/favorodera/notform/commit/865ad26))

  - Add documentation for validate return method
  - Describe success and failure behaviors

- **use-not-form:** Document validateField and values ([31761f4](https://github.com/favorodera/notform/commit/31761f4))

  - Document validateField method for single fields
  - Document reactive values property and usage

- **use-not-form:** Embed demo for setError ([fc4e4bf](https://github.com/favorodera/notform/commit/fc4e4bf))

  - Replace static code snippet with live demo preview
  - Remove redundant initialValues in demo component

- **getting-started:** Simplify guides and remove advanced section ([4aea5c9](https://github.com/favorodera/notform/commit/4aea5c9))

  - Move Standard Schema explanation to getting started
  - Streamline installation and quickstart guides
  - Add demo dependency disclaimer to code blocks
  - Remove redundant advanced documentation section

- **nuxt:** Expand nuxt-module getting started guide ([c46184b](https://github.com/favorodera/notform/commit/c46184b))

  - Add multi-PM code groups for CLI and manual setup
  - Clarify auto-imports with before/after examples
  - Detail type safety and SSR hydration behavior
  - Add next steps link to quickstart guide

- **docs:** Clarify AI assistant integration guide ([feb3020](https://github.com/favorodera/notform/commit/feb3020))

  - explain why AI models need fresh docs
  - detail llms.txt vs llms-full.txt use cases
  - add prompt guidance and next steps section

- **not-form:** Clarify behavior and native events ([707bc12](https://github.com/favorodera/notform/commit/707bc12))

  - Explain provide/inject behavior for fields
  - Clarify native submit and reset event handling
  - Document novalidate and slot usage constraints
  - Update spellchecker dictionary entries

- **not-field:** Clarify validation triggers and modes ([3513d3a](https://github.com/favorodera/notform/commit/3513d3a))

  - Document onMount validation trigger behavior
  - Clarify validateOn vs validationMode difference
  - Remove outdated validate method reference
  - Fix indentation in code examples

- **content:** Clarify component rendering behavior ([3d15775](https://github.com/favorodera/notform/commit/3d15775))

  - Clarify renderless vs rendering components
  - Document NotMessage DOM rendering details
  - Explain attribute fallthrough on NotMessage
  - Detail slot behavior for custom as components

- **not-array-field:** Clarify array mutations ([430e950](https://github.com/favorodera/notform/commit/430e950))

  - Add caution about direct array mutations
  - Clarify schema prop usage for type inference
  - Explain errors vs item-level validation
  - Document state handling during array mutations

- **core:** Improve TSDoc formatting and links ([f1bccff](https://github.com/favorodera/notform/commit/f1bccff))

  - Use linkcode tags for symbol references
  - Format multi-line doc comments for readability
  - Clarify prop and slot descriptions

- **playground:** Add documentation and links ([dc86e56](https://github.com/favorodera/notform/commit/dc86e56))

  - add playground and ai usage documentation
  - update issue templates to include docs playground
  - enhance playground seo metadata and layout
  - update contributing and readme links

- **playground:** Update docs and workflow guides ([940119b](https://github.com/favorodera/notform/commit/940119b))

  - streamline issue and pull request templates
  - add guidance for testing pkg.pr.new in playground
  - include README file in default playground template
  - update playground documentation and descriptions

- **navigation:** Update changelog links ([b1e77d4](https://github.com/favorodera/notform/commit/b1e77d4))

  - Remove unused changelog item from header menu
  - Add releases link to docs table of contents footer

- **content:** Update documentation and layout styling ([129cf0c](https://github.com/favorodera/notform/commit/129cf0c))

  - adjust doc styles and footer layout dimensions
  - refine markdown links, code snippets, and tags
  - update vscode settings and recommended extensions

- **core:** Add explanatory inline code comments ([b80aac9](https://github.com/favorodera/notform/commit/b80aac9))

  - Clarify rationale behind array field mutation logic
  - Document validation lifecycle timing and guards
  - Explain reactivity preservation and staleness checks
  - Detail path matching and normalization behavior

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.2.4...v2.2.5

[compare changes](https://github.com/favorodera/notform/compare/v2.2.4...v2.2.5)

### Fixed

- **form:** Prevent native form reset event ([d5ed5e2](https://github.com/favorodera/notform/commit/d5ed5e2))

  - Avoid native reset clearing restored input values
  - Preserve managed form state on reset trigger

- **form:** Prevent native form reset event ([#80](https://github.com/favorodera/notform/pull/80))

### ❤️ Contributors

- Favour  Emeka ([@favorodera](https://github.com/favorodera))
- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.2.3...v2.2.4

[compare changes](https://github.com/favorodera/notform/compare/v2.2.3...v2.2.4)

### Fixed

- **core:** Track field validation cycles separately ([379963c](https://github.com/favorodera/notform/commit/379963c))

  - allow concurrent field validations without drops
  - invalidate pending validations when form resets


### Refactors

- **core:** Handle concurrent validation cycles ([0f85251](https://github.com/favorodera/notform/commit/0f85251))

  - Track validation cycles to ignore stale results
  - Restructure core unit tests into subdirectories
  - Bump minimum Node engine requirement to v24

- **core:** Handle concurrent validation cycles ([#79](https://github.com/favorodera/notform/pull/79))

### Documentation

- Update READMEs with usage and setup guides ([551fb0e](https://github.com/favorodera/notform/commit/551fb0e))

  - Refresh root and package READMEs documentation
  - Add explicit Quick Start and Nuxt examples
  - Clarify package roles and requirements
  - Update badge links and development commands

### ❤️ Contributors

- Favour  Emeka ([@favorodera](https://github.com/favorodera))
- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.2.2...v2.2.3

[compare changes](https://github.com/favorodera/notform/compare/v2.2.2...v2.2.3)

### Added

- **docs:** Add unified header with github stars count ([7b55b41](https://github.com/favorodera/notform/commit/7b55b41))

  - Unify landing and docs headers into single component
  - Add cached API endpoint to fetch GitHub stars count
  - Display live star count in the header action button

- **docs:** Add markdown context exporter component ([e1c5a7e](https://github.com/favorodera/notform/commit/e1c5a7e))

  - Add dropdown menu to export markdown and AI prompts
  - Move clipboard logic out of slug page into component
  - Fix content renderer data binding on docs page

- **docs:** Enhance documentation layout and links ([03ade37](https://github.com/favorodera/notform/commit/03ade37))

  - Add Grok option to context exporter
  - Add TOC footer links for editing, star, and releases
  - Update Claude icon in context exporter
  - Refine surround link text styling

- **docs:** Add github sponsor links ([251d06b](https://github.com/favorodera/notform/commit/251d06b))

  - Add sponsor config under github settings
  - Add sponsor button with tooltip in header
  - Add sponsor link to documentation toc footer


### Fixed

- **docs:** Update OG image component reference ([ef4f602](https://github.com/favorodera/notform/commit/ef4f602))

  - Update OgImage component prefix in template calls
  - Apply code formatting to docs components and content

- **docs:** Span footer border across full width ([31d83e9](https://github.com/favorodera/notform/commit/31d83e9))

  - Wrap container in native footer element
  - Allow top border to stretch across full viewport


### Refactors

- **docs:** Simplify useAsyncData usage across app ([30560ff](https://github.com/favorodera/notform/commit/30560ff))

  - Avoid destructuring data from useAsyncData calls
  - Remove unused search logic from error page
  - Streamline appConfig and clipboard composable calls

- **docs:** Switch markdown copy icons to tabler ([c040966](https://github.com/favorodera/notform/commit/c040966))

  - Replace lucide icons with tabler icons
  - Add @iconify-json/tabler dependency

- **docs:** Simplify landing page animation logic ([2045b70](https://github.com/favorodera/notform/commit/2045b70))

  - Clean up unused animation variants in why-notform
  - Inline Motion properties with staggered delays
  - Format transition ease arrays consistently

- **docs:** Revise README for notform branding and description ([3d3f0bf](https://github.com/favorodera/notform/commit/3d3f0bf))

  Updated the README to reflect changes in branding and integration.

- **docs:** Keep copy button label static ([32acfd6](https://github.com/favorodera/notform/commit/32acfd6))

  - Keep button text consistent after copying
  - Rely on icon change to indicate success
  - Prevent layout shift from label length changes


### Documentation

- **site:** Revamp documentation and ui theme ([fb1eb1d](https://github.com/favorodera/notform/commit/fb1eb1d))

  - Reorganize getting started and advanced guides
  - Update demos to use native form elements
  - Refresh docs theme, styling, and icon set
  - Add ai-models reference guide for llms
  - Improve readme and contributing instructions

- **advanced:** Expand guides and update demo components ([816afc1](https://github.com/favorodera/notform/commit/816afc1))

  - Rewrite validation, server error, and schema guides
  - Refactor native demo components with data attributes
  - Add nuxtseo-layer-devtools to docs dependencies

- **app:** Refresh branding, og-images, and content ([242722b](https://github.com/favorodera/notform/commit/242722b))

  - consolidate og-image into a single component
  - update favicon and application icons
  - format and clean up documentation content
  - update eslint configurations

- **content:** Streamline quickstart and array field docs ([18e0921](https://github.com/favorodera/notform/commit/18e0921))

  - Simplify heading in quickstart guide
  - Remove redundant basic usage section from array field

- **quickstart:** Update next steps links ([c4d6ef2](https://github.com/favorodera/notform/commit/c4d6ef2))

  - Fix broken navigation links in quickstart guide
  - Clean up array formatting in landing components

- Revamp documentation structure and styling ([4a68d12](https://github.com/favorodera/notform/commit/4a68d12))

  - Restructure docs navigation and content sections
  - Add UI library integration guides and examples
  - Update landing page components and design system
  - Refresh project READMEs and contribution guide

- **core:** Format library title in README ([045be98](https://github.com/favorodera/notform/commit/045be98))
- **docs:** Wrap notes in callout components ([79e9814](https://github.com/favorodera/notform/commit/79e9814))

  - Wrap notes and cautions in Nuxt callout blocks
  - Improve visual hierarchy and reader emphasis


### Chores

- Update dependencies and editor configuration ([d8fb67a](https://github.com/favorodera/notform/commit/d8fb67a))

  - Add shared VS Code settings and extensions
  - Upgrade pnpm, ESLint, Vitest, and workspace tools
  - Improve submit event typing in core package
  - Refine reactive refs and cleanup in components

- **docs:** Remove MCP toolkit integration ([4685787](https://github.com/favorodera/notform/commit/4685787))

  - Remove unused `@nuxtjs/mcp-toolkit` module
  - Delete page search and retrieval MCP tools

- **turbo:** Remove build dep from postinstall ([6302f87](https://github.com/favorodera/notform/commit/6302f87))

  - Prevent unnecessary upstream builds on install
  - Avoid circular dependencies and speed up setup

- **docs:** Remove Grok export option ([4e8b811](https://github.com/favorodera/notform/commit/4e8b811))

  - Remove Grok link from context exporter menu

- **turbo:** Add build dependency to postinstall ([860fb5a](https://github.com/favorodera/notform/commit/860fb5a))

  - Ensure dependencies build before postinstall runs


### Styling

- **docs:** Add missing trailing comma in context exporter ([3d8cc77](https://github.com/favorodera/notform/commit/3d8cc77))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
- Favour  Emeka ([@favorodera](https://github.com/favorodera))


## v2.2.1...v2.2.2

[compare changes](https://github.com/favorodera/notform/compare/v2.2.1...v2.2.2)

### Chores

- **ci:** Streamline release workflow and dependencies ([a253181](https://github.com/favorodera/notform/commit/a253181))

  - Simplify release workflow inputs and validation
  - Update catalog dependencies and lockfile
  - Clean up redundant package gitignore files
  - Adjust turbo task pipeline dependencies

- **turbo:** Add build dependency to postinstall ([90ebdc4](https://github.com/favorodera/notform/commit/90ebdc4))

  - Ensure dependencies build before postinstall runs

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.2.0...v2.2.1

[compare changes](https://github.com/favorodera/notform/compare/v2.2.0...v2.2.1)

No relevant changes for this release


## v2.1.3...v2.2.0

[compare changes](https://github.com/favorodera/notform/compare/v2.1.3...v2.2.0)

### Added

- **core:** Maintain field state during array mutations ([ea6a00c](https://github.com/favorodera/notform/commit/ea6a00c))

  - Track errors, touched, and dirty state by item
  - Remap indices when array items move or are removed
  - Add remapArrayFieldState utility for mutations
  - Update tests to verify state persistence

- **playground:** Add item move support to array fields ([2a48fdc](https://github.com/favorodera/notform/commit/2a48fdc))

  - Implement move buttons for array field items
  - Enable move function in NotArrayField slots
  - Update playground dependencies and scripts


### Refactors

- **docs:** Improve code style and project structure ([7e83376](https://github.com/favorodera/notform/commit/7e83376))

  - Add documentation README
  - Refactor async data fetching for consistency
  - Add explicit 404 error handling for missing pages
  - Update linting rules and package scripts
  - Standardize code formatting across server and app

- **docs:** Remove UI component prefixes ([6d55e42](https://github.com/favorodera/notform/commit/6d55e42))

  - Remove U-prefix from components for cleaner syntax
  - Update CSS utilities to align with component names
  - Refactor demo code loading to support .vue extensions
  - Standardize form demo structures and reset logic

- **core:** Simplify validationMode configuration ([0ab49c7](https://github.com/favorodera/notform/commit/0ab49c7))

  - Change validationMode from object to string union
  - Update internal logic to check mode directly
  - Synchronize documentation and demo components

- **core:** Improve readability of error removal loop ([5352c60](https://github.com/favorodera/notform/commit/5352c60))

  - rename loop variable for better clarity

- **nuxt:** Consolidate package dependencies ([fca865d](https://github.com/favorodera/notform/commit/fca865d))

  - Move notform-nuxt to dependencies
  - Remove direct dependency on core package
  - Update module to resolve paths dynamically
  - Clean up documentation and workspace references


### Documentation

- **template:** Update PR template instructions ([867177e](https://github.com/favorodera/notform/commit/867177e))

  - Clarify issue linking syntax in PR template

- **readme:** Update pipeline order and fix zod examples ([ef1170a](https://github.com/favorodera/notform/commit/ef1170a))
- **template:** Remove emojis from issue template names ([6d9e01f](https://github.com/favorodera/notform/commit/6d9e01f))

### Chores

- **renovate:** Update configuration preset path ([26f6319](https://github.com/favorodera/notform/commit/26f6319))
- **repo:** Update dependencies and project structure ([7d1298a](https://github.com/favorodera/notform/commit/7d1298a))

  - Upgrade dependencies and CI workflows
  - Improve form component UX and accessibility
  - Standardize issue templates and documentation
  - Refactor playground styles and configurations

- **issue-templates:** Migrate templates to YAML ([e4ef3ef](https://github.com/favorodera/notform/commit/e4ef3ef))

  - Replace markdown templates with YAML forms
  - Improve input validation for issue reports
  - Standardize issue submission process

- **docs:** Fix nuxt config formatting and newline ([d8f3512](https://github.com/favorodera/notform/commit/d8f3512))

  - Standardize icon component name configuration
  - Add missing newline to demo-code component file

- **docs:** Improve documentation and refactor demos ([7f3cecc](https://github.com/favorodera/notform/commit/7f3cecc))

  - Standardize documentation layout and formatting
  - Refactor demo components to use consistent patterns
  - Update CI release workflow to use correct secrets
  - Improve overall clarity and readability of docs

- **ci:** Update pkg-pr-new publish configuration ([e280ca2](https://github.com/favorodera/notform/commit/e280ca2))

  - Enable multi-package manager support for previews
  - Ensure compatibility across different environments


### Styling

- **core:** Fix indentation in NotFieldSlots documentation ([944cd61](https://github.com/favorodera/notform/commit/944cd61))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.1.2...v2.1.3

[compare changes](https://github.com/favorodera/notform/compare/v2.1.2...v2.1.3)

### Fixed

- **core:** Correct eager validation trigger logic ([075322c](https://github.com/favorodera/notform/commit/075322c))

  - Fix validation check to rely on eager mode
  - Ensure revalidation only occurs when in eager mode

- **core:** Correct eager validation trigger logic ([#53](https://github.com/favorodera/notform/pull/53))

### ❤️ Contributors

- Favour  Emeka ([@favorodera](https://github.com/favorodera))
- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.1.1...v2.1.2

[compare changes](https://github.com/favorodera/notform/compare/v2.1.1...v2.1.2)

### Added

- **docs:** Lazy load markdown content for clipboard ([2cb1647](https://github.com/favorodera/notform/commit/2cb1647))

  - use async data to fetch markdown content
  - update clipboard source to use computed value

- **core:** Enhance NotMessage and fix array key logic ([3739cc9](https://github.com/favorodera/notform/commit/3739cc9))

  - Add 'as' prop to NotMessage for custom tag rendering
  - Remove timestamps from array field keys
  - Fix array mutation order to prevent sync issues
  - Update validation trigger logic in NotField


### Refactors

- **core:** Cleanup code and types ([158bb3e](https://github.com/favorodera/notform/commit/158bb3e))

  - remove unused runtime files from nuxt package
  - clean up code comments and type definitions
  - standardize formatting and indentation
  - remove redundant eslint-disable comments

- **use-not-form:** Improve documentation and clean up code structure ([87b09ec](https://github.com/favorodera/notform/commit/87b09ec))
- **core:** Simplify component slots and attributes ([e9dc2df](https://github.com/favorodera/notform/commit/e9dc2df))

  - Remove unused useAttrs and inheritAttrs: false
  - Refactor NotField to use shorthand slot props
  - Simplify NotMessage rendering and remove as prop
  - Standardize internal component code style

- **core:** Cleanup NotArrayField component ([e297200](https://github.com/favorodera/notform/commit/e297200))

  - Refactor template to use scoped slot shorthand
  - Improve code readability and organization
  - Update variable naming and structure
  - Clean up unused type definitions

- **nuxt:** Migrate to direct dependency on notform ([6aad8d8](https://github.com/favorodera/notform/commit/6aad8d8))

  - Remove runtime wrapper files for components and composables
  - Update module to import directly from notform
  - Update dependencies to include notform as peer
  - Clean up playground and docs configurations

- **docs:** Remove as prop and fix type casts ([87e965a](https://github.com/favorodera/notform/commit/87e965a))

  - remove as prop from NotMessage documentation
  - add eslint ignores for event type casts in server

- **docs:** Switch to lazy loading for data fetching ([4ebbb26](https://github.com/favorodera/notform/commit/4ebbb26))

  - Update data fetching to use lazy mode
  - Disable server-side rendering for data
  - Enable default navigation expansion
  - Update dependency versions and lockfile


### Documentation

- **components:** Add as prop documentation for NotMessage ([7bd8ecc](https://github.com/favorodera/notform/commit/7bd8ecc))

  - document the as property for NotMessage component

- **components:** Remove attributes field from NotMessage ([7f673f6](https://github.com/favorodera/notform/commit/7f673f6))

### Chores

- **lint:** Migrate to shared eslint configuration ([1c8c5df](https://github.com/favorodera/notform/commit/1c8c5df))

  - Replace local configs with unified factory setup
  - Update dependencies for consistent linting
  - Add missing eslint configuration files
  - Remove redundant legacy config files


### Styling

- **core:** Fix formatting in components ([40a3775](https://github.com/favorodera/notform/commit/40a3775))

  - remove extra newline in not-array-field
  - add spacing to interpolation in not-message

- **repo:** Fix indentation and formatting across codebase ([4c7f460](https://github.com/favorodera/notform/commit/4c7f460))

  - Fix indentation in tests and playgrounds
  - Reorder peer dependencies in nuxt package
  - Reorder dependencies in pnpm workspace catalog

- **docs:** Clean up whitespace and formatting ([7fd99d6](https://github.com/favorodera/notform/commit/7fd99d6))

  - fix indentation in slug page
  - remove redundant empty component tag in markdown

- **ui:** Fix indentation and whitespace issues ([ce42a24](https://github.com/favorodera/notform/commit/ce42a24))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.1.0...v2.1.1

[compare changes](https://github.com/favorodera/notform/compare/v2.1.0...v2.1.1)

### Added

- **docs:** Set dev server port to 3000 ([84a680e](https://github.com/favorodera/notform/commit/84a680e))

  - configure port 3000 in nuxt config

- **playground:** Add nuxt and vue playgrounds ([a4b05aa](https://github.com/favorodera/notform/commit/a4b05aa))

  - initialize nuxt playground with basic form setup
  - initialize vue playground with core form usage
  - add configuration for both playground environments

- **docs:** Add nuxt-og-image and update dependencies ([a60a883](https://github.com/favorodera/notform/commit/a60a883))

  - Install nuxt-og-image for social preview generation
  - Update magicast to 0.5.3
  - Sync lockfile with updated dependencies


### Refactors

- **nuxt:** Update vite optimization strategy ([a7a37d4](https://github.com/favorodera/notform/commit/a7a37d4))

  - Remove manual exclude of notform package
  - Add dequal and dot-prop to vite optimizeDeps
  - Use extendViteConfig for better compatibility

- **nuxt:** Remove vite dependency pre-bundling ([7a06674](https://github.com/favorodera/notform/commit/7a06674))

  - remove optimizeDeps configuration for dependencies
  - update documentation to reflect changes


### Documentation

- **contributing:** Update node and pnpm versions ([95d1c51](https://github.com/favorodera/notform/commit/95d1c51))

  - remove outdated table of contents
  - update node requirement to v20
  - update pnpm requirement to v11

- **readme:** Overhaul documentation and structure ([d31feea](https://github.com/favorodera/notform/commit/d31feea))

  - Update README layout and branding
  - Clarify monorepo structure and packages
  - Improve developer setup instructions
  - Add useful command reference table
  - Standardize badge styling and links

- **core:** Overhaul package README documentation ([5726396](https://github.com/favorodera/notform/commit/5726396))

  - Add detailed usage guide and code examples
  - List supported validation libraries
  - Include installation instructions
  - Improve project overview and feature list

- **nuxt:** Update README with installation and usage ([9e56bfd](https://github.com/favorodera/notform/commit/9e56bfd))

### Chores

- **workspace:** Update pnpm configuration and catalog ([b3f8500](https://github.com/favorodera/notform/commit/b3f8500))

  - Add playgrounds directory to packages
  - Define peer dependency rules for vite and ts
  - Migrate built dependencies to allowBuilds
  - Add project dependencies to catalog

- **docs:** Update dependencies and engine config ([d32d2a4](https://github.com/favorodera/notform/commit/d32d2a4))

  - sync vue-tsc to workspace catalog
  - enforce pnpm version constraint

- **apps:** Remove legacy playground applications ([bf2c7bc](https://github.com/favorodera/notform/commit/bf2c7bc))

  - Remove nuxt-playground application
  - Remove vue-playground application

- **core:** Sync dependencies with catalog ([2384d59](https://github.com/favorodera/notform/commit/2384d59))

  - update core devDependencies to catalog
  - update pnpm engine version requirement

- **docs:** Update nuxt dependency to catalog ([8b7f0ec](https://github.com/favorodera/notform/commit/8b7f0ec))
- **docs:** Upgrade nuxt to 4.4.6 and update catalog ([c2e6747](https://github.com/favorodera/notform/commit/c2e6747))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0...v2.1.0

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0...v2.1.0)

### Added

- Add npm shields to README ([0dcab4f](https://github.com/favorodera/notform/commit/0dcab4f))
- Define dark mode UI background ([e04888e](https://github.com/favorodera/notform/commit/e04888e))

### Refactors

- Simplify navigation prop in header component ([989f82a](https://github.com/favorodera/notform/commit/989f82a))
- Update command to install notform ([7b941ee](https://github.com/favorodera/notform/commit/7b941ee))
- Inline event handlers in slotProps ([3c441cc](https://github.com/favorodera/notform/commit/3c441cc))
- Inline NotField event types ([b655632](https://github.com/favorodera/notform/commit/b655632))

### Documentation

- Update Node.js prerequisite to v22 ([6b13b57](https://github.com/favorodera/notform/commit/6b13b57))
- Improve LLMs.txt documentation formatting and linking ([76368eb](https://github.com/favorodera/notform/commit/76368eb))
- Wrap Vue template examples in <template> tags ([9a7e6f7](https://github.com/favorodera/notform/commit/9a7e6f7))
- Wrap Vue template examples in <template> tags ([#43](https://github.com/favorodera/notform/pull/43))

  ## Description
  <!-- Describe your changes in detail -->
  ## Related Issue
  <!-- Link to the issue this PR addresses, if applicable -->
  Fixes #
  ## Type of Change
  <!-- Mark with an 'x' all that apply -->
  - [ ] Bug fix (non-breaking change which fixes an issue)
  - [ ] New feature (non-breaking change which adds functionality)
  - [ ] Breaking change (fix or feature that would cause existing
  functionality to not work as expected)
  - [x] Documentation update
  - [ ] Code refactor (no functional changes)
  - [ ] Test update
  - [ ] Build/CI configuration
  ## Checklist
  <!-- Mark with an 'x' all that apply -->
  - [x] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guidelines
  - [x] My code follows the project's code style
  - [ ] I have added tests that prove my fix is effective or that my
  feature works
  - [x] I have run `pnpm ready`
  - [x] New and existing unit tests pass locally with my changes
  - [x] I have updated the documentation accordingly
  ## Screenshots / Recordings
  <!-- If applicable, add screenshots or recordings to help explain your
  changes -->
  ## Additional Notes
  <!-- Add any additional notes for reviewers -->

- Add 'Working with AI' pages to docs llms ([4496fc3](https://github.com/favorodera/notform/commit/4496fc3))
- Add 'Working with AI' pages to docs llms ([#44](https://github.com/favorodera/notform/pull/44))

  ## Description
  This PR adds the AI section of the docs to the LLMS config in the docs
  nuxt config
  ## Related Issue
  <!-- Link to the issue this PR addresses, if applicable -->
  Fixes #
  ## Type of Change
  <!-- Mark with an 'x' all that apply -->
  - [ ] Bug fix (non-breaking change which fixes an issue)
  - [ ] New feature (non-breaking change which adds functionality)
  - [ ] Breaking change (fix or feature that would cause existing
  functionality to not work as expected)
  - [x] Documentation update
  - [x] Code refactor (no functional changes)
  - [ ] Test update
  - [ ] Build/CI configuration
  ## Checklist
  <!-- Mark with an 'x' all that apply -->
  - [x] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guidelines
  - [x] My code follows the project's code style
  - [ ] I have added tests that prove my fix is effective or that my
  feature works
  - [x] I have run `pnpm ready`
  - [x] New and existing unit tests pass locally with my changes
  - [x] I have updated the documentation accordingly
  ## Screenshots / Recordings
  <!-- If applicable, add screenshots or recordings to help explain your
  changes -->
  ## Additional Notes
  <!-- Add any additional notes for reviewers -->

- Improve clarity of LLM text file links in documentation ([4f76158](https://github.com/favorodera/notform/commit/4f76158))
- Improve clarity of LLM text file links in documentation ([#45](https://github.com/favorodera/notform/pull/45))

  ## Description
  <!-- Describe your changes in detail -->
  ## Related Issue
  <!-- Link to the issue this PR addresses, if applicable -->
  Fixes #
  ## Type of Change
  <!-- Mark with an 'x' all that apply -->
  - [ ] Bug fix (non-breaking change which fixes an issue)
  - [ ] New feature (non-breaking change which adds functionality)
  - [ ] Breaking change (fix or feature that would cause existing
  functionality to not work as expected)
  - [x] Documentation update
  - [ ] Code refactor (no functional changes)
  - [ ] Test update
  - [ ] Build/CI configuration
  ## Checklist
  <!-- Mark with an 'x' all that apply -->
  - [x] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guidelines
  - [x] My code follows the project's code style
  - [ ] I have added tests that prove my fix is effective or that my
  feature works
  - [x] I have run `pnpm ready`
  - [x] New and existing unit tests pass locally with my changes
  - [x] I have updated the documentation accordingly
  ## Screenshots / Recordings
  <!-- If applicable, add screenshots or recordings to help explain your
  changes -->
  ## Additional Notes
  <!-- Add any additional notes for reviewers -->

- Update contributing guide prerequisites and setup instructions ([a352e50](https://github.com/favorodera/notform/commit/a352e50))
- Simplify event handler documentation - Consolidate event field descriptions. - Update example to use events object. ([f156cd1](https://github.com/favorodera/notform/commit/f156cd1))
- Add navigation icon for LLMs.txt ([1ef9018](https://github.com/favorodera/notform/commit/1ef9018))
- Add advanced guides for Pinia, Composables, and Validation ([1b58126](https://github.com/favorodera/notform/commit/1b58126))

  - Add guides for Pinia and Composables.
  - Explain form instance sharing patterns.
  - Detail validation triggers and modes.
  - Cover async and cross-field validation.
  - Show handling of server-side errors.

- Simplify project tagline in READMEs - Remove "Vue Forms Without the Friction." - Update core package description to include components ([88c2afc](https://github.com/favorodera/notform/commit/88c2afc))
- Update README badges ([10642a5](https://github.com/favorodera/notform/commit/10642a5))

### Chores

- Add Google site verification meta tag ([e90d83c](https://github.com/favorodera/notform/commit/e90d83c))
- Update install command in hero component ([4b5f262](https://github.com/favorodera/notform/commit/4b5f262))
- Update dependencies and build script ([92e2ad9](https://github.com/favorodera/notform/commit/92e2ad9))
- Remove build from ready script ([3c58c65](https://github.com/favorodera/notform/commit/3c58c65))
- Update dependencies and build scripts ([62fffb7](https://github.com/favorodera/notform/commit/62fffb7))
- Update dependencies and lint root config ([50ab98c](https://github.com/favorodera/notform/commit/50ab98c))
- Update pnpm dependencies ([fbb153b](https://github.com/favorodera/notform/commit/fbb153b))
- Configure relizy types ([4cbcaa0](https://github.com/favorodera/notform/commit/4cbcaa0))
- Configure relizy types ([#47](https://github.com/favorodera/notform/pull/47))

  ## Description
   This PR updates the release config to match latest API
  ## Related Issue
  <!-- Link to the issue this PR addresses, if applicable -->
  Fixes #
  ## Type of Change
  <!-- Mark with an 'x' all that apply -->
  - [ ] Bug fix (non-breaking change which fixes an issue)
  - [ ] New feature (non-breaking change which adds functionality)
  - [ ] Breaking change (fix or feature that would cause existing
  functionality to not work as expected)
  - [ ] Documentation update
  - [x] Code refactor (no functional changes)
  - [ ] Test update
  - [ ] Build/CI configuration
  ## Checklist
  <!-- Mark with an 'x' all that apply -->
  - [x] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guidelines
  - [x] My code follows the project's code style
  - [ ] I have added tests that prove my fix is effective or that my
  feature works
  - [x] I have run `pnpm ready`
  - [x] New and existing unit tests pass locally with my changes
  - [ ] I have updated the documentation accordingly
  ## Screenshots / Recordings
  <!-- If applicable, add screenshots or recordings to help explain your
  changes -->
  ## Additional Notes
  <!-- Add any additional notes for reviewers -->


### Styling

- Add trailing comma to meta tag configuration ([f1850e3](https://github.com/favorodera/notform/commit/f1850e3))
- Remove unused pointer-events-none class ([69ed14f](https://github.com/favorodera/notform/commit/69ed14f))
- Update Tailwind CSS class syntax ([20331c5](https://github.com/favorodera/notform/commit/20331c5))
- Adjust OG image logo positioning ([fde3882](https://github.com/favorodera/notform/commit/fde3882))

### ❤️ Contributors

- Favour  Emeka ([@favorodera](https://github.com/favorodera))
- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0...v2.1.0-alpha.0

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0...v2.1.0-alpha.0)

### Added

- Add npm shields to README ([0dcab4f](https://github.com/favorodera/notform/commit/0dcab4f))
- Define dark mode UI background ([e04888e](https://github.com/favorodera/notform/commit/e04888e))

### Refactors

- Simplify navigation prop in header component ([989f82a](https://github.com/favorodera/notform/commit/989f82a))
- Update command to install notform ([7b941ee](https://github.com/favorodera/notform/commit/7b941ee))
- Inline event handlers in slotProps ([3c441cc](https://github.com/favorodera/notform/commit/3c441cc))
- Inline NotField event types ([b655632](https://github.com/favorodera/notform/commit/b655632))

### Documentation

- Update Node.js prerequisite to v22 ([6b13b57](https://github.com/favorodera/notform/commit/6b13b57))
- Improve LLMs.txt documentation formatting and linking ([76368eb](https://github.com/favorodera/notform/commit/76368eb))
- Wrap Vue template examples in <template> tags ([9a7e6f7](https://github.com/favorodera/notform/commit/9a7e6f7))
- Wrap Vue template examples in <template> tags ([#43](https://github.com/favorodera/notform/pull/43))

  ## Description
  <!-- Describe your changes in detail -->
  ## Related Issue
  <!-- Link to the issue this PR addresses, if applicable -->
  Fixes #
  ## Type of Change
  <!-- Mark with an 'x' all that apply -->
  - [ ] Bug fix (non-breaking change which fixes an issue)
  - [ ] New feature (non-breaking change which adds functionality)
  - [ ] Breaking change (fix or feature that would cause existing
  functionality to not work as expected)
  - [x] Documentation update
  - [ ] Code refactor (no functional changes)
  - [ ] Test update
  - [ ] Build/CI configuration
  ## Checklist
  <!-- Mark with an 'x' all that apply -->
  - [x] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guidelines
  - [x] My code follows the project's code style
  - [ ] I have added tests that prove my fix is effective or that my
  feature works
  - [x] I have run `pnpm ready`
  - [x] New and existing unit tests pass locally with my changes
  - [x] I have updated the documentation accordingly
  ## Screenshots / Recordings
  <!-- If applicable, add screenshots or recordings to help explain your
  changes -->
  ## Additional Notes
  <!-- Add any additional notes for reviewers -->

- Add 'Working with AI' pages to docs llms ([4496fc3](https://github.com/favorodera/notform/commit/4496fc3))
- Add 'Working with AI' pages to docs llms ([#44](https://github.com/favorodera/notform/pull/44))

  ## Description
  This PR adds the AI section of the docs to the LLMS config in the docs
  nuxt config
  ## Related Issue
  <!-- Link to the issue this PR addresses, if applicable -->
  Fixes #
  ## Type of Change
  <!-- Mark with an 'x' all that apply -->
  - [ ] Bug fix (non-breaking change which fixes an issue)
  - [ ] New feature (non-breaking change which adds functionality)
  - [ ] Breaking change (fix or feature that would cause existing
  functionality to not work as expected)
  - [x] Documentation update
  - [x] Code refactor (no functional changes)
  - [ ] Test update
  - [ ] Build/CI configuration
  ## Checklist
  <!-- Mark with an 'x' all that apply -->
  - [x] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guidelines
  - [x] My code follows the project's code style
  - [ ] I have added tests that prove my fix is effective or that my
  feature works
  - [x] I have run `pnpm ready`
  - [x] New and existing unit tests pass locally with my changes
  - [x] I have updated the documentation accordingly
  ## Screenshots / Recordings
  <!-- If applicable, add screenshots or recordings to help explain your
  changes -->
  ## Additional Notes
  <!-- Add any additional notes for reviewers -->

- Improve clarity of LLM text file links in documentation ([4f76158](https://github.com/favorodera/notform/commit/4f76158))
- Improve clarity of LLM text file links in documentation ([#45](https://github.com/favorodera/notform/pull/45))

  ## Description
  <!-- Describe your changes in detail -->
  ## Related Issue
  <!-- Link to the issue this PR addresses, if applicable -->
  Fixes #
  ## Type of Change
  <!-- Mark with an 'x' all that apply -->
  - [ ] Bug fix (non-breaking change which fixes an issue)
  - [ ] New feature (non-breaking change which adds functionality)
  - [ ] Breaking change (fix or feature that would cause existing
  functionality to not work as expected)
  - [x] Documentation update
  - [ ] Code refactor (no functional changes)
  - [ ] Test update
  - [ ] Build/CI configuration
  ## Checklist
  <!-- Mark with an 'x' all that apply -->
  - [x] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guidelines
  - [x] My code follows the project's code style
  - [ ] I have added tests that prove my fix is effective or that my
  feature works
  - [x] I have run `pnpm ready`
  - [x] New and existing unit tests pass locally with my changes
  - [x] I have updated the documentation accordingly
  ## Screenshots / Recordings
  <!-- If applicable, add screenshots or recordings to help explain your
  changes -->
  ## Additional Notes
  <!-- Add any additional notes for reviewers -->

- Update contributing guide prerequisites and setup instructions ([a352e50](https://github.com/favorodera/notform/commit/a352e50))
- Simplify event handler documentation - Consolidate event field descriptions. - Update example to use events object. ([f156cd1](https://github.com/favorodera/notform/commit/f156cd1))
- Add navigation icon for LLMs.txt ([1ef9018](https://github.com/favorodera/notform/commit/1ef9018))
- Add advanced guides for Pinia, Composables, and Validation ([1b58126](https://github.com/favorodera/notform/commit/1b58126))

  - Add guides for Pinia and Composables.
  - Explain form instance sharing patterns.
  - Detail validation triggers and modes.
  - Cover async and cross-field validation.
  - Show handling of server-side errors.

- Simplify project tagline in READMEs - Remove "Vue Forms Without the Friction." - Update core package description to include components ([88c2afc](https://github.com/favorodera/notform/commit/88c2afc))
- Update README badges ([10642a5](https://github.com/favorodera/notform/commit/10642a5))

### Chores

- Add Google site verification meta tag ([e90d83c](https://github.com/favorodera/notform/commit/e90d83c))
- Update install command in hero component ([4b5f262](https://github.com/favorodera/notform/commit/4b5f262))
- Update dependencies and build script ([92e2ad9](https://github.com/favorodera/notform/commit/92e2ad9))
- Remove build from ready script ([3c58c65](https://github.com/favorodera/notform/commit/3c58c65))
- Update dependencies and build scripts ([62fffb7](https://github.com/favorodera/notform/commit/62fffb7))
- Update dependencies and lint root config ([50ab98c](https://github.com/favorodera/notform/commit/50ab98c))
- Update pnpm dependencies ([fbb153b](https://github.com/favorodera/notform/commit/fbb153b))
- Configure relizy types ([4cbcaa0](https://github.com/favorodera/notform/commit/4cbcaa0))

### Styling

- Add trailing comma to meta tag configuration ([f1850e3](https://github.com/favorodera/notform/commit/f1850e3))
- Remove unused pointer-events-none class ([69ed14f](https://github.com/favorodera/notform/commit/69ed14f))
- Update Tailwind CSS class syntax ([20331c5](https://github.com/favorodera/notform/commit/20331c5))
- Adjust OG image logo positioning ([fde3882](https://github.com/favorodera/notform/commit/fde3882))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
- Favour  Emeka ([@favorodera](https://github.com/favorodera))


## v1.0.7...v2.0.0

[compare changes](https://github.com/favorodera/notform/compare/v1.0.7...v2.0.0)

### Added

- Export useNotForm composable types ([27a25ae](https://github.com/favorodera/notform/commit/27a25ae))
- Add UseNotFormOptions type ([e7c131a](https://github.com/favorodera/notform/commit/e7c131a))
- Define useNotForm API types ([e0b19af](https://github.com/favorodera/notform/commit/e0b19af))
- Add NotForm component types ([579b4b1](https://github.com/favorodera/notform/commit/579b4b1))
- Introduce useNotForm composable ([62b8c55](https://github.com/favorodera/notform/commit/62b8c55))
- Export useNotForm composable and NotForm component types ([5ba4a51](https://github.com/favorodera/notform/commit/5ba4a51))
- Implement useNotForm composable for comprehensive form management ([13e0e31](https://github.com/favorodera/notform/commit/13e0e31))
- Enhance form instance with comprehensive state management ([8908757](https://github.com/favorodera/notform/commit/8908757))
- Add path normalization and comparison utilities ([4e3b5a3](https://github.com/favorodera/notform/commit/4e3b5a3))
- Add NotForm instance provide/inject utilities ([369a6df](https://github.com/favorodera/notform/commit/369a6df))
- Add form utilities for path normalization and comparison ([d1e7517](https://github.com/favorodera/notform/commit/d1e7517))
- Expand NotFormInstance type with detailed properties ([ab8ed40](https://github.com/favorodera/notform/commit/ab8ed40))
- Add NotField component types ([f846e9e](https://github.com/favorodera/notform/commit/f846e9e))
- Export NotForm and NotField components ([e0fc885](https://github.com/favorodera/notform/commit/e0fc885))
- Add NotForm component ([ec65a58](https://github.com/favorodera/notform/commit/ec65a58))
- Introduce NotField component ([2a3eac2](https://github.com/favorodera/notform/commit/2a3eac2))
- Enhance not-field component with validation, touch, and dirty states ([26b5606](https://github.com/favorodera/notform/commit/26b5606))
- Implement `validateOn.onChange` and refactor validation state ([9d164a1](https://github.com/favorodera/notform/commit/9d164a1))
- Enhance NotField component with generic path typing and additional instance properties ([e26bcca](https://github.com/favorodera/notform/commit/e26bcca))
- Add validation triggers to NotField component ([2984d97](https://github.com/favorodera/notform/commit/2984d97))
- Add NotFieldEvents and validateOn to NotFieldProps ([71ab1d5](https://github.com/favorodera/notform/commit/71ab1d5))
- Configure tsdown to not bundle common dependencies ([cbd5b02](https://github.com/favorodera/notform/commit/cbd5b02))
- Add validationMode option to UseNotFormConfig ([5c15c76](https://github.com/favorodera/notform/commit/5c15c76))
- Introduce ValidationMode type ([2cb9b32](https://github.com/favorodera/notform/commit/2cb9b32))
- Add validation mode and form state flags to NotFormInstance ([5949fa4](https://github.com/favorodera/notform/commit/5949fa4))
- Enhance NotField with validationMode and state flags ([d9179fb](https://github.com/favorodera/notform/commit/d9179fb))
- Add validationMode and simplify all fields tracking in useNotForm ([af09d86](https://github.com/favorodera/notform/commit/af09d86))
- Enhance NotField with validation modes and state tracking ([16a0e49](https://github.com/favorodera/notform/commit/16a0e49))
- Export NotMessage component and its types ([1a3164a](https://github.com/favorodera/notform/commit/1a3164a))
- Add NotMessage component ([1bbe563](https://github.com/favorodera/notform/commit/1bbe563))
- Add NotMessage component types ([7548cc6](https://github.com/favorodera/notform/commit/7548cc6))
- Add NotArrayField component ([98b23bd](https://github.com/favorodera/notform/commit/98b23bd))
- Add NotArrayField component ([3ccc1f7](https://github.com/favorodera/notform/commit/3ccc1f7))
- Add NotArrayField type definitions ([e28d417](https://github.com/favorodera/notform/commit/e28d417))
- Initialize nuxt module structure ([0c82c65](https://github.com/favorodera/notform/commit/0c82c65))
- Update package.json with new metadata and configuration ([5ab7c57](https://github.com/favorodera/notform/commit/5ab7c57))
- Sync item keys with array length in not-array-field ([886af8e](https://github.com/favorodera/notform/commit/886af8e))
- Introduce Vue playground app and refactor Nuxt module ([120417e](https://github.com/favorodera/notform/commit/120417e))
- Add notform package dependency ([8f4aa2e](https://github.com/favorodera/notform/commit/8f4aa2e))
- Register notform components, composables, and types for Nuxt module ([da073ce](https://github.com/favorodera/notform/commit/da073ce))
- Expose notform components ([cbc8516](https://github.com/favorodera/notform/commit/cbc8516))
- Expose useNotForm composable ([8446552](https://github.com/favorodera/notform/commit/8446552))
- Expose notform types from module ([987d38c](https://github.com/favorodera/notform/commit/987d38c))
- Add debounced validation to not-field ([e9d2c32](https://github.com/favorodera/notform/commit/e9d2c32))
- Add debounce option for field validation ([9e00309](https://github.com/favorodera/notform/commit/9e00309))

### Fixed

- Correct error message for missing form instance ([467e218](https://github.com/favorodera/notform/commit/467e218))
- Prevent inject from throwing error when key is not found ([29e7244](https://github.com/favorodera/notform/commit/29e7244))
- Use v-if instead of v-show for message rendering ([ebd86ff](https://github.com/favorodera/notform/commit/ebd86ff))
- Sync item keys when array changes externally ([0e214e6](https://github.com/favorodera/notform/commit/0e214e6))
- Ensure accurate `isValidating` state and consistent initial values ([643f49f](https://github.com/favorodera/notform/commit/643f49f))
- Correctly access array length in NotArrayField tests ([644e4be](https://github.com/favorodera/notform/commit/644e4be))

### Refactors

- Replace es-toolkit with specialized utility libraries ([fa43ae3](https://github.com/favorodera/notform/commit/fa43ae3))
- Streamline ValidationTrigger and Paths types ([e664afc](https://github.com/favorodera/notform/commit/e664afc))
- Adjust `errorsMap` type to `Partial` ([c8b3289](https://github.com/favorodera/notform/commit/c8b3289))
- Replace dlv and dset with dot-prop ([08fb462](https://github.com/favorodera/notform/commit/08fb462))
- Update ValidationTrigger description for clarity ([5dfc167](https://github.com/favorodera/notform/commit/5dfc167))
- Remove unused validation utility functions ([a3b910c](https://github.com/favorodera/notform/commit/a3b910c))
- Remove unused type imports in use-not-form.ts ([2e04c2f](https://github.com/favorodera/notform/commit/2e04c2f))
- Rename `UseNotFormInstance` to `NotFormInstance` and update imports ([44f0464](https://github.com/favorodera/notform/commit/44f0464))
- Export useNotForm as default export ([c51bc18](https://github.com/favorodera/notform/commit/c51bc18))
- Introduce readonly initialValues, initialErrors, and validateOn to NotFormInstance ([3910251](https://github.com/favorodera/notform/commit/3910251))

  This commit refactors the `NotFormInstance` type to expose `initialValues`, `initialErrors`, and `validateOn` as readonly properties. These properties were previously omitted from `UseNotFormConfig` but are now directly accessible for better type clarity and immutability.
  Additionally, the `isValidating` property has been changed from a `ComputedRef` to a `Ref`, simplifying its usage and reflecting a more direct state management approach. The `validatingFields` property has been removed as its functionality is now implicitly handled by `isValidating`.

- Remove `bracketNotation` from `TypeFestPaths` configuration ([83e578e](https://github.com/favorodera/notform/commit/83e578e))
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
- Remove redundant type assertions for form values ([be0db65](https://github.com/favorodera/notform/commit/be0db65))
- Remove unnecessary 'form' prop from NotField ([7850b98](https://github.com/favorodera/notform/commit/7850b98))
- Simplify NotField usage by removing explicit form prop ([b49b859](https://github.com/favorodera/notform/commit/b49b859))
- Remove unused ArraySchema type ([d9075b2](https://github.com/favorodera/notform/commit/d9075b2))
- Improve handling of initial values in useNotForm ([f4343d7](https://github.com/favorodera/notform/commit/f4343d7))
- Improve variable naming in syncKeys function ([a1ac046](https://github.com/favorodera/notform/commit/a1ac046))
- Remove explicit type injection for notform module` ([dff28f2](https://github.com/favorodera/notform/commit/dff28f2))
- Replace direct type re-export with virtual module and alias ([bb7cee3](https://github.com/favorodera/notform/commit/bb7cee3))
- Remove unused NotFormModuleOptions interface ([5d897b8](https://github.com/favorodera/notform/commit/5d897b8))
- Remove length from NotArrayField slot props ([bcbb933](https://github.com/favorodera/notform/commit/bcbb933))
- Remove length property from NotArrayFieldSlotProps ([1fb57d8](https://github.com/favorodera/notform/commit/1fb57d8))
- Optimize item key synchronization ([49d5d23](https://github.com/favorodera/notform/commit/49d5d23))
- Remove virtual module and type alias for #notform ([25f8a81](https://github.com/favorodera/notform/commit/25f8a81))

### Documentation

- Improve JSDoc comments and error message for NotForm instance utilities ([e7be8d7](https://github.com/favorodera/notform/commit/e7be8d7))
- Add usage guidance for NotFieldSlotProps value prop ([26707cc](https://github.com/favorodera/notform/commit/26707cc))
- Revamp README for NotForm project ([e9b9463](https://github.com/favorodera/notform/commit/e9b9463))
- Update README with new branding and documentation link ([f15fc99](https://github.com/favorodera/notform/commit/f15fc99))
- Clarify default slot content for NotForm ([b16d8b0](https://github.com/favorodera/notform/commit/b16d8b0))
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

### Added

- Add debounced validation to not-field ([e9d2c32](https://github.com/favorodera/notform/commit/e9d2c32))
- Add debounce option for field validation ([9e00309](https://github.com/favorodera/notform/commit/9e00309))

### Refactors

- Optimize item key synchronization ([49d5d23](https://github.com/favorodera/notform/commit/49d5d23))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-beta.0...v2.0.0-beta.1

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-beta.0...v2.0.0-beta.1)

### Fixed

- Correctly access array length in NotArrayField tests ([644e4be](https://github.com/favorodera/notform/commit/644e4be))

### Refactors

- Remove length from NotArrayField slot props ([bcbb933](https://github.com/favorodera/notform/commit/bcbb933))
- Remove length property from NotArrayFieldSlotProps ([1fb57d8](https://github.com/favorodera/notform/commit/1fb57d8))

### Documentation

- Update documentation link ([f79cf09](https://github.com/favorodera/notform/commit/f79cf09))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-alpha.9...v2.0.0-beta.0

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.9...v2.0.0-beta.0)

No relevant changes for this release


## v2.0.0-alpha.7...v2.0.0-alpha.9

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.7...v2.0.0-alpha.9)

### Fixed

- Sync item keys when array changes externally ([0e214e6](https://github.com/favorodera/notform/commit/0e214e6))
- Ensure accurate `isValidating` state and consistent initial values ([643f49f](https://github.com/favorodera/notform/commit/643f49f))

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
- Clarify default slot content for NotForm ([b16d8b0](https://github.com/favorodera/notform/commit/b16d8b0))
- Add introduction page and update docs navigation ([11b5162](https://github.com/favorodera/notform/commit/11b5162))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


## v2.0.0-alpha.5...v2.0.0-alpha.6

[compare changes](https://github.com/favorodera/notform/compare/v2.0.0-alpha.5...v2.0.0-alpha.6)

### Added

- Add NotArrayField component ([98b23bd](https://github.com/favorodera/notform/commit/98b23bd))
- Add NotArrayField component ([3ccc1f7](https://github.com/favorodera/notform/commit/3ccc1f7))
- Add NotArrayField type definitions ([e28d417](https://github.com/favorodera/notform/commit/e28d417))
- Initialize nuxt module structure ([0c82c65](https://github.com/favorodera/notform/commit/0c82c65))
- Update package.json with new metadata and configuration ([5ab7c57](https://github.com/favorodera/notform/commit/5ab7c57))
- Sync item keys with array length in not-array-field ([886af8e](https://github.com/favorodera/notform/commit/886af8e))
- Introduce Vue playground app and refactor Nuxt module ([120417e](https://github.com/favorodera/notform/commit/120417e))

### Fixed

- Use v-if instead of v-show for message rendering ([ebd86ff](https://github.com/favorodera/notform/commit/ebd86ff))

### Refactors

- Remove unused ArraySchema type ([d9075b2](https://github.com/favorodera/notform/commit/d9075b2))
- Improve handling of initial values in useNotForm ([f4343d7](https://github.com/favorodera/notform/commit/f4343d7))
- Improve variable naming in syncKeys function ([a1ac046](https://github.com/favorodera/notform/commit/a1ac046))

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))


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
