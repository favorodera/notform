import { google } from '@ai-sdk/google'
import { defineConfig } from 'relizy'

export default defineConfig({
  ai: {
    fallback: 'fail',
    provider: 'ai-sdk',
    providerRelease: { enabled: true },
    providers: {
      'ai-sdk': {
        model: google('gemini-3.5-flash-lite'),
        reasoning: 'high',
      },
    },
  },
  monorepo: {
    packages: ['packages/*'],
    versionMode: 'unified',
  },
  projectName: 'notform',
  publish: {
    access: 'public',
    buildCmd: `pnpm build --filter='./packages/*'`,
    packageManager: 'pnpm',
    registry: 'https://registry.npmjs.org',
  },
  templates: {
    changelogTitle: '{{newVersion}} [{{date}}]',
    emptyChangelogContent: 'No relevant changes since last release',
  },
  types: {
    build: false,
    chore: { semver: 'patch', title: 'Chores' },
    ci: false,
    docs: { semver: 'patch', title: 'Documentation' },
    feat: { semver: 'patch', title: 'Features' },
    fix: { semver: 'patch', title: 'Bug Fixes' },
    perf: { semver: 'patch', title: 'Performance' },
    refactor: { semver: 'patch', title: 'Refactors' },
    styles: false,
    test: false,
  },
})
