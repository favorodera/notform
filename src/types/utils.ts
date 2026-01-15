/**
 * Recursively makes all properties in a type optional, including nested objects and array elements.
 *
 * @template T - The type to make deeply partial
 * @example
 * type User = { name: string; address: { city: string } }
 * type PartialUser = DeepPartial<User>
 * // Result: { name?: string; address?: { city?: string } }
 */
export type DeepPartial<T> = T extends Array<infer ArrayElement>
  ? Array<DeepPartial<ArrayElement>>
  : T extends ReadonlyArray<infer ArrayElement>
    ? ReadonlyArray<DeepPartial<ArrayElement>>
    : T extends object
      ? { [Key in keyof T]?: DeepPartial<T[Key]> }
      : T

/**
 * Recursively makes all properties in a type required, including nested objects and array elements.
 *
 * @template T - The type to make deeply required
 * @example
 * type User = { name?: string; address?: { city?: string } }
 * type RequiredUser = DeepRequired<User>
 * // Result: { name: string; address: { city: string } }
 */
export type DeepRequired<T> = T extends Array<infer ArrayElement>
  ? Array<DeepRequired<ArrayElement>>
  : T extends ReadonlyArray<infer ArrayElement>
    ? ReadonlyArray<DeepRequired<ArrayElement>>
    : T extends object
      ? { [Key in keyof T]-?: DeepRequired<T[Key]> }
      : T
