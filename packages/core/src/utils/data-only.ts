type DataPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export type DataOnly<T> = Pick<T, DataPropertyNames<T>>
