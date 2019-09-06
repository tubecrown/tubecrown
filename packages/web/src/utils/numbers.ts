import millify from 'millify'
import { defaultOptions as millifyDefaultOptions } from 'millify/lib/options'

const millifyShortOptions = {
  ...millifyDefaultOptions,
  precision: 1,
}

export const formatShortNumber = (numberToFormat: number): string => {
  return millify(numberToFormat, millifyShortOptions)
}
