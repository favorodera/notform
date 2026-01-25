---
seo:
  title: Valid Documentation
  description: Effortless Vue Forms Validation
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
Effortless [Vue]{class="text-vue"} Form [Valid]{class="text-vue"}ation.

#description
Valid is a standard-schema based validation library for Vue that handles errors, validation, submission, and form state—so you can focus on building great user experiences.

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
  to: https://github.com/favorodera/valid
  target: _blank
  ---
  Star on GitHub
  :::

#default
  :::prose-pre
  ---
  code: |
    <script setup lang="ts">
    import {useForm,Form,Field} from 'valid'
    import {z} from 'zod'

    const {state,id,submit}= useForm({
      schema:z.object({name:z.string()})
    })
    </script>

    <template>
    <Form :id="id" @submit="submit">
      <Field name="name" v-slot="{methods,name}">
        <input v-model="state.name" type="text" :name="name" v-bind="methods"/>
      </Field>
      <button type="submit">Submit</button>
    </Form>
    </template>
  filename: index.vue
  ---

  ```vue [index.vue]
  <script setup lang="ts">
  import {useForm,Form,Field} from 'valid'
  import {z} from 'zod'

  const {state,id,submit}= useForm({
    schema:z.object({name:z.string()})
  })
  </script>

  <template>
    <Form :id="id" @submit="submit">
      <Field name="name" v-slot="{methods,name}">
        <input v-model="state.name" type="text" :name="name" v-bind="methods"/>
      </Field>
      <button type="submit">Submit</button>
    </Form>
  </template>
  ```
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Powered by Nuxt UI components

#links
  :::u-button
  ---
  color: neutral
  size: lg
  target: _blank
  to: https://ui.nuxt.com/docs/getting-started/installation/nuxt
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore Nuxt UI
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  100+ UI Components

  #description
  Access the complete Nuxt UI component library. From badges to modals, everything styled and accessible out of the box.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-type
  ---
  #title
  Beautiful Typography

  #description
  Pre-styled prose components with perfect visual harmony. No need for @tailwindcss/typography - get precise control over every element.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  Rich Prose Components

  #description
  Accordions, cards, callouts, tabs, steps, code blocks, and more - all provided by Nuxt UI for interactive documentation.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-search
  ---
  #title
  Built-in Search

  #description
  Full-text search with ContentSearch component. No need for Algolia - instant, relevant results with keyboard shortcuts (⌘K).
  :::

  :::u-page-feature
  ---
  icon: i-lucide-navigation
  ---
  #title
  Smart Navigation

  #description
  Auto-generated navigation with ContentNavigation and ContentToc components. Sticky table of contents and prev/next links.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-moon
  ---
  #title
  Dark Mode Ready

  #description
  Automatic theme switching with smooth transitions. Respects system preferences and remembers user choice.
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Enhanced with Nuxt Content

#links
  :::u-button
  ---
  color: neutral
  size: lg
  target: _blank
  to: https://content.nuxt.com/docs/getting-started/installation
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore Nuxt Content
  :::

#features
  :::u-page-feature
  ---
  icon: i-simple-icons-markdown
  ---
  #title
  MDC Enhanced Markdown

  #description
  Write in Markdown while embedding Vue components. Seamlessly integrate interactive elements in your content.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-text
  ---
  #title
  File-based Routing

  #description
  Organize content in folders and files. Your documentation structure automatically becomes your navigation.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-code
  ---
  #title
  Syntax Highlighting

  #description
  Beautiful code blocks with language detection, line numbers, and copy buttons. Support for 100+ languages.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-database
  ---
  #title
  Content Database

  #description
  Query your content with a MongoDB-like API. Filter, sort, and search through your documentation programmatically.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-code
  ---
  #title
  Frontmatter Support

  #description
  Add metadata to your content files. Define SEO tags, navigation properties, and custom fields.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-git-branch
  ---
  #title
  Version Control

  #description
  Content lives in your repository. Branch, review, and deploy documentation alongside your code.
  :::
::

::u-page-section{class="dark:bg-gradient-to-b from-neutral-950 to-neutral-900"}
  :::u-page-c-t-a
  ---
  links:
    - label: Start building
      to: '/getting-started'
      trailingIcon: i-lucide-arrow-right
    - label: View on GitHub
      to: 'https://github.com/nuxt-ui-templates/docs'
      target: _blank
      variant: subtle
      icon: i-simple-icons-github
  title: Ready to build an amazing documentation?
  description: Join thousands of developers building with Nuxt and Nuxt UI. Get this template and start shipping today.
  class: dark:bg-neutral-950
  ---

  :stars-bg
  :::
::
