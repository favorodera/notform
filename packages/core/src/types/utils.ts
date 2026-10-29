import type { PartialDeep } from 'type-fest'

export type DeepPartial<TValue> = PartialDeep<TValue, {
  allowUndefinedInNonTupleArrays: true
  recurseIntoArrays: true
}>
