<script lang="ts" setup generic="TSchema extends Schema">
import type { Form, FormEmits, FormProps } from '@/types/form'
import type { Schema } from '@/types/shared'
import { klona } from 'klona'
import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
import * as zod from 'zod/v4/core'

// Props
const props = withDefaults(defineProps<FormProps<TSchema>>(), {
  mode: 'lazy',
  validateOn: () => ['blur', 'input'],
})


// Emits
const emit = defineEmits<FormEmits<TSchema>>()

// Internal state
/** Stores current validation errors, keyed by field path */
const _errors = ref <zod.$ZodErrorTree<TSchema>['properties']>({})

/** Stores set of touched fields (fields that have been blurred) */
const _touchedFields = ref<Set<string>>(new Set())

/** Tracks submission status */
const _isSubmitting = ref(false)

/** Deep copy of initial state for dirty checking. Captured once on component creation. */
const _initialState = klona(toRaw(props.state))


// Computed properties
/** Form validity based on presence of errors. */
const _isValid = computed(() => Object.keys(_errors.value).length === 0)


// Methods


// Form factory
const form: Form<TSchema> = {
  state: computed(() => props.state),

  errors: computed(() => _errors.value),

  mode: props.mode,

  validateOn: props.validateOn,

  async validateForm() {

    try {
      await zod.parseAsync(props.schema, props.state)
      _errors.value = {}
      emit('validate', true)
      return true
    }
    catch (error) {
      if (error instanceof zod.$ZodError) {
        _errors.value = zod.treeifyError(error as zod.$ZodError<TSchema>).properties
        emit('error', _errors.value)
        emit('validate', false)
      }
      return false
    }
  },
}


// Lifecycle hooks
onMounted(async () => {

  await nextTick()

  if (props.validateOn.includes('mount')) {
    form.validateForm()
  }
})


// Watchers


// TODO:TEST ONLY - Will remove
watch(() => props.state, () => {
  form.validateForm()
}, { deep: true })


// TODO: Provide and inject factory


// Expose form factory to parent
defineExpose(form)
</script>

<template>
<form novalidate>
  <slot />
  {{ _initialState }}
</form>
</template>
