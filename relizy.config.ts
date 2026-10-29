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
  projectName: 'notform-monorepo',
  publish: {
    access: 'public',
    buildCmd: 'pnpm build',
    packageManager: 'pnpm',
    packages: ['packages/*'],
    registry: 'https://registry.npmjs.org',
  },
  safetyCheck: Boolean(process.env.CI),
  types: {
    build: { semver: 'patch', title: 'Builds' },
    chore: { semver: 'patch', title: 'Chores' },
    ci: { semver: 'patch', title: 'Continuos Integrations' },
    docs: { semver: 'patch', title: 'Documentation' },
    feat: { semver: 'patch', title: 'Added' },
    fix: { semver: 'patch', title: 'Fixed' },
    perf: { semver: 'patch', title: 'Performance' },
    refactor: { semver: 'patch', title: 'Refactors' },
    test: { semver: 'patch', title: 'Tests' },
  },
})
