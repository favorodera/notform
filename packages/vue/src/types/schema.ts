import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get, Paths, Writable } from 'type-fest'

export type Input<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferInput<TSchema>

export type Issue = StandardSchemaV1.Issue

export type IssuePathKey = NonNullable<Writable<Issue['path']>>[number]

export type ObjectSchema = StandardSchemaV1 & {
  '~standard': StandardSchemaV1['~standard'] & {
    types?: {
      input: object
      output: object
    }
  }
}

export type Output<TSchema extends StandardSchemaV1> = StandardSchemaV1.InferOutput<TSchema>

export type Path<TSchema extends StandardSchemaV1> = Extract<Paths<Input<TSchema>, { maxRecursionDepth: 10 }>, string>

export type PathValue<TSchema extends StandardSchemaV1, TPath extends string> = Get<Input<TSchema>, TPath, { strict: false }>
