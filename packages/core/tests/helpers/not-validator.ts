import type { StandardSchemaV1 } from '@standard-schema/spec'

export const vendorVersion = {
  vendor: 'not-validator',
  version: 1,
} as const

/**
 * Validates a string value with optional length constraints.
 * @param min Minimum character length (inclusive).
 * @param max Maximum character length (inclusive).
 * @returns A schema object that validates a string value.
 */
export function string(min?: number, max?: number): StandardSchemaV1<string> {
  return {
    '~standard': {
      types: {
        input: '' as string,
        output: '' as string,
      },
      validate(value) {
        if (typeof value !== 'string') {
          return { issues: [{ message: 'Must be a string' }] }
        }

        if (min && value.length < min) {
          return { issues: [{ message: `Must be at least ${min} characters` }] }
        }

        if (max && value.length > max) {
          return { issues: [{ message: `Must be at most ${max} characters` }] }
        }

        return { value }
      },
      ...vendorVersion,
    },
  }
}

/**
 * Validates a numeric value with optional range constraints.
 * @param min Minimum value (inclusive).
 * @param max Maximum value (inclusive).
 * @returns A schema object that validates a numeric value.
 */
export function number(min?: number, max?: number): StandardSchemaV1<number> {
  return {
    '~standard': {
      types: {
        input: 0 as number,
        output: 0 as number,
      },
      validate(value) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
          return { issues: [{ message: 'Must be a number' }] }
        }

        if (min !== undefined && value < min) {
          return { issues: [{ message: `Must be at least ${min}` }] }
        }

        if (max !== undefined && value > max) {
          return { issues: [{ message: `Must be at most ${max}` }] }
        }

        return { value }
      },
      ...vendorVersion,
    },
  }
}

/**
 * Validates a plain object against a shape of field schemas.
 * Each field's issues are reported with the field key prepended to their path.
 * @param shape A record mapping field names to their schemas.
 * @returns A schema object that validates an object value.
 */
export function object<TShape extends Record<string, StandardSchemaV1>>(shape: TShape): StandardSchemaV1<
  { [Key in keyof TShape]: StandardSchemaV1.InferInput<TShape[Key]> },
  { [Key in keyof TShape]: StandardSchemaV1.InferOutput<TShape[Key]> }
> & { shape: TShape } {
  return {
    shape,
    '~standard': {
      types: {
        input: {} as { [Key in keyof TShape]: StandardSchemaV1.InferInput<TShape[Key]> },
        output: {} as { [Key in keyof TShape]: StandardSchemaV1.InferOutput<TShape[Key]> },
      },
      ...vendorVersion,
      validate(value) {
        if (typeof value !== 'object' || value === null) {
          return { issues: [{ message: 'Must be an object' }] }
        }

        const issues: Array<StandardSchemaV1.Issue> = []
        const output: Record<string, unknown> = {}
        const data = value as Record<string, unknown>

        for (const key in shape) {
          const result = shape[key]['~standard'].validate(data?.[key])

          if ('issues' in result && result.issues) {
            issues.push(...result.issues.map(issue => ({
              ...issue,
              path: [key, ...(issue.path ?? [])],
            })))
          } else if ('value' in result) {
            output[key] = result.value
          }
        }

        return issues.length > 0 ? { issues } : { value: output as any }
      },
    },
  }
}

/**
 * Validates an array where every item must pass the provided item schema.
 * Each item's issues are reported with the item index prepended to their path.
 * @param itemSchema The schema every array item is validated against.
 * @param min Minimum number of items (inclusive).
 * @param max Maximum number of items (inclusive).
 * @returns A schema object that validates an array value.
 */
export function array<TItem extends StandardSchemaV1>(itemSchema: TItem, min?: number, max?: number): StandardSchemaV1<
  Array<StandardSchemaV1.InferInput<TItem>>,
  Array<StandardSchemaV1.InferOutput<TItem>>
> & { itemSchema: TItem } {
  return {
    itemSchema,
    '~standard': {
      types: {
        input: [] as Array<StandardSchemaV1.InferInput<TItem>>,
        output: [] as Array<StandardSchemaV1.InferOutput<TItem>>,
      },
      validate(value) {
        if (!Array.isArray(value)) {
          return { issues: [{ message: 'Must be an array' }] }
        }
        if (min !== undefined && value.length < min) {
          return { issues: [{ message: `Must have at least ${min} item${min === 1 ? '' : 's'}` }] }
        }
        if (max !== undefined && value.length > max) {
          return { issues: [{ message: `Must have at most ${max} item${max === 1 ? '' : 's'}` }] }
        }

        const issues: Array<StandardSchemaV1.Issue> = []
        const output: Array<any> = []

        for (const [
          index,
          element,
        ] of value.entries()) {
          const result = itemSchema['~standard'].validate(element)

          if ('issues' in result && result.issues) {
            issues.push(...result.issues.map(issue => ({
              ...issue,
              path: [
                index,
                ...(issue.path ?? []),
              ],
            })))
          } else if ('value' in result) {
            output.push(result.value)
          }
        }

        return issues.length > 0 ? { issues } : { value: output as any }
      },
      ...vendorVersion,
    },
  }
}

/**
 * Wraps a schema so `validate` waits on `gate` before delegating.
 * @template TSchema Inner schema.
 * @param schema Schema to run after the gate.
 * @param gate Promise that must resolve first.
 * @returns Gated schema with the same types.
 */
export function delayed<TSchema extends StandardSchemaV1>(schema: TSchema, gate: Promise<void>): TSchema {
  return {
    ...schema,
    '~standard': {
      ...schema['~standard'],
      async validate(value) {
        await gate
        return schema['~standard'].validate(value)
      },
    },
  } as TSchema
}

/**
 * Wraps a schema so each `validate` waits on `nextGate(callNumber)`.
 * @template TSchema Inner schema.
 * @param schema Schema to run after each gate.
 * @param nextGate Promise for the 1-based call number.
 * @returns Gated schema with the same types.
 */
export function delayedByCall<TSchema extends StandardSchemaV1>(schema: TSchema, nextGate: (callNumber: number) => Promise<void>): TSchema {
  let callCount = 0

  return {
    ...schema,
    '~standard': {
      ...schema['~standard'],
      async validate(value) {
        callCount++
        await nextGate(callCount)
        return schema['~standard'].validate(value)
      },
    },
  } as TSchema
}

export const nameEmailSchema = object({
  email: string(5, 100),
  name: string(2, 50),
})

export const tagsSchema = object({
  tags: array(string(1, 20), 2, 5),
})

/**
 * Schema whose first `validate` waits on `gate` and fails; later calls succeed with `{ value }`.
 * @param gate Promise the first call awaits.
 * @returns A Standard Schema used to race stale validations.
 */
export function createFirstCallBlockingSchema(gate: Promise<void>) {
  let callCount = 0

  return {
    '~standard': {
      types: { input: {} as Record<string, unknown>, output: {} as Record<string, unknown> },
      async validate(value: unknown) {
        callCount++

        if (callCount === 1) {
          await gate
          return { issues: [{ message: 'Stale validation failed' }] }
        }

        return { value }
      },
      ...vendorVersion,
    },
  }
}

/**
 * Schema whose `validate` waits on `nextGate(callNumber)` then returns `nextResult(callNumber)`.
 * @param nextGate Promise to await for this call.
 * @param nextResult Result after the gate resolves.
 * @returns A Standard Schema for overlapping-validation tests.
 */
export function createGatedCallSchema(
  nextGate: (callNumber: number) => Promise<void>,
  nextResult: (callNumber: number, value: unknown) => Promise<StandardSchemaV1.Result<unknown>> | StandardSchemaV1.Result<unknown>,
) {
  let callCount = 0

  return {
    '~standard': {
      types: { input: {} as Record<string, unknown>, output: {} as Record<string, unknown> },
      async validate(value: unknown) {
        const currentCall = ++callCount
        await nextGate(currentCall)
        return nextResult(currentCall, value)
      },
      ...vendorVersion,
    },
  }
}
