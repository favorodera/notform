<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed, reactive } from 'vue'
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema } from '../types/shared'
import { useNotFormInstance } from '../utils/instance-utils'

defineOptions({
  inheritAttrs: false,
})

defineSlots<NotFieldSlots<TSchema>>()

const props = defineProps<NotFieldProps<TSchema>>()


// BASELINE FORM INSTANCE
const formInstance = useNotFormInstance(props.form)

const path = computed(() => props.path)
const errors = formInstance.getFieldErrors(path.value)
const validate = () => formInstance.validateField(path.value)

// INSTANCE
const fieldInstance = reactive({
  path: path.value,
  errors: errors,
  validate,
})
</script>

<template>
  <slot v-bind="fieldInstance" />
</template>
