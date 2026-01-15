import { inject } from 'vue'
import { formFactoryKey } from '../utils/symbol-keys'
import type { Form } from '../types/form'
import type { Schema } from '../types/shared'

/** The form context composable used to attach fields to a form */
export default function<TSchema extends Schema = Schema> () {
  const context = inject(formFactoryKey)
  
  if (!context) {
    throw new Error(
      'useFormContext must be used within a Form component. Make sure your Field or ArrayField component is wrapped in a <ValidForm> component.',
    )
  }
  
  return context as Form<TSchema>
}
