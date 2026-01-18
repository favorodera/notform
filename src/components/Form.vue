<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { FormProps, FormSlots } from '../types/form'
import type { ObjectSchema } from '../types/shared'
import { withContext } from '../utils/form-context'

/**
 * A wrapper component that provides form context to its descendants.
 * It uses the withContext utility to retrieve a form instance previously initialized with useForm.
 * This component handles the structural rendering of the form element and binds the context to the default slot.
 */

const props = defineProps<FormProps<TSchema>>()

/**
 * Available slots for the Form component.
 * default: Receives the full form context for custom rendering.
 */
defineSlots<FormSlots<TSchema>>()

// Access the form context created by the useForm composable using the provided ID
const form = withContext<TSchema>(props.id)
</script>

<template>
  <form>
    <!-- Render the content and expose the form context properties -->
    <slot v-bind="form" />
  </form>
</template>
