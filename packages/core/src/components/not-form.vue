<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'
import { provideNotFormInstance } from '../composables/use-not-form-instance'

// #region Setup

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps<TSchema>>()

provideNotFormInstance<TSchema>(props.form)

// #endregion
</script>

<template>
  <!--
    Reset is always prevented here, regardless of what (if anything) the
    consumer binds to @reset, since a native reset would otherwise clear
    every input before `values` has a chance to react to it.

    Submit is NOT prevented here. `form.submit()` calls `event.preventDefault()`
    itself when it runs, which only happens if the consumer binds @submit to it
    (e.g. `@submit="form.submit"`) — see the NotForm docs for why this matters.
  -->
  <form @reset.prevent>
    <slot />
  </form>
</template>
