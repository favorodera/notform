---
seo:
  title: NotForm - Vue Forms Without the Friction
  description: Schema-powered form validation for Vue 3 that actually gets out of your way. Stop wrestling with form state and start shipping features.
---
::u-page-hero{class="dark:bg-default"}
#title
Forms that feel natural.
#description
:name-text brings schema-based validation to [Vue 3]{class="text-primary"} without the usual headaches. Connect your schemas, handle submissions, and track changes—all with the simplicity you'd expect.
#links
  :::u-button
  ---
  to: /getting-started
  size: md
  trailing-icon: i-tabler-arrow-right
  ---
  Get started
  :::
  :::input-copy
  ---
  value: "npm install notform"
  ---
  :::
::
::u-page-section
---
ui:
  root: bg-gradient-to-b border-t border-default from-muted dark:from-muted/40 to-default
  title: 'text-left'
  description: 'text-left'
---
#title
What makes it different
#features
  :::u-page-feature
  ---
  icon: i-tabler-palette
  orientation: vertical
  ---
  #title
  Style it your way
  #description
  :name-text works with your existing components and design system. Whether you're using [Tailwind]{class="text-primary"}, [shadcn/vue]{class="text-primary"}, or custom [CSS]{class="text-primary"}, the validation layer adapts to your choices.
  :::
  :::u-page-feature
  ---
  icon: i-tabler-text-recognition
  orientation: vertical
  ---
  #title
  Validation on your terms
  #description
  Choose when validation happens—on `blur`{lang="ts-type"}, `change`{lang="ts-type"}, or `submit`{lang="ts-type"}. Set field-level rules, form-wide constraints, or cross-field dependencies. You're in control of the validation flow.
  :::
  :::u-page-feature
  ---
  icon: i-tabler-stack-2
  orientation: vertical
  ---
  #title
  Dynamic fields made easy
  #description
  [Add]{class="text-primary"}, [remove]{class="text-primary"}, or [reorder]{class="text-primary"} fields on the fly. Nest them as deep as you need. Each item gets validated with full type safety built in.
  :::
  :::u-page-feature
  ---
  icon: i-tabler-search
  orientation: vertical
  ---
  #title
  Built for Composition API
  #description
  Designed from the ground up for [Vue 3's Composition API]{class="text-primary"}. TypeScript inference works naturally, reactive state stays reactive, and composables actually compose.
  :::
  :::u-page-feature
  ---
  icon: i-tabler-shield-check
  orientation: vertical
  ---
  #title
  Use your preferred schema
  #description
  Works with [Zod]{class="text-primary"}, [Yup]{class="text-primary"}, [Valibot]{class="text-primary"}, [ArkType]{class="text-primary"}, and any library that follows the standard-schema pattern. Define your validation rules once and use them consistently across your app.
  :::
  :::u-page-feature
  ---
  icon: i-tabler-bolt
  orientation: vertical
  ---
  #title
  Native Vue patterns
  #description
  `v-model`{lang="ts-type"} works just like you expect. No special bindings or custom directives required—just standard [Vue]{class="text-primary"} with powerful form features underneath.
  :::
::
::u-page-section
#title
Why we built this
#description
Forms shouldn't slow you down. NotForm lets you focus on building features instead of fighting with form state.
#default
  ::card-group
    :::card
    ---
    icon: i-tabler-shield-check
    title: Types that flow naturally
    ---
    Your schema types automatically propagate through field values, error states, and submission data. No manual type annotations needed.
    :::

    :::card
    ---
    icon: i-tabler-code
    title: Quick to learn, easy to use
    ---
    Clear APIs and straightforward patterns mean you can be productive quickly. The documentation respects your time and gets you building fast.
    :::

    :::card
    ---
    icon: i-tabler-rocket
    title: Ready for real-world needs
    ---
    Handle nested objects, async validation, conditional fields, multi-step forms, and file uploads. Build the forms your application needs without juggling multiple libraries.
    :::

    :::card
    ---
    icon: i-tabler-stack-2
    title: Keep your options open
    ---
    Built on standard schemas and Vue patterns. Your forms remain portable and you're free to switch approaches if your needs change.
    :::
  ::
::
