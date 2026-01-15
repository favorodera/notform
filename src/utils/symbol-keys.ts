import type { InjectionKey } from 'vue'
import type { Form } from '../types/form'

/** The key used to inject the form factory */
export const formFactoryKey = Symbol('valid:form-factory') as InjectionKey<Form>
