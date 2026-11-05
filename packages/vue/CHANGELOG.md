# Changelog

## v3.0.1...v4.0.0-alpha.0

[compare changes](https://github.com/favorodera/notform/compare/v3.0.1...v4.0.0-alpha.0)

### Added

- **core:** Add core types and issue helpers ([453287e](https://github.com/favorodera/notform/commit/453287e))

  - Define schema and component types for v4
  - Add support for Standard Schema specification
  - Add utility functions for issue path matching

- **nuxt:** Add Nuxt module for NotForm ([f57f7ec](https://github.com/favorodera/notform/commit/f57f7ec))

  - Enable seamless NotForm integration in Nuxt apps
  - Auto-import components and composables
  - Allow aliasing component and composable names
  - Update workspace setup and ESLint rules

- **vue:** Add core form and field handling ([c3e164e](https://github.com/favorodera/notform/commit/c3e164e))

  - Add useForm composable and state factories
  - Add Form and Field components for reactive forms
  - Export Vue primitives and update playground app

- **vue:** Add form validation and submission ([fbf097e](https://github.com/favorodera/notform/commit/fbf097e))

  - Manage async runs and prevent stale validations
  - Add submit handling and submission tracking
  - Expose form dirty, valid, and submitted states
  - Wire submit events to the form component

- **vue:** Add touched state tracking and field events ([d829868](https://github.com/favorodera/notform/commit/d829868))

  - Track touched state for fields and whole form
  - Expose event handlers on fields for validation
  - Invalidate validation on schema and value changes

- **vue:** Add validation states and error helpers ([3a7736a](https://github.com/favorodera/notform/commit/3a7736a))

  - Add isValidating and errors state to fields
  - Expose getFieldErrors and setError on form
  - Allow checking validation status across scopes

- **vue:** Add FieldError component and form reset ([76810be](https://github.com/favorodera/notform/commit/76810be))

  - add FieldError component for error display
  - implement form reset to clear form state
  - export FieldError component and its types

- **vue:** Add ArrayField component and factory ([78e5699](https://github.com/favorodera/notform/commit/78e5699))

  - introduce ArrayField component for array handling
  - add createArrayField reactive factory function
  - export array field component and public types

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

- **deps:** Restrict pnpm version to <13.0.0 ([41be96d](https://github.com/favorodera/notform/commit/41be96d))

### Fixed

- **vue:** Make disposed fields and scopes inert ([7eaff5f](https://github.com/favorodera/notform/commit/7eaff5f))

  - Prevent stale handles from writing to form state
  - Ignore mutations and validation on disposed fields
  - Mark fields created from disposed scopes as inert


### Refactors

- **workspace:** Prepare repository for v4 rewrite ([45add4c](https://github.com/favorodera/notform/commit/45add4c))

  - Remove legacy docs and Nuxt module packages
  - Clear core package components and composables
  - Add local playground for core package
  - Update workspace config and dependencies

- **packages:** Rename core to vue ([a3ec15a](https://github.com/favorodera/notform/commit/a3ec15a))

  - Align package name with framework targeting
  - Prepare directory structure for v4 release

- **vue:** Simplify playground layout ([f1898a8](https://github.com/favorodera/notform/commit/f1898a8))

  - Simplify App.vue template in playground
  - Remove unused playground components
  - Add dedicated index.css stylesheet
  - Remove unused Zod catalog dependency

- **vue:** Clean up form and field API types ([f354193](https://github.com/favorodera/notform/commit/f354193))

  - Limit useForm return to safe public methods
  - Remove redundant helper methods on array items
  - Improve field validation result generic typing

- **repo:** Update project name to notform ([5e550ff](https://github.com/favorodera/notform/commit/5e550ff))

  - Standardize monorepo references to notform
  - Remove unused CSS and page transitions in docs
  - Update docs metadata for clarity


### Documentation

- **app:** Update header UI variants to subtle ([01fc2c1](https://github.com/favorodera/notform/commit/01fc2c1))

  - Use subtle variant for header badge and toggle
  - Fix formatting in TOC footer links

- **app:** Add footer component ([698830b](https://github.com/favorodera/notform/commit/698830b))

  - Display copyright and license details
  - Include footer across doc layouts

- **docs:** Remove raw markdown endpoint and update configuration ([a28ff30](https://github.com/favorodera/notform/commit/a28ff30))

  - Remove legacy raw markdown server route
  - Update path logic for markdown assets
  - Consolidate documentation configuration settings

- **installation:** Add installation guide ([eb057e4](https://github.com/favorodera/notform/commit/eb057e4))

  - Detail requirements and package manager options
  - Cover Vue 3, Vite, and Nuxt 4 setup
  - Add usage examples with Standard Schema

- **quickstart:** Add quickstart guide ([92414ac](https://github.com/favorodera/notform/commit/92414ac))

  - Provide step-by-step sign-in form tutorial

- **nuxt:** Add guide for Nuxt module ([bfe6a59](https://github.com/favorodera/notform/commit/bfe6a59))

  - Explain installation and auto-imported items
  - Document aliases to resolve naming conflicts
  - Add guidance on importing types and SSR setup

- **getting-started:** Introduce core concepts of NotForm ([fb6770c](https://github.com/favorodera/notform/commit/fb6770c))

  - Explain fundamental ideas like schemas and fields
  - Detail what happens on user input and submission
  - Provide a glossary of key terms

- **config:** Temporarily disable link checker errors ([2df88f8](https://github.com/favorodera/notform/commit/2df88f8))
- **guides:** Add navigation file for guides section ([1284060](https://github.com/favorodera/notform/commit/1284060))
- **vscode:** Add shadcn to spelling dictionary ([7441a19](https://github.com/favorodera/notform/commit/7441a19))
- **guides:** Add guide for binding inputs ([0907450](https://github.com/favorodera/notform/commit/0907450))

  - Document input binding patterns for NotForm
  - Cover native controls, files, and accessibility

- **guides:** Add guide for schema input and output ([8b854f8](https://github.com/favorodera/notform/commit/8b854f8))

  - explain input and output shape distinction
  - document SchemaInput and SchemaOutput helpers

- **guides:** Add validation guide ([91e67f6](https://github.com/favorodera/notform/commit/91e67f6))

  - Cover triggers, presets, and eager/lazy modes
  - Explain debounce, async rules, and stale state
  - Detail explicit validation and reactive schemas

- **eslint:** Ignore vue/no-root-v-if in markdown ([5517fdf](https://github.com/favorodera/notform/commit/5517fdf))

  - Allow root v-if directives in doc code snippets

- **config:** Fail build on broken links ([c4c3c03](https://github.com/favorodera/notform/commit/c4c3c03))
- **guides:** Add error handling documentation ([556300a](https://github.com/favorodera/notform/commit/556300a))

  - Explain rendering field and form-level errors
  - Detail server errors and error state lifecycle
  - Add examples for accessible error markup

- **guides:** Add submission and reset guide ([3a13cf0](https://github.com/favorodera/notform/commit/3a13cf0))

  - Explain form submission lifecycle and errors
  - Detail programmatic submission and validation
  - Cover form reset mechanics and baselines

- **guides:** Add form state guide ([c355ca0](https://github.com/favorodera/notform/commit/c355ca0))

  - Document form and field reactive state
  - Explain common patterns and isValid pitfalls

- **guides:** Add array fields guide ([5eaf4c2](https://github.com/favorodera/notform/commit/5eaf4c2))

  - Document how to build repeatable form sections.
  - Explain item identity, validation, and nesting.

- **guides:** Add TypeScript guide ([a3fb2ec](https://github.com/favorodera/notform/commit/a3fb2ec))

  - Document path inference and schema types
  - Explain typing reusable components and props

- **guides:** Update typescript guide examples ([1f9749f](https://github.com/favorodera/notform/commit/1f9749f))

  - Fix linting for vue prop mutations in docs
  - Add missing form component example snippet
  - Update workspace spellcheck dictionary

- **examples:** Remove file names from code blocks ([2c26aa1](https://github.com/favorodera/notform/commit/2c26aa1))
- **recipes:** Add navigation configuration ([90f1bcf](https://github.com/favorodera/notform/commit/90f1bcf))

  - define section title and hide icon in navigation

- **recipes:** Add server errors recipe ([04b7fb4](https://github.com/favorodera/notform/commit/04b7fb4))

  - Explain how to display API errors
  - Cover field-level and form-level errors
  - Show error duration and nested paths

- **recipes:** Add cross-field validation recipe ([96ce577](https://github.com/favorodera/notform/commit/96ce577))

  - Explain cross-field schema rules with Zod path
  - Show how to keep dependent fields up to date

- **recipes:** Add async validation recipe ([6786aa4](https://github.com/favorodera/notform/commit/6786aa4))

  - Add guide for debounced async server checks
  - Show caching and loading state with Zod
  - Address stale results and cache invalidation

- **recipes:** Add guide for editing existing data ([24c2fef](https://github.com/favorodera/notform/commit/24c2fef))

  - Explain loading data into forms
  - Cover tracking unsaved changes
  - Show how to make saved data the new baseline
  - Provide tips for handling input/output shapes

- **recipes:** Add multi-step form recipe ([9b6c9e3](https://github.com/favorodera/notform/commit/9b6c9e3))

  - Document step-by-step schema validation
  - Provide Vue and Zod implementation example
  - Detail navigation and value persistence

- **components:** Add navigation for components section ([880e3ce](https://github.com/favorodera/notform/commit/880e3ce))
- **form:** Add new Form component documentation ([e0ca334](https://github.com/favorodera/notform/commit/e0ca334))

  - Introduce Form component to docs
  - Explain usage with useForm
  - Detail props, slots, and behavior
  - Clarify attributes forwarding
  - Note Form does not provide context

- **eslint:** Disable tailwind unknown classes rule ([5a0cbe2](https://github.com/favorodera/notform/commit/5a0cbe2))
- **field:** Add new Field component documentation ([e3a003e](https://github.com/favorodera/notform/commit/e3a003e))

  - Introduce `Field` component usage and props
  - Detail slot props for `field` instance
  - Explain validation configuration for fields
  - Show direct usage of field instances
  - Link to related binding and state guides

- **array-field:** Add ArrayField component documentation ([42283c5](https://github.com/favorodera/notform/commit/42283c5))

  - Introduce ArrayField for rendering arrays
  - Detail usage with examples
  - Document props, slot props, and members
  - Explain array and item specific behaviors

- **components:** Add FieldError component documentation ([b07ddf9](https://github.com/favorodera/notform/commit/b07ddf9))
- **components:** Update FieldError example to full template ([e90efb4](https://github.com/favorodera/notform/commit/e90efb4))
- **composables:** Add navigation for composables section ([4890887](https://github.com/favorodera/notform/commit/4890887))
- **composables:** Add useForm composable documentation ([22d0f8f](https://github.com/favorodera/notform/commit/22d0f8f))

  - Describe configuration options
  - Detail returned instance properties
  - Explain field and arrayField methods
  - Document form actions
  - Cover typed paths and values

- **integrations:** Add custom components guide ([75881a2](https://github.com/favorodera/notform/commit/75881a2))

  - Explain how to integrate any Vue component
  - Guide on mapping values and events
  - Examples for various binding scenarios
  - Introduce reusable field wrappers

- **integrations:** Add Nuxt UI integration guide ([86ce3da](https://github.com/favorodera/notform/commit/86ce3da))
- **integrations:** Add new integration section navigation ([926bd06](https://github.com/favorodera/notform/commit/926bd06))
- **integrations:** Add shadcn-vue integration guide ([a437a6f](https://github.com/favorodera/notform/commit/a437a6f))

  - Resolve Field and FieldError naming conflict
  - Provide examples for text input, checkbox, and select
  - Explain handling of field errors and different versions

- **reka-ui:** Add integration guide for Reka UI ([f9ca3f0](https://github.com/favorodera/notform/commit/f9ca3f0))

  - Document NotForm integration with Reka UI
  - Add examples for Checkbox, Select, and Switch

- **migrations:** Add NotForm v3 to v4 guide ([5d93a89](https://github.com/favorodera/notform/commit/5d93a89))

  - Document API renames and structural changes
  - Explain field instances and validation configs
  - Provide migration checklist for v3 users

- Update link to working with AI documentation ([eab3c42](https://github.com/favorodera/notform/commit/eab3c42))
- **ai:** Add initial AI documentation pages ([ec32690](https://github.com/favorodera/notform/commit/ec32690))

  - Introduce new AI section in docs
  - Explain how to use NotForm with AI assistants
  - Cover llms.txt, Markdown, and agent skill
  - Provide quick start guide for AI integration

- **ai:** Add llms.txt integration guide ([1c15e27](https://github.com/favorodera/notform/commit/1c15e27))

  - Document llms.txt and per-page markdown endpoints
  - Explain best practices for AI assistant usage

- **ai:** Add agent skill documentation ([ec49dde](https://github.com/favorodera/notform/commit/ec49dde))

  - explain setup and installation via skills CLI
  - detail doc routing behavior for AI assistants
  - list core NotForm rules reinforced by skill

- Add reference section and agent skill ([6e34420](https://github.com/favorodera/notform/commit/6e34420))

  - Add reference pages for types, troubleshooting, FAQ
  - Add NotForm agent skill for AI assistants
  - Configure doc search sections and content source
  - Fix input label binding in shadcn-vue guide

- **ai:** Update internal links to /docs/ai ([9105a66](https://github.com/favorodera/notform/commit/9105a66))

  - Fix broken links referencing old path
  - Align URLs with updated AI docs structure

- **config:** Remove doc sections from nuxt config ([d9db277](https://github.com/favorodera/notform/commit/d9db277))

  - Remove unused section filters from Nuxt config
  - Simplify docs configuration for v4 release

- Update playground example to use FieldError ([8b91834](https://github.com/favorodera/notform/commit/8b91834))
- **vue:** Update readme and feature highlights ([75c5e37](https://github.com/favorodera/notform/commit/75c5e37))

  - Refresh README to highlight core v4 features
  - Correct validation triggers on landing page

- **nuxt:** Clarify package usage in README ([53b9c7a](https://github.com/favorodera/notform/commit/53b9c7a))

  - Clarify auto-import and dependency requirements
  - Improve wording for API consistency with Vue

- **app:** Redirect doc links to introduction ([458c96c](https://github.com/favorodera/notform/commit/458c96c))

  - Rename getting started index to introduction
  - Update route redirects to introduction page
  - Direct hero CTA button to main docs route


### Chores

- **playground:** Improve layout and state tracking ([380685d](https://github.com/favorodera/notform/commit/380685d))

  - Track form field states reactively
  - Modernize and responsive playground styles

- **nuxt:** Run prepare before build ([fd3af06](https://github.com/favorodera/notform/commit/fd3af06))

  - Ensure generated types exist before build
  - Align build script with dev and lint tasks

- **vscode:** Add beforeunload to cspell dictionary ([a5f8add](https://github.com/favorodera/notform/commit/a5f8add))
- **config:** Remove safetyCheck option ([a46fd99](https://github.com/favorodera/notform/commit/a46fd99))

  - stop relying on CI environment variable for safety checks

- **pkg:** Update engine configuration schema ([279771e](https://github.com/favorodera/notform/commit/279771e))

  - Update devEngines structure across workspace
  - Add automatic download strategy for engines


### Tests

- **vue:** Add FieldError tests and schema helpers ([c1c0737](https://github.com/favorodera/notform/commit/c1c0737))

  - Add unit tests for FieldError component
  - Add mount helper for testing Vue form setup
  - Add Standard Schema fixtures for testing

- **vue:** Add tests for Form component ([f0215c7](https://github.com/favorodera/notform/commit/f0215c7))

  - Add tests for form rendering, submit, and reset
  - Remove default novalidate from Form component

- **vue:** Add test suites for form factories ([514c914](https://github.com/favorodera/notform/commit/514c914))

  - Cover form validation, reset, and race behavior
  - Test field events, debouncing, and dirty state
  - Verify array item remapping, move, and swap ops
  - Remove unused setup arg from mountForm helper

- **debounce:** Add unit tests for normalizeDebounce utility ([5c93ea1](https://github.com/favorodera/notform/commit/5c93ea1))
- **validation-scope:** Add tests for validation scope utilities ([91dd6c1](https://github.com/favorodera/notform/commit/91dd6c1))
- **utils:** Add tests for validation issue remapping ([121f2ac](https://github.com/favorodera/notform/commit/121f2ac))

  - Validate error-to-issue conversion
  - Verify index remapping for arrays
  - Test issue dropping and path updates

- **path:** Add unit tests for path utils ([8c3332b](https://github.com/favorodera/notform/commit/8c3332b))

  - Cover various path manipulation functions
  - Ensure correct behavior for different segment types
  - Validate path comparison and access logic

- **array:** Add tests for array utility functions ([6dbde59](https://github.com/favorodera/notform/commit/6dbde59))
- **validation:** Add tests for run registry factory ([e9e0164](https://github.com/favorodera/notform/commit/e9e0164))
- **array-field:** Improve array field test coverage ([7447694](https://github.com/favorodera/notform/commit/7447694))
- **useForm:** Add cleanup tests for useForm ([2948da1](https://github.com/favorodera/notform/commit/2948da1))

  - Ensure useForm instances clean up
  - Test debounced validation cancellation
  - Verify pending validation discard
  - Confirm fields become inert after unmount

- **FieldError:** Add tests for component states ([8cff141](https://github.com/favorodera/notform/commit/8cff141))
- **form:** Add DOM interaction tests for submit and reset ([fe0d1f9](https://github.com/favorodera/notform/commit/fe0d1f9))
- **vue:** Remove flushPromises and add field component tests ([175da26](https://github.com/favorodera/notform/commit/175da26))

  - Remove unneeded flushPromises calls
  - Add new test file for Field component
  - Test basic rendering and slot functionality
  - Test two-way binding of Field
  - Test Field component state tracking

- **vue:** Add array field and schema tests ([0067b8e](https://github.com/favorodera/notform/commit/0067b8e))

  - Verify ArrayField rendering and identity handling
  - Ensure engine adheres to Standard Schema spec
  - Exclude src/types/ from coverage calculations


### 🎨 Styles

- **playground:** Reorder and format form fields ([914ad70](https://github.com/favorodera/notform/commit/914ad70))
- **docs:** Reformat playground code and CSS ([0a40adb](https://github.com/favorodera/notform/commit/0a40adb))

  - standardize arrow function formatting
  - simplify nested CSS selectors in editor
  - remove unnecessary eslint disable comment

### ❤️ Contributors

- Favour Emeka ([@favorodera](https://github.com/favorodera))
