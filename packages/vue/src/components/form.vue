<script setup lang="ts" generic="TSchema extends FormSchema">
import type { FormProps, FormSlots } from '../types/form'
import type { FormSchema } from '../types/schema'

/**
 * `<Form>`: renders a native `<form>` wired to a form created by `useForm()`.
 * Submitting runs schema validation, then your `onSubmit`; resetting calls `form.reset()`.
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
  <form
    v-bind="$attrs"
    @submit="props.form.submit"
    @reset.prevent="props.form.reset"
  >
    <slot />
  </form>
</template>
