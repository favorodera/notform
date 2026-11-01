/** What a field id identifies. */
export type FieldIdKind = 'array-field' | 'array-item' | 'field'

let lastIssuedNumber = 0

/**
 * Creates the unique, stable identity of a field.
 *
 * The number in the description is a debugging aid only; always compare ids by reference.
 * @param kind What the id is for.
 * @returns A new symbol, e.g. `notform.field.3`.
 */
export function createFieldId(kind: FieldIdKind): symbol {
  // eslint-disable-next-line unicorn/no-top-level-assignment-in-function
  lastIssuedNumber += 1

  return Symbol(`notform.${kind}.${lastIssuedNumber}`)
}
