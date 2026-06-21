import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * A lightweight Standard Schema compliant validator for testing and prototyping.
 * Covers the most common field types without requiring an external schema library.
 *
 * ```ts
 * const schema = notValidator.object({
 *   name:  notValidator.string(2, 50),
 *   age:   notValidator.number(18),
 *   tags:  notValidator.array(notValidator.string(), 1, 5),
 * })
 * ```
 */
export const notValidator = {
  // PRIMITIVES

  /**
   * Validates a string value with optional length constraints.
   * @param min Minimum character length (inclusive).
   * @param max Maximum character length (inclusive).
   * @returns A schema object that validates a string value.
   */
  string: (min?: number, max?: number): StandardSchemaV1<string> => ({
    '~standard': {
      types: {
        input: '' as string,
        output: '' as string,
      },
      validate(value) {
        if (typeof value !== 'string') {
          return { issues: [{ message: 'Must be a string' }] }
        }
        if (min !== undefined && value.length < min) {
          return { issues: [{ message: `Must be at least ${min} characters` }] }
        }
        if (max !== undefined && value.length > max) {
          return { issues: [{ message: `Must be at most ${max} characters` }] }
        }
        return { value }
      },
      vendor: 'not-validator',
      version: 1,
    },
  }),

  /**
   * Validates a numeric value with optional range constraints.
   * @param min Minimum value (inclusive).
   * @param max Maximum value (inclusive).
   * @returns A schema object that validates a numeric value.
   */
  number: (min?: number, max?: number): StandardSchemaV1<number> => ({
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
      vendor: 'not-validator',
      version: 1,
    },
  }),

  /**
   * Validates a boolean value.
   * @returns A schema object that validates a boolean value.
   */
  boolean: (): StandardSchemaV1<boolean> => ({
    '~standard': {
      types: {
        input: false as boolean,
        output: false as boolean,
      },
      validate(value) {
        return typeof value === 'boolean'
          ? { value }
          : { issues: [{ message: 'Must be a boolean' }] }
      },
      vendor: 'not-validator',
      version: 1,
    },
  }),

  // LITERAL & ENUM

  /**
   * Validates that a value is exactly equal to the provided literal.
   * @param literal The exact value to match against.
   * @returns A schema object that validates a literal value.
   */
  literal: <TLiteral>(literal: TLiteral): StandardSchemaV1<TLiteral> => ({
    '~standard': {
      types: {
        input: literal as TLiteral,
        output: literal as TLiteral,
      },
      validate(value) {
        return value === literal
          ? { value: value as TLiteral }
          : { issues: [{ message: `Must be exactly ${literal}` }] }
      },
      vendor: 'not-validator',
      version: 1,
    },
  }),

  /**
   * Validates that a value is one of the provided allowed values.
   * @param allowedValues The list of accepted values.
   * @returns A schema object that validates an enum value.
   */
  enum: <TEnum>(allowedValues: Array<TEnum>): StandardSchemaV1<TEnum> => ({
    '~standard': {
      types: {
        input: allowedValues[0] as TEnum,
        output: allowedValues[0] as TEnum,
      },
      validate(value) {
        return allowedValues.includes(value as TEnum)
          ? { value: value as TEnum }
          : { issues: [{ message: `Must be one of: ${allowedValues.join(', ')}` }] }
      },
      vendor: 'not-validator',
      version: 1,
    },
  }),

  // COMPOSITE

  /**
   * Validates that a value matches at least one of the provided schemas.
   * Tries each schema in order and passes on the first match.
   * @param schemas The list of candidate schemas to try.
   * @returns A schema object that validates a union value.
   */
  union: <TUnion>(schemas: Array<StandardSchemaV1<TUnion>>): StandardSchemaV1<TUnion> => ({
    '~standard': {
      types: {
        input: undefined as unknown as TUnion,
        output: undefined as unknown as TUnion,
      },
      async validate(value) {
        for (const schema of schemas) {
          const result = await schema['~standard'].validate(value)
          if (!result.issues) return result
        }
        return { issues: [{ message: 'Value did not match any of the expected types' }] }
      },
      vendor: 'not-validator',
      version: 1,
    },
  }),

  /**
   * Validates a plain object against a shape of field schemas.
   * Each field's issues are reported with the field key prepended to their path.
   * @param shape A record mapping field names to their schemas.
   * @returns A schema object that validates an object value.
   */
  object: <TShape extends Record<string, StandardSchemaV1>>(shape: TShape): StandardSchemaV1<
    { [Key in keyof TShape]: StandardSchemaV1.InferInput<TShape[Key]> },
    { [Key in keyof TShape]: StandardSchemaV1.InferOutput<TShape[Key]> }
  > & { shape: TShape } => ({
    shape,
    '~standard': {
      types: {
        input: {} as { [Key in keyof TShape]: StandardSchemaV1.InferInput<TShape[Key]> },
        output: {} as { [Key in keyof TShape]: StandardSchemaV1.InferOutput<TShape[Key]> },
      },
      async validate(value) {
        if (typeof value !== 'object' || value === null) {
          return { issues: [{ message: 'Must be an object' }] }
        }

        const issues: Array<StandardSchemaV1.Issue> = []
        const output: Record<string, unknown> = {}
        const data = value as Record<string, unknown>

        for (const key in shape) {
          const result = await shape[key]['~standard'].validate(data?.[key])

          if ('issues' in result && result.issues) {
            issues.push(...result.issues.map(issue => ({
              ...issue,
              path: [
                key,
                ...(issue.path ?? []),
              ],
            })))
          } else if ('value' in result) {
            output[key] = result.value
          }
        }

        return issues.length > 0 ? { issues } : { value: output as any }
      },
      vendor: 'not-validator',
      version: 1,
    },
  }),

  /**
   * Validates an array where every item must pass the provided item schema.
   * Each item's issues are reported with the item index prepended to their path.
   * @param itemSchema The schema every array item is validated against.
   * @param min Minimum number of items (inclusive).
   * @param max Maximum number of items (inclusive).
   * @returns A schema object that validates an array value.
   */
  array: <TItem extends StandardSchemaV1>(
    itemSchema: TItem,
    min?: number,
    max?: number,
  ): StandardSchemaV1<
    Array<StandardSchemaV1.InferInput<TItem>>,
    Array<StandardSchemaV1.InferOutput<TItem>>
  > & { itemSchema: TItem } => ({
    itemSchema,
    '~standard': {
      types: {
        input: [] as Array<StandardSchemaV1.InferInput<TItem>>,
        output: [] as Array<StandardSchemaV1.InferOutput<TItem>>,
      },
      async validate(value) {
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
          const result = await itemSchema['~standard'].validate(element)

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
      vendor: 'not-validator',
      version: 1,
    },
  }),
}
