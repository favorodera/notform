import { defineConfig } from 'relizy'

export default defineConfig({
  projectName: 'notform-monorepo',
  monorepo: {
    versionMode: 'unified',
    packages: [
      'packages/*',
    ],
  },
  changelog: {
    formatCmd: 'pnpm dlx prettier --write CHANGELOG.md',
  },
  excludeAuthors: [
    'dependabot[bot]',
    'renovate[bot]',
    'github-actions[bot]',
  ],
  publish:{
    packageManager: 'pnpm',
    registry: 'https://registry.npmjs.org',
    access: 'public',
    packages: ['packages/*'],
    buildCmd: 'pnpm build',
  },
  types: {
    feat: { title: 'Added', },
    fix: { title: 'Fixed' },
    perf: { title: 'Performance' },
    docs: { title: 'Documentation' },
    style: { title: 'Styling' },
    refactor: { title: 'Refactors' },
    test: { title: 'Tests' },
    build: false,
    ci: false,
    chore: false,
  },
})