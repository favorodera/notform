#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';

/**
 * Script to combine CHANGELOG.md files from all packages into the root CHANGELOG.md.
 */

// Configuration
const PACKAGES_DIRECTORY_NAME = 'packages';
const ROOT_CHANGELOG_FILENAME = 'CHANGELOG.md';

interface PackageDirectory {
  name: string;
  path: string;
}

interface PackageJson {
  name?: string;
  version?: string;
  [key: string]: unknown;
}

interface ChangelogEntry {
  packageName: string;
  version: string;
  content: string;
}

/**
 * Get all package directories in the packages folder.
 */
function getPackageDirectories(): PackageDirectory[] {
  const packagesPath = path.join(process.cwd(), PACKAGES_DIRECTORY_NAME);

  if (!fs.existsSync(packagesPath)) {
    console.error(`Packages directory not found: ${packagesPath}`);
    process.exit(1);
  }

  const directories = fs.readdirSync(packagesPath, { withFileTypes: true });

  return directories
    .filter(directory => directory.isDirectory())
    .map(directory => ({
      name: directory.name,
      path: path.join(packagesPath, directory.name)
    }));
}

/**
 * Get package info from its package.json.
 */
function getPackageInfo(packagePath: string): { name: string; version: string } | null {
  const packageJsonPath = path.join(packagePath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  try {
    const packageJson: PackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf8')
    );
    return {
      name: packageJson.name || 'unknown',
      version: packageJson.version || '0.0.0'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error reading package.json in ${packagePath}:`, errorMessage);
    process.exit(1);
  }
}

/**
 * Read the CHANGELOG.md from a package directory.
 */
function readChangelog(packageDir: PackageDirectory): ChangelogEntry | null {
  const changelogPath = path.join(packageDir.path, 'CHANGELOG.md');

  if (!fs.existsSync(changelogPath)) {
    console.log(`No CHANGELOG.md found for ${packageDir.name}`);
    return null;
  }

  const packageInfo = getPackageInfo(packageDir.path);
  if (!packageInfo) {
    console.log(`No package.json found for ${packageDir.name}`);
    return null;
  }

  try {
    const content = fs.readFileSync(changelogPath, 'utf8');
    console.log(`Read changelog for ${packageInfo.name}`);

    return {
      packageName: packageInfo.name,
      version: packageInfo.version,
      content: content.trim()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error reading changelog for ${packageDir.name}:`, errorMessage);
    process.exit(1);
  }
}

/**
 * Parse changelog content to extract version sections.
 */
function parseChangelog(entry: ChangelogEntry): Map<string, { changes: string; date?: string }> {
  const versionMap = new Map<string, { changes: string; date?: string }>();
  const lines = entry.content.split('\n');

  let currentVersion = '';
  let currentChanges: string[] = [];

  for (const line of lines) {
    // Match version headers like "## 1.0.0-alpha.8"
    const versionMatch = line.match(/^##\s+([\d.]+(?:-[\w.]+)?)/);

    if (versionMatch) {
      // Save previous version if exists
      if (currentVersion && currentChanges.length > 0) {
        versionMap.set(currentVersion, {
          changes: currentChanges.join('\n').trim()
        });
      }

      // Start new version
      currentVersion = versionMatch[1];
      currentChanges = [];
    } else if (currentVersion) {
      // Skip the package title (first h1)
      if (!line.startsWith('# ')) {
        currentChanges.push(line);
      }
    }
  }

  // Save last version
  if (currentVersion && currentChanges.length > 0) {
    versionMap.set(currentVersion, {
      changes: currentChanges.join('\n').trim()
    });
  }

  return versionMap;
}

/**
 * Combine all package changelogs into a single root changelog file.
 */
function combineChangelogsByVersion(entries: ChangelogEntry[]): void {
  const rootChangelogPath = path.join(process.cwd(), ROOT_CHANGELOG_FILENAME);

  // Parse all changelogs and organize by version
  // Outer map: version -> Map<packageName, changes>
  const versionDataMap = new Map<string, Map<string, string>>();

  entries.forEach(entry => {
    const packageVersions = parseChangelog(entry);

    packageVersions.forEach((versionData, version) => {
      if (!versionDataMap.has(version)) {
        versionDataMap.set(version, new Map());
      }

      versionDataMap.get(version)!.set(entry.packageName, versionData.changes);
    });
  });

  // Sort versions (newest first)
  const sortedVersions = Array.from(versionDataMap.keys()).sort((versionA, versionB) => {
    // Simple version comparison (works for semver-like versions)
    const partsA = versionA.split(/[.-]/).map(part => isNaN(Number(part)) ? part : Number(part));
    const partsB = versionB.split(/[.-]/).map(part => isNaN(Number(part)) ? part : Number(part));

    const maxLength = Math.max(partsA.length, partsB.length);
    for (let index = 0; index < maxLength; index++) {
      const partA = partsA[index] ?? 0;
      const partB = partsB[index] ?? 0;

      if (typeof partA === 'number' && typeof partB === 'number') {
        if (partA !== partB) return partB - partA;
      } else {
        const stringA = String(partA);
        const stringB = String(partB);
        if (stringA !== stringB) return stringB.localeCompare(stringA);
      }
    }
    return 0;
  });

  // Create header
  const header = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

`;

  // Build combined content
  let combinedContent = header;

  sortedVersions.forEach(version => {
    const packageChanges = versionDataMap.get(version)!;

    combinedContent += `## [${version}]\n\n`;

    // If there are multiple packages with changes, show them separately
    if (packageChanges.size > 1) {
      packageChanges.forEach((changes, packageName) => {
        combinedContent += `### ${packageName}\n\n`;
        combinedContent += `${changes}\n\n`;
      });
    } else {
      // If only one package, just show the changes directly
      const changes = Array.from(packageChanges.values())[0];
      combinedContent += `${changes}\n\n`;
    }

    combinedContent += `---\n\n`;
  });

  // Write to root
  try {
    fs.writeFileSync(rootChangelogPath, combinedContent, 'utf8');
    console.log(`\nCombined changelog written to ${ROOT_CHANGELOG_FILENAME}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error writing root changelog:`, errorMessage);
    process.exit(1);
  }
}

/**
 * Main entrance point.
 */
function main(): void {
  console.log('Combining package changelogs...\n');

  const packageDirectories = getPackageDirectories();

  if (packageDirectories.length === 0) {
    console.error('No packages found');
    process.exit(1);
  }

  const changelogEntries: ChangelogEntry[] = [];

  packageDirectories.forEach(packageDir => {
    const entry = readChangelog(packageDir);
    if (entry) {
      changelogEntries.push(entry);
    }
  });

  if (changelogEntries.length === 0) {
    console.error('\nNo changelogs found to combine');
    process.exit(1);
  }

  // Sort by package name for consistency
  changelogEntries.sort((a, b) => a.packageName.localeCompare(b.packageName));

  combineChangelogsByVersion(changelogEntries);

  console.log(`Combined ${changelogEntries.length} package changelog(s)`);
}

main();