// import { ref, computed, toValue } from 'vue'
// import type { Ref } from 'vue'
// import { klona } from 'klona/full'
// import type { StandardSchemaV1 } from '@standard-schema/spec'
// import type { DeepPartial, ObjectSchema, Paths } from '../types/shared'
// import type { UseNotFormConfig, UseNotFormInstance } from '../types/use-not-form'

// export default function useNotForm<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): UseNotFormInstance<TSchema> {
//   //  0. TYPE ALIASES
//   type TInput = StandardSchemaV1.InferInput<TSchema>
//   type TOutput = StandardSchemaV1.InferOutput<TSchema>
//   type TIssue = StandardSchemaV1.Issue
//   type TInstance = UseNotFormInstance<TSchema>

//   //  1. INTERNAL BASELINE (The "Source of Truth")
//   // Overwritten by reset(newValues, newErrors)
//   let initialValues = klona(config.initialValues ?? ({} as DeepPartial<TInput>))
//   let initialErrors = klona(config.initialErrors ?? [])

//   //  2. RESOLVE OPTIONS
//   const validateOn = {
//     onBlur: config.validateOn?.onBlur ?? true,
//     onChange: config.validateOn?.onChange ?? true,
//     onInput: config.validateOn?.onInput ?? true,
//     onMount: config.validateOn?.onMount ?? false,
//     onFocus: config.validateOn?.onFocus ?? false,
//   }

//   //  3. REACTIVE STATES
//   const values = ref(klona(initialValues)) as Ref<TInput>
//   const errors = ref(klona(initialErrors)) as Ref<TIssue[]>

//   //  4. COMPUTED STATES
//   const errorsMap = computed(() => {
//     return errors.value.reduce((accumulator, issue) => {
//       const path = issue.path?.join('.') as Paths<TInput>
//       // Ensures only the FIRST error for a specific field is returned.
//       if (path && !accumulator[path]) {
//         accumulator[path] = issue.message
//       }
//       return accumulator
//     }, {} as Partial<Record<Paths<TInput>, string>>)
//   })

//   //  5. METHODS
//   const setValue: TInstance['setValue'] = (path, value) => {
//     // TODO: Implement logic
//   }


//   //  6. ASSEMBLE & SELF-REFERENCE
//   const instance = {
//     values,
//     errors,
//     errorsMap,
//     setValue,
//   } as UseNotFormInstance<TSchema>

//   instance.instance = instance

//   return instance
// }
