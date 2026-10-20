import { addComponent, addImports, createResolver, defineNuxtModule } from '@nuxt/kit'
import packageJson from '../package.json'

const components = [
  'Form',
  'Field',
  'ArrayField',
  'Error',
] as const

const composable = 'useForm' as const

/** Module Options for the `@notform/nuxt`. */
export interface ModuleOptions {
  /** Override the auto-imported name of any component or composable. */
  aliases?: Partial<Record<typeof components[number] | typeof composable, string>>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    compatibility: { nuxt: '>=4.0.0' },
    configKey: 'notform',
    name: packageJson.name,
    version: packageJson.version,
  },

  async setup(resolvedOptions) {
    const { resolvePath } = createResolver(import.meta.url)

    // Resolve the core package entry point
    const notformPath = await resolvePath('notform')

    // Register components respecting with optional consumer-side aliasing
    for (const originalName of components) {
      const nameToRegister = resolvedOptions.aliases?.[originalName] ?? originalName

      addComponent({
        export: originalName, // Actual export from `notform` package
        filePath: notformPath,
        name: nameToRegister, // The name Nuxt will register for auto imports, e.g. `<MyForm>`.
        priority: 1,
      })
    }

    // Register composable respecting with optional consumer-side aliasing
    const composableNameToRegister = resolvedOptions.aliases?.[composable] ?? composable

    addImports({
      as: composableNameToRegister, // The name Nuxt will register for auto imports, e.g. `useMyForm()`.
      from: notformPath,
      name: composable, // Actual export from `notform` package
      priority: 1,
    })
  },
})
