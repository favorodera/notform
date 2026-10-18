<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'
import { provideNotFormInstance } from '../utils/instance'

// #region Setup

// Renders a native form, provides its instance, and forwards undeclared attributes.
defineOptions({
  inheritAttrs: false,
})

defineSlots<NotFormSlots>()

/** Form instance provided to descendant fields. */
const props = defineProps<NotFormProps<TSchema>>()

provideNotFormInstance<TSchema>(props.form)

// #endregion
</script>

<template>
  <!-- Prevent native reset so values stay reactive. Submit prevention belongs to form.submit(). -->
  <form
    v-bind="$attrs"
    @reset.prevent
  >
    <slot />
  </form>
</template>
