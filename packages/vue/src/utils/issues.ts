import type { Issue, IssuePathKey } from '../types/schema'

export function areIssuePathKeysEqual(keyA: IssuePathKey, keyB: IssuePathKey) {
  const unwrappedKeyA = unwrapIssuePathKey(keyA)
  const unwrappedKeyB = unwrapIssuePathKey(keyB)

  if (typeof unwrappedKeyA === 'number' && typeof unwrappedKeyB === 'string') {
    return Number.isSafeInteger(unwrappedKeyA) && String(unwrappedKeyA) === unwrappedKeyB
  }

  if (typeof unwrappedKeyA === 'string' && typeof unwrappedKeyB === 'number') {
    return Number.isSafeInteger(unwrappedKeyB) && unwrappedKeyA === String(unwrappedKeyB)
  }

  return unwrappedKeyA === unwrappedKeyB
}

export function isIssuePathWithinScope(path: NonNullable<Issue['path']>, scope: NonNullable<Issue['path']>) {
  if (path.length < scope.length) {
    return false
  }

  return scope.every((pathKey, index) => {
    return areIssuePathKeysEqual(path[index], pathKey)
  })
}

export function unwrapIssuePathKey(key: IssuePathKey) {
  if (typeof key === 'object' && key !== null && 'key' in key) {
    return key.key
  }

  return key
}
