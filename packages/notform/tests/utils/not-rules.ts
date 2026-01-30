/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * Simple standard schema validator for testing
 */
export const notRules = {
  string: (min?: number, max?: number): StandardSchemaV1<string> => ({
    '~standard': {
      version: 1,
      vendor: 'not-rules',
      types: {
        input: '' as string,
        output: '' as string,
      },
      validate(inputValue) {
        if (typeof inputValue !== 'string') {
          return { issues: [{ message: 'Must be a string' }] }
        }
        if (min !== undefined && inputValue.length < min) {
          return { issues: [{ message: `Must be at least ${min} characters` }] }
        }
        if (max !== undefined && inputValue.length > max) {
          return { issues: [{ message: `Must be at most ${max} characters` }] }
        }
        return { value: inputValue }
      },
    },
  }),

  number: (min?: number, max?: number): StandardSchemaV1<number> => ({
    '~standard': {
      version: 1,
      vendor: 'not-rules',
      types: {
        input: 0 as number,
        output: 0 as number,
      },
      validate(inputValue) {
        if (typeof inputValue !== 'number' || isNaN(inputValue)) {
          return { issues: [{ message: 'Must be a number' }] }
        }
        if (min !== undefined && inputValue < min) {
          return { issues: [{ message: `Must be at least ${min}` }] }
        }
        if (max !== undefined && inputValue > max) {
          return { issues: [{ message: `Must be at most ${max}` }] }
        }
        return { value: inputValue }
      },
    },
  }),

  boolean: (): StandardSchemaV1<boolean> => ({
    '~standard': {
      version: 1,
      vendor: 'not-rules',
      types: {
        input: false as boolean,
        output: false as boolean,
      },
      validate(inputValue) {
        return typeof inputValue === 'boolean'
          ? { value: inputValue }
          : { issues: [{ message: 'Must be a boolean' }] }
      },
    },
  }),

  literal: <T>(value: T): StandardSchemaV1<T> => ({
    '~standard': {
      version: 1,
      vendor: 'not-rules',
      types: {
        input: value as T,
        output: value as T,
      },
      validate(inputValue) {
        return inputValue === value
          ? { value: inputValue as T }
          : { issues: [{ message: `Must be exactly ${value}` }] }
      },
    },
  }),

  enum: <T>(values: T[]): StandardSchemaV1<T> => ({
    '~standard': {
      version: 1,
      vendor: 'not-rules',
      types: {
        input: values[0] as T,
        output: values[0] as T,
      },
      validate(inputValue) {
        return values.includes(inputValue as T)
          ? { value: inputValue as T }
          : { issues: [{ message: `Must be one of: ${values.join(', ')}` }] }
      },
    },
  }),

  union: <T>(schemas: StandardSchemaV1<T>[]): StandardSchemaV1<T> => ({
    '~standard': {
      version: 1,
      vendor: 'not-rules',
      types: {
        input: undefined as unknown as T,
        output: undefined as unknown as T,
      },
      async validate(inputValue) {
        for (const schema of schemas) {
          const result = await schema['~standard'].validate(inputValue)
          if (!result.issues) {
            return result
          }
        }
        return { issues: [{ message: 'Invalid union type' }] }
      },
    },
  }),

  object: <TShape extends Record<string, StandardSchemaV1>>(shape: TShape): StandardSchemaV1<
    { [K in keyof TShape]: StandardSchemaV1.InferInput<TShape[K]> },
    { [K in keyof TShape]: StandardSchemaV1.InferOutput<TShape[K]> }
  > & { shape: TShape } => ({
    shape,
    '~standard': {
      version: 1,
      vendor: 'not-rules',
      types: {
        input: {} as { [K in keyof TShape]: StandardSchemaV1.InferInput<TShape[K]> },
        output: {} as { [K in keyof TShape]: StandardSchemaV1.InferOutput<TShape[K]> },
      },
      async validate(inputValue) {
        if (typeof inputValue !== 'object' || inputValue === null) {
          return { issues: [{ message: 'Must be an object' }] }
        }
        const issues: StandardSchemaV1.Issue[] = []
        const data = inputValue as Record<string, unknown>
        const resultValue: Record<string, unknown> = {}

        for (const key in shape) {
          const result = await shape[key]['~standard'].validate(data?.[key])
          if ('issues' in result && result.issues) {
            issues.push(...result.issues.map(issue => ({
              ...issue,
              path: [key, ...(issue.path || [])],
            })))
          }
          else if ('value' in result) {
            resultValue[key] = result.value
          }
        }

        return issues.length > 0 ? { issues } : { value: resultValue as any }
      },
    },
  }),

  array: <TItem extends StandardSchemaV1>(itemSchema: TItem): StandardSchemaV1<
    StandardSchemaV1.InferInput<TItem>[],
    StandardSchemaV1.InferOutput<TItem>[]
  > & { itemSchema: TItem } => ({
    itemSchema,
    '~standard': {
      version: 1,
      vendor: 'not-rules',
      types: {
        input: [] as StandardSchemaV1.InferInput<TItem>[],
        output: [] as StandardSchemaV1.InferOutput<TItem>[],
      },
      async validate(inputValue) {
        if (!Array.isArray(inputValue)) {
          return { issues: [{ message: 'Must be an array' }] }
        }
        const issues: StandardSchemaV1.Issue[] = []
        const resultValue: any[] = []

        for (let i = 0; i < inputValue.length; i++) {
          const result = await itemSchema['~standard'].validate(inputValue[i])
          if ('issues' in result && result.issues) {
            issues.push(...result.issues.map(issue => ({
              ...issue,
              path: [i, ...(issue.path || [])],
            })))
          }
          else if ('value' in result) {
            resultValue.push(result.value)
          }
        }

        return issues.length > 0 ? { issues } : { value: resultValue as any }
      },
    },
  }),
}
