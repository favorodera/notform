<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { useAttrs } from 'vue'
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'
import { provideNotFormInstance } from '../utils/instance-utils'

const attributes = useAttrs()

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps<TSchema>>()

provideNotFormInstance(props.instance)
</script>

<template>
  <form v-bind="attributes">
    <slot />
  </form>
</template>
