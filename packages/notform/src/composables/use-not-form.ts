import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotFormContext, UseNotFormOptions, UseNotFormReturn } from '../types/not-form'
import type { Ref } from 'vue'
import { computed, provide, ref, toValue, useId } from 'vue'
import type { ObjectSchema } from '../types/shared'
import { getNotFormContextKey } from '../utils/not-form-context'
import type { DeepPartial, Paths } from '../types/utils'
import { getProperty, parsePath } from 'dot-prop'
import { getObjectPaths, isIssuePathEqual } from '../utils/helpers'

/**
 * Initializes a form instance with validation logic, reactive state, and lifecycle methods.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @param options Configuration object for the form behavior and initial state.
 * @returns The gathered form context object.
 */
function useNotForm<TSchema extends ObjectSchema>(options: UseNotFormOptions<TSchema>): UseNotFormReturn<TSchema> {
  const {
    id = useId(),
    schema: _schema,
    initialErrors: _initialErrors = [],
    initialState: _initialState = {},
    mode = 'eager',
    validateOn = ['blur', 'input', 'change'],
    onValidate,
    onReset,
    onError,
    onSubmit,
  } = options

  /** Active validation schema reference */
  const schema = computed(() => toValue(_schema))
  /** Baseline reactive state at creation */
  const initialState = structuredClone(_initialState) as StandardSchemaV1.InferInput<TSchema>
  /** Baseline validation issues at creation */
  const initialErrors = structuredClone(_initialErrors) as StandardSchemaV1.Issue[]

  /** Internal state set by last custom reset */
  const onResetState = ref<StandardSchemaV1.InferInput<TSchema> | null>(null)
  /** Internal errors set by last custom reset */
  const onResetErrors = ref<StandardSchemaV1.Issue[] | null>(null)

  /** The unified reactive context for the form instance */
  const context: NotFormContext<TSchema> = {
    id,
    schema,
    initialState,
    initialErrors,
    mode,
    validateOn,
    state: ref(structuredClone(initialState)) as Ref<StandardSchemaV1.InferInput<TSchema>>,
    errors: ref([...initialErrors]),
    isValidating: ref(false),
    isSubmitting: ref(false),
    touchedFields: ref(new Set<string>()) as Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>,
    dirtyFields: ref(new Set<string>()) as Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>,

    isValid: computed(() => context.errors.value.length === 0),
    isTouched: computed(() => context.touchedFields.value.size > 0),
    isDirty: computed(() => context.dirtyFields.value.size > 0),


    async validate() {
      context.isValidating.value = true
      try {
        const result = await context.schema.value['~standard'].validate(context.state.value)
        if (result.issues) {
          context.errors.value = [...result.issues]
          onError?.([...result.issues])
          return { issues: result.issues }
        }

        if (onValidate) {
          const customResult = await onValidate(result.value)
          if (customResult === false) {
            const formLevelError: StandardSchemaV1.Issue = { message: 'Validation failed', path: [] }
            context.errors.value = [formLevelError]
            onError?.([formLevelError])
            return { issues: [formLevelError] }
          }
          if (Array.isArray(customResult) && customResult.length > 0) {
            context.errors.value = customResult
            onError?.(customResult)
            return { issues: customResult }
          }
        }

        context.errors.value = []
        return { value: result.value }
      }
      finally {
        context.isValidating.value = false
      }
    },

    async validateField(path) {
      context.isValidating.value = true
      try {
        const result = await context.schema.value['~standard'].validate(context.state.value)
        const pathArray = parsePath(path)
        context.errors.value = context.errors.value.filter(error => !isIssuePathEqual(error.path, pathArray))

        if (result.issues) {
          const errorsForPath = result.issues.filter(error => isIssuePathEqual(error.path, pathArray))
          if (errorsForPath.length > 0) {
            context.errors.value = [...context.errors.value, ...errorsForPath]
            return { issues: errorsForPath }
          }
          return { value: getProperty(context.state.value, path) }
        }
        return { value: getProperty(result.value, path) }
      }
      finally {
        context.isValidating.value = false
      }
    },

    reset(_state?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, _errors?: StandardSchemaV1.Issue[], _validate: boolean = false) {
      if (_state) {
        onResetState.value = structuredClone(_state) as StandardSchemaV1.InferInput<TSchema>
        context.state.value = structuredClone(_state) as StandardSchemaV1.InferInput<TSchema>
      }
      else {
        onResetState.value = null
        context.state.value = structuredClone(initialState)
      }

      if (_errors) {
        onResetErrors.value = structuredClone(_errors)
        context.errors.value = [..._errors]
      }
      else {
        onResetErrors.value = null
        context.errors.value = [...initialErrors]
      }

      context.touchedFields.value.clear()
      context.dirtyFields.value.clear()
      onReset?.()
      if (_validate) context.validate()
    },

    setState(_state: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, _validate: boolean = true) {
      context.state.value = { ...context.state.value, ..._state }

      // Dirty and touch and validate fields
      const paths = getObjectPaths(_state)

      paths.forEach((path) => {
        context.dirtyFields.value.add(path)
        context.touchedFields.value.add(path)

        // Auto validate if allowed
        if (_validate)context.validateField(path)
      })
    },

    setErrors(_errors) {
      context.errors.value = [...context.errors.value, ..._errors]
    },

    clearErrors() {
      context.errors.value = []
    },

    getFieldErrors(field) {
      const pathArray = parsePath(field)
      return context.errors.value.filter(error => isIssuePathEqual(error.path, pathArray))
    },

    touchField(field) {
      context.touchedFields.value.add(field)
    },

    touchAllFields() {
      const paths = getObjectPaths(context.state.value) as Paths<StandardSchemaV1.InferInput<TSchema>>[]
      context.touchedFields.value = new Set(paths)
    },

    dirtyField(field) {
      context.dirtyFields.value.add(field)
    },

    dirtyAllFields() {
      const paths = getObjectPaths(context.state.value) as Paths<StandardSchemaV1.InferInput<TSchema>>[]
      context.dirtyFields.value = new Set(paths)
    },

    async submit(event: Event) {
      context.isSubmitting.value = true

      try {
        // Mark all fields as touched/dirty
        context.touchAllFields()
        context.dirtyAllFields()

        // Validate form state
        const result = await context.validate()

        // Stop submission on failure
        if (result.issues) {
          // Prevent native submission on invalid form
          event.preventDefault()

          // Store errors in reactive state
          const errors = [...result.issues]
          context.errors.value = errors

          // Trigger optional error callback
          onError?.(errors)

          return
        }

        // Determine submission behavior
        // Priority: onSubmit callback > native form submission
        // Rationale: If developer provides onSubmit, they're handling submission in JS
        // and don't want native redirect. This prevents race conditions where the page
        // reloads before their API call/state updates complete.

        if (onSubmit) {
          // Developer provided onSubmit callback → prevent native submission
          // and execute their callback
          event.preventDefault()
          await onSubmit(result.value)
        }
        // If no onSubmit: allow native form submission (action attribute used)
        // Can still use @submit.prevent if they want to block it
      }
      catch {
        // Prevent submission on any unexpected error
        event.preventDefault()

        onError?.([
          {
            message: 'An unexpected error occurred during submission',
            path: [],
          },
        ])
      }
      finally {
        context.isSubmitting.value = false
      }
    },

  }

  provide(getNotFormContextKey<TSchema>(id), context)
  return context
}

export default useNotForm
