const fs = require('fs')
const path = require('path')

// Wrap the official GitHub changelog generator so we still get nice
// per‑package CHANGELOGs, and additionally mirror entries into a
// central root CHANGELOG.md.
const createGithubChangelog = require('@changesets/changelog-github')

/** @type {(changeset: any, type: 'major' | 'minor' | 'patch') => Promise<string>} */
module.exports = async (changeset, type) => {
  // Generate the standard per‑package changelog snippet
  const githubChangelog = createGithubChangelog({ repo: 'favorodera/notform' })
  const entry = await githubChangelog(changeset, type)

  // Also append a summarized entry to the root CHANGELOG.md
  try {
    const rootChangelogPath = path.join(__dirname, '..', 'CHANGELOG.md')
    const releases = changeset.releases
      .map((release) => `${release.name}@${release.newVersion}`)
      .join(', ')

    const header = `\n\n## ${releases}\n\n`
    fs.appendFileSync(rootChangelogPath, header + entry)
  } catch {
    // Never fail the release on root changelog issues
  }

  return entry
}

