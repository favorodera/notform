<script setup lang="ts" generic="TSchema extends FormSchema">
import type { FormProps, FormSlots } from '../types/form'
import type { FormSchema } from '../types/schema'

/**
 * `<Form>`: renders a native `<form>` wired to a form created by `useForm()`.
 *
 * Submitting the form runs schema validation and then your `onSubmit`.
 * @example
 * <Form :form="form">
 *   <!-- fields and a submit button -->
 * </Form>
 */

// attributes (class, id, ...) belong on the <form> element, not on this component's wrapper
defineOptions({ inheritAttrs: false })

defineSlots<FormSlots>()

/** `props.form` is the form returned by `useForm()`. */
const props = defineProps<FormProps<TSchema>>()
</script>

<template>
  <!-- `novalidate` turns off the browser's built-in validation so the schema is the only validator -->
  <form
    v-bind="$attrs"
    novalidate
    @submit="props.form.submit"
  >
    <slot />
  </form>
</template>
