:::writing{variant="document" id="41726" title="Playground.vue"}
<script lang="ts">
import appVue from '../../../public/playground-templates/app.vue?raw'
import tailwindCSS from '../../../public/playground-templates/tailwind.css?raw'
</script>

<!-- eslint-disable no-useless-escape -->
<script setup lang="ts">
import type * as monaco from 'monaco-editor-core'
import { Repl, useStore, useVueImportMap } from '@vue/repl'
import MonacoEditor from '@vue/repl/monaco-editor'
import '@vue/repl/style.css'
import {
  breakpointsTailwind,
  useBreakpoints,
  useClipboard,
  useLocalStorage,
} from '@vueuse/core'

const savedRouteHash = useLocalStorage('notform-playground-route-hash', '')
const previousRouteHash = useLocalStorage('notform-playground-previous-hash', '')

const initialRouteHash = location.hash || savedRouteHash.value

const colorMode = useColorMode()
const theme = computed(() => (colorMode.value === 'dark' ? 'dark' : 'light'))

const breakpoints = useBreakpoints(breakpointsTailwind)
const replLayout = computed(() => (breakpoints.smaller('lg').value ? 'vertical' : 'horizontal'))

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
    zod: 'https://esm.sh/zod?external=vue',
  },
}))

const previewOptions = {
  headHTML: [
    '<script>window.__VUE_PROD_DEVTOOLS__=false<\/script>',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">',
    '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>',
    `<style type="text/tailwindcss">${tailwindCSS}</style>`,
    '<style>body { font-family: var(--font-sans); }</style>',
    '<style>#app { isolation: isolate; }</style>',
  ].join(''),
}

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  stickyScroll: {
    enabled: false,
  },
  tabSize: 2,
}

const defaultFiles = {
  'src/App.vue': appVue,
}

const replStore = useStore(
  {
    builtinImportMap,
    outputMode: ref('preview'),
    showOutput: ref(false),
    typescriptVersion: ref('6.0.3'),
    vueVersion: vueImportMap.vueVersion,
  },
  initialRouteHash,
)

if (!initialRouteHash) {
  replStore.setFiles(defaultFiles, 'src/App.vue')
}

/** Resets the REPL to its default state, saving the current state to the previousRouteHash.value */
function resetToDefault() {
  previousRouteHash.value = replStore.serialize()
  replStore.setFiles(defaultFiles, 'src/App.vue')
}

/** Restores the REPL to the previous state, clearing the previousRouteHash.value */
function restorePrevious() {
  if (!previousRouteHash.value) return

  replStore.deserialize(previousRouteHash.value)
  previousRouteHash.value = ''
}

watchEffect(() => {
  const serializedStore = replStore.serialize()

  savedRouteHash.value = serializedStore
  history.replaceState({}, '', serializedStore)
})
</script>

<template>
  <div
    class="
      grid grid-cols-1 grid-rows-[auto_1fr] overflow-hidden block-full
      inline-full
    "
  >
    <div
      class="
        flex shrink-0 items-center justify-between gap-1 overflow-x-auto
        border-be border-default px-2 block-10

        md:px-3
      "
    >
      <Button
        v-if="previousRouteHash"
        icon="tabler:rotate-clockwise-2"
        variant="ghost"
        label="Restore"
        size="sm"
        @click="restorePrevious"
      />

      <div class="ms-auto flex items-center gap-1">
        <Button
          icon="tabler:rotate"
          variant="ghost"
          label="Reset"
          size="sm"
          @click="resetToDefault"
        />

        <Button
          :icon="clipboard.copied.value ? 'tabler:check' : 'tabler:link'"
          :label="clipboard.copied.value ? 'Copied' : 'Share'"
          variant="ghost"
          size="sm"
          @click="clipboard.copy()"
        />
      </div>
    </div>

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
      :editor-options="{
        monacoOptions,
        autoSaveText: false,
        showErrorText: false,
      }"
      :preview-options="previewOptions"
      preview-theme
      class="block-full! inline-full!"
    />
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
