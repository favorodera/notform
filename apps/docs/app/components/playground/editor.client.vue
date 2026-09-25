<script lang="ts">
import defaultVue from '../../../public/playground-templates/default.vue?raw'
import tailwindCSS from '../../../public/playground-templates/tailwind.css?raw'
</script>

<!-- eslint-disable no-useless-escape -->
<script setup lang="ts">
import type * as monaco from 'monaco-editor-core'
import { Repl, type SFCOptions, useStore, useVueImportMap } from '@vue/repl'
import MonacoEditor from '@vue/repl/monaco-editor'
import '@vue/repl/style.css'
import { breakpointsTailwind, useBreakpoints, useClipboard, useLocalStorage } from '@vueuse/core'

const savedRouteHash = useLocalStorage('notform-playground-route-hash', '')

const colorMode = useColorMode()
const theme = computed(() => (colorMode.value === 'dark' ? 'dark' : 'light'))

const breakpoints = useBreakpoints(breakpointsTailwind)
const replLayout = computed(() => (breakpoints.smaller('lg').value ? 'vertical' : 'horizontal'))

// If the URL has a hash (e.g. an explicitly shared link), it takes priority.
// Otherwise fall back to the last saved local session.
const initialRouteHash = location.hash || (savedRouteHash.value
  ? `#${savedRouteHash.value.replace(/^#/, '')}`
  : '')

// If we loaded from a URL hash, make sure localStorage reflects it right away,
// so a later plain visit (no hash) restores this rather than a stale save.
if (location.hash) {
  savedRouteHash.value = location.hash
}

const clipboard = useClipboard({
  legacy: true,
  source: () => location.href,
})

const vueImportMap = useVueImportMap({
  runtimeDev: 'https://esm.sh/vue@3.5/dist/vue.esm-browser.js',
  runtimeProd: 'https://esm.sh/vue@3.5/dist/vue.esm-browser.prod.js',
  serverRenderer: 'https://esm.sh/@vue/server-renderer@3.5/dist/server-renderer.esm-browser.js',
})

const builtinImportMap = computed(() => ({
  imports: {
    ...vueImportMap.importMap.value.imports,
    notform: 'https://esm.sh/notform?external=vue',
    zod: 'https://esm.sh/zod@4?external=vue',
  },
}))

const previewOptions = {
  headHTML: [
    '<script>window.__VUE_PROD_DEVTOOLS__=false<\/script>',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:ital,wght@0,100..900;1,100..900&family=Geist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">',
    '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>',
    `<style type="text/tailwindcss">${tailwindCSS}</style>`,
    '<style>body { font-family: var(--font-sans); }</style>',
    '<style>#app { isolation: isolate; }</style>',
  ].join(''),
}

const sfcOptions = computed<SFCOptions>(() => ({
  script: {
    inlineTemplate: vueImportMap.productionMode.value,
    isProd: vueImportMap.productionMode.value,
    propsDestructure: true,
  },
  style: {
    isProd: vueImportMap.productionMode.value,
  },
  template: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag === 'mjx-container' || tag.startsWith('custom-'),
    },
    isProd: vueImportMap.productionMode.value,
  },
}))

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  stickyScroll: {
    enabled: false,
  },
  tabSize: 2,
}

const replStore = useStore({
  builtinImportMap,
  outputMode: ref('preview'),
  sfcOptions,
  showOutput: ref(false),
  typescriptVersion: ref('6.0.3'),
  vueVersion: vueImportMap.vueVersion,
}, initialRouteHash)

/**
 * Resets the playground to its default state.
 * Clears the URL hash and saved localStorage state to prevent restoring
 * the code from either source.
 */
function resetToDefault() {
  replStore.setFiles({ 'src/App.vue': defaultVue }, 'src/App.vue')

  savedRouteHash.value = ''

  if (location.hash) {
    history.replaceState({}, '', location.pathname)
  }
}

const hasInitialRouteHash = !!initialRouteHash

if (!hasInitialRouteHash) {
  replStore.setFiles({ 'src/App.vue': defaultVue }, 'src/App.vue')
}

const areThereChanges = ref(hasInitialRouteHash)

watchEffect(() => {
  const serializedStore = replStore.serialize()

  const isDefaultStoreState = !hasInitialRouteHash && replStore.getFiles()['App.vue']?.trimEnd() === defaultVue.trimEnd()
  areThereChanges.value = !isDefaultStoreState

  if (isDefaultStoreState) {
    if (location.hash) {
      history.replaceState({}, '', location.pathname)
    }

    savedRouteHash.value = ''
    return
  }

  history.replaceState({}, '', serializedStore)
  savedRouteHash.value = serializedStore
})
</script>

<template>
  <div
    class="
      flex flex-col overflow-hidden rounded-xl border border-default bg-default
      shadow-xs shadow-neutral-800 block-full inline-full
    "
  >
    <div
      class="
        flex shrink-0 items-center justify-between gap-2 border-be
        border-default bg-muted/30 px-4 py-2
      "
    >
      <h1
        class="text-xs font-semibold tracking-wider text-highlighted uppercase"
      >
        NotForm Playground
      </h1>

      <div class="flex items-center gap-2">
        <Button
          icon="tabler:rotate"
          label="Reset"
          variant="outline"
          size="sm"
          @click="resetToDefault"
        />

        <Button
          :icon="clipboard.copied.value ? 'tabler:check' : 'tabler:share'"
          :label="clipboard.copied.value ? 'Copied!' : 'Share'"
          variant="outline"
          size="sm"
          @click="clipboard.copy()"
        />
      </div>
    </div>

    <div class="relative flex flex-1 flex-col inline-full min-block-0">
      <Repl
        :store="replStore"
        :editor="MonacoEditor"
        :theme="theme"
        :layout="replLayout"
        :show-compile-output="false"
        :show-ts-config="false"
        :show-import-map="true"
        :clear-console="false"
        :auto-resize="true"
        :editor-options="{ monacoOptions, autoSaveText: false,showErrorText:false }"
        :preview-options="previewOptions"
        preview-theme
        class="flex-1! block-full! inline-full!"
      />
    </div>
  </div>
</template>

<style lang="css">
@reference "../../assets/css/main.css";

.iframe-container iframe {
  @apply bg-default! p-2;
}

.monaco-editor {
  --vscode-editor-background: var(--ui-bg) !important;
  --vscode-editor-foreground: var(--ui-text) !important;
  --vscode-editorGutter-background: var(--ui-bg) !important;
}

.vue-repl,
.dark .vue-repl {
  --bg: var(--ui-bg);
  --bg-soft: var(--ui-bg-muted);
  --border: var(--ui-border);
  --text-light: var(--ui-text-muted);
  --color-branding: var(--ui-primary);
  --color-branding-dark: var(--ui-primary);

  & .file-selector {
    @apply px-4;
  }

  & .output-container {
    @apply h-full;
  }

  & .tab-buttons {
    @apply hidden;
  }

  & .import-map-wrapper {
    @apply bg-none;
  }
}
</style>
