import { describe, expect, it } from 'vitest'
import { createValidationRunRegistry } from '../../src/factories/create-validation-run-registry'

describe('createValidationRunRegistry', () => {
  it('numbers runs in ascending order and tracks them until they finish', () => {
    const runs = createValidationRunRegistry()
    const first = runs.startRun('field', 'name')
    const second = runs.startRun('field', 'email')

    expect(second.id).toBeGreaterThan(first.id)
    expect(runs.activeRuns.size).toBe(2)

    runs.finishRun(first)
    runs.finishRun(first)

    expect(runs.activeRuns.size).toBe(1)
  })

  it('makes an older run of the same field stale', () => {
    const runs = createValidationRunRegistry()
    const older = runs.startRun('field', 'name')
    const newer = runs.startRun('field', 'name')

    expect(older.isStale).toBe(true)
    expect(newer.isStale).toBe(false)
    expect(runs.activeRuns.size).toBe(1)
  })

  it('leaves runs of other fields alone', () => {
    const runs = createValidationRunRegistry()
    const name = runs.startRun('field', 'name')

    runs.startRun('field', 'email')

    expect(name.isStale).toBe(false)
    expect(runs.activeRuns.size).toBe(2)
  })

  it('lets a form run replace every older field run', () => {
    const runs = createValidationRunRegistry()
    const name = runs.startRun('field', 'name')
    const email = runs.startRun('field', 'email')

    runs.startRun('form')

    expect(name.isStale).toBe(true)
    expect(email.isStale).toBe(true)
  })

  it('never lets a field run replace a form run', () => {
    const runs = createValidationRunRegistry()
    const form = runs.startRun('form')

    runs.startRun('field', 'name')

    expect(form.isStale).toBe(false)
  })

  it('never lets a field run or a form run cancel a submit in progress', () => {
    const runs = createValidationRunRegistry()
    const submit = runs.startRun('submit')

    runs.startRun('field', 'name')
    runs.startRun('form')

    expect(submit.isStale).toBe(false)
  })

  it('lets a new submit replace older runs of any kind, including a previous submit', () => {
    const runs = createValidationRunRegistry()
    const name = runs.startRun('field', 'name')
    const email = runs.startRun('field', 'email')
    const firstSubmit = runs.startRun('submit')
    const secondSubmit = runs.startRun('submit')

    expect(name.isStale).toBe(true)
    expect(email.isStale).toBe(true)
    expect(firstSubmit.isStale).toBe(true)
    expect(secondSubmit.isStale).toBe(false)
  })

  it('marks every run stale and empties the list on demand', () => {
    const runs = createValidationRunRegistry()
    const name = runs.startRun('field', 'name')
    const submit = runs.startRun('submit')

    runs.markAllRunsStale()

    expect(name.isStale).toBe(true)
    expect(submit.isStale).toBe(true)
    expect(runs.activeRuns.size).toBe(0)
  })
})
