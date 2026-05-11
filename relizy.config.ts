import { defineConfig } from 'relizy'

export default defineConfig({
  projectName: 'notform-monorepo',
  monorepo: {
    versionMode: 'unified',
    packages: ['packages/*'],
  },
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    'github-actions[bot]',
  ],
  publish: {
    packageManager: 'pnpm',
    registry: 'https://registry.npmjs.org',
    access: 'public',
    packages: ['packages/*'],
    buildCmd: 'pnpm build',
  },
  types: {
    feat: { title: 'Added', semver: 'minor' },
    fix: { title: 'Fixed', semver: 'patch' },
    perf: { title: 'Performance', semver: 'patch' },
    docs: { title: 'Documentation', semver: 'patch' },
    style: { title: 'Styling', semver: 'patch' },
    refactor: { title: 'Refactors', semver: 'patch' },
    test: { title: 'Tests', semver: 'patch' },
    build: { title: 'Builds', semver: 'patch' },
    ci: { title: 'Continuous Integrations', semver: 'patch' },
    chore: { title: 'Chores', semver: 'patch' },
  },
})
