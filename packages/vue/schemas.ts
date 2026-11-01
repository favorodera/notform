import type { StandardSchemaV1 } from '@standard-schema/spec'

/** Standard Schema vendor metadata shared by every fixture validator. */
export const props = {
  vendor: 'notform-schema',
  version: 1,
} as const

/**
 * Validates an array where every item must pass the provided item schema.
 * Each item's issues are reported with the item index prepended to their path.
 * @template TItem Schema used to validate each array item.
 * @param itemSchema The schema every array item is validated against.
 * @param min Minimum number of items (inclusive).
 * @returns A schema object that validates an array value.
 */
export function array<TItem extends StandardSchemaV1>(itemSchema: TItem, min?: number): StandardSchemaV1<
  StandardSchemaV1.InferInput<TItem>[],
  StandardSchemaV1.InferOutput<TItem>[]
> & { itemSchema: TItem } {
  return {
    itemSchema,
    '~standard': {

      validate(value) {
        if (!Array.isArray(value)) {
          return { issues: [{ message: 'Must be an array' }] }
        }

        if (min !== undefined && value.length < min) {
          return { issues: [{ message: `Must have at least ${min} item${min === 1 ? '' : 's'}` }] }
        }

        const issues: StandardSchemaV1.Issue[] = []
        const output: any[] = []

        // Validates each item.
        for (const [index, element] of value.entries()) {
          const result = itemSchema['~standard'].validate(element)

          if ('issues' in result && result.issues) {
          // Prefixes issues with the item index
            const resultIssues = result.issues.map((issue) => {
              return {
                ...issue,
                path: [
                  index,
                  ...(issue.path ?? []),
                ],
              }
            })

            issues.push(...resultIssues)
          } else if ('value' in result) {
            output.push(result.value)
          }
        }

        return issues.length > 0 ? { issues } : { value: output as any }
      },
      ...props,
    },
  }
}

/**
 * Validates a numeric value with optional range constraints.
 * @param min Minimum value (inclusive).
 * @returns A schema object that validates a numeric value.
 */
export function number(min?: number): StandardSchemaV1<number> {
  return {
    '~standard': {
      validate(value) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
          return { issues: [{ message: 'Must be a number' }] }
        }

        if (min !== undefined && value < min) {
          return { issues: [{ message: `Must be at least ${min}` }] }
        }

        return { value }
      },
      ...props,
    },
  }
}

/**
 * Validates a plain object against a shape of field schemas.
 * Each field's issues are reported with the field key prepended to their path.
 * @template TShape Map of field names to schemas.
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
      ...props,
      validate(value) {
        if (typeof value !== 'object' || value === null) {
          return { issues: [{ message: 'Must be an object' }] }
        }

        const issues: StandardSchemaV1.Issue[] = []
        const output: Record<string, unknown> = {}
        const data = value as Record<string, unknown>

        // Validates each shaped field.
        for (const key in shape) {
          const result = shape[key]['~standard'].validate(data?.[key])

          if ('issues' in result && result.issues) {
            // Prefixes issues with its field key.
            const resultIssues = result.issues.map((issue) => {
              return {
                ...issue,
                path: [key, ...(issue.path ?? [])],
              }
            })

            issues.push(...resultIssues)
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
 * Validates a string value with optional length constraints.
 * @param min Minimum character length (inclusive).
 * @returns A schema object that validates a string value.
 */
export function string(min?: number): StandardSchemaV1<string> {
  return {
    '~standard': {
      validate(value) {
        if (typeof value !== 'string') {
          return { issues: [{ message: 'Must be a string' }] }
        }

        if (min && value.length < min) {
          return { issues: [{ message: `Must be at least ${min} characters` }] }
        }

        return { value }
      },
      ...props,
    },
  }
}
