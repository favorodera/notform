<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import type { NotFormInstance } from '../types/not-form-instance'
import type { ObjectSchema } from '../types/shared'
import { provideNotFormInstance } from '../composables/use-not-form-instance'

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps<TSchema>>()

// `props.form` is typed as `NotFormAPI` (the public surface), but at runtime
// it is always the full `NotFormInstance` created by `useNotForm`. The double-cast
// through `unknown` is needed because `Except` with `requireExactProps` makes the
// types structurally incompatible for a direct assertion.
provideNotFormInstance<TSchema>(props.form as unknown as NotFormInstance<TSchema>)
</script>

<template>
  <!-- Native form element with default reset prevention -->
  <form @reset.prevent>
    <slot />
  </form>
</template>
