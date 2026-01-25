---
seo:
  title: NotForm - Effortless Vue Forms Validation
  description: A powerful, schema-based form validation library for Vue 3 with built-in error handling, field tracking, and seamless submission management.
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
:name-text

Effortless [Vue]{class="text-primary"} Forms Validation.

#description
:name-text is a standard-schema based validation library for [Vue 3]{class="text-primary"} that handles errors, validation, submission, and form state—so you can focus on building great user experiences.

#links
  :::u-button
  ---
  to: /getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/favorodera/notform
  target: _blank
  ---
  Star on GitHub
  :::

#default
  :::prose-pre
  ---
  code: |
    <script setup lang="ts">
    import { useForm, Form, Field, Message } from 'notform'
    import { z } from 'zod'

    const { state, id, submit } = useForm({
      schema: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters')
      }),
      onSubmit: async (data) => {
        console.log('Form submitted:', data)
      }
    })
    </script>

    <template>
      <Form :id="id" @submit="submit">
        <Field name="name" v-slot="{ methods, name }">
          <label :for="name">
            Name
            <input 
              v-model="state.name" 
              type="text" 
              :id="name"
              :name="name" 
              v-bind="methods"
              placeholder="Enter your name"
            />
            <Message :name="name" />
          </label>
        </Field>



        <button type="submit">Submit</button>
      </Form>
    </template>
  filename: index.vue
  ---
  ```vue [index.vue]
  <script setup lang="ts">
  import { useForm, Form, Field, Message } from 'notform'
  import { z } from 'zod'

  const { state, id, submit } = useForm({
    schema: z.object({
      name: z.string().min(2)
    })
  })
  </script>

  <template>
    <Form :id="id" @submit="submit">
      <Field name="name" v-slot="{ methods, name }">
        <label :for="name">
          Name
          <input v-model="state.name" type="text" :id="name" :name="name" v-bind="methods"/>
          <Message :name="name" />
        </label>
      </Field>
      <button type="submit">Submit</button>
    </Form>
  </template>
  ```
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Everything you need

#features
  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  UI Agnostic

  #description
  :name-text works with any UI framework or component library. Bring your own design system or use headless components—NotForm adapts to your styling approach without forcing opinions.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-type
  ---
  #title
  Field and Form Level Validation

  #description
  Validate individual fields on blur, change, or submit. Run form-wide validation rules and cross-field dependencies. Get granular control over when and how validation runs.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  Array Fields

  #description
  Dynamically add and remove form fields with full validation support. Perfect for managing lists, nested forms, and complex data structures with type-safe schema validation.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-search
  ---
  #title
  Composition API

  #description
  Built from the ground up with Vue 3's Composition API. Enjoy full TypeScript support, reactive state management, and composable form logic that integrates seamlessly with your components.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-shield-check
  ---
  #title
  Schema-Based Validation

  #description
  Use Zod, Yup, or any standard-schema compatible library. Define your validation rules once and let NotForm handle the rest—from error messages to field-level feedback.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-zap
  ---
  #title
  V-Model Support

  #description
  Works naturally with Vue's v-model directive. Maintain familiar Vue patterns while getting powerful form validation, state management, and submission handling out of the box.
  :::
::

::u-page-section
#title
Why NotForm?

#description
Building forms shouldn't be complicated. NotForm removes the boilerplate and gives you powerful primitives to build forms that just work.

#default

  ::card-group

    :::card
    ---
    icon: i-lucide-shield-check
    title: Type-Safe by Default
    ---
    Full TypeScript support with inferred types from your schema. Get autocomplete, type checking, and compile-time safety throughout your form logic.
    :::

    :::card
    ---
    icon: i-lucide-layers
    title: Minimal Bundle Size
    ---
    Lightweight core with zero dependencies beyond your chosen validation library. Tree-shakeable exports ensure you only ship what you use.
    :::

    :::card
    ---
    icon: i-lucide-code
    title: Developer Experience
    ---
    Intuitive API designed for Vue developers. Clear documentation, helpful error messages, and patterns that feel natural in Vue applications.
    :::

    :::card
    ---
    icon: i-lucide-rocket
    title: Production Ready
    ---
    Battle-tested in real-world applications. Handle complex forms with nested fields, async validation, and advanced state management with confidence.
    :::
  ::
::
