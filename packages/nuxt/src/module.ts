import { addComponent, addImports, createResolver, defineNuxtModule } from '@nuxt/kit'
import packageJson from '../package.json'

/** Core component exports registered by the Nuxt module. */
const componentNames = ['Form', 'Field', 'ArrayField', 'Error'] as const

/** Core composable name registered by the Nuxt module. */
const formComposableName = 'useForm' as const

/** Configuration for the Nuxt integration. */
export interface ModuleOptions {
  /** Optional alias map, for example `{ Form: 'AppForm' }` to rename the auto-imported exports. */
  aliases?: Partial<Record<typeof componentNames[number] | typeof formComposableName, string>>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    compatibility: { nuxt: '>=4.0.0' },
    configKey: 'notform',
    name: packageJson.name,
    version: packageJson.version,
  },

  /**
   * Registers the core components and composable, applying any configured aliases.
   * @param options Resolved module options.
   * @returns Resolves after the auto-imports are registered.
   */
  async setup(options) {
    const { resolvePath } = createResolver(import.meta.url)

    const corePackagePath = await resolvePath('notform')

    // Register each component under its default name or configured alias.
    for (const componentExportName of componentNames) {
      const registeredComponentName = options.aliases?.[componentExportName] ?? componentExportName

      addComponent({
        export: componentExportName,
        filePath: corePackagePath,
        name: registeredComponentName,
        priority: 1,
      })
    }

    // Register the composable under its default name or configured alias.
    const registeredComposableName = options.aliases?.[formComposableName] ?? formComposableName

    addImports({
      as: registeredComposableName,
      from: corePackagePath,
      name: formComposableName,
      priority: 1,
    })
  },
})
