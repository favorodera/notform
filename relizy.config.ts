import { defineConfig } from 'relizy'

export default defineConfig({
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
  types: {
    build: { semver: 'patch', title: 'Builds' },
    chore: false,
    ci: false,
    docs: { semver: 'patch', title: 'Documentation' },
    feat: { semver: 'minor', title: 'Added' },
    fix: { semver: 'patch', title: 'Fixed' },
    perf: { semver: 'patch', title: 'Performance' },
    refactor: { semver: 'patch', title: 'Refactors' },
    style: false,
    test: false,
  },
})
