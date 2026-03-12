// Number validators
export { isPositive, isNegative, isZero } from './validators.js'

// Re-export number checks from primitives for convenience
export {
  isNumber,
  isNaN,
  isFinite,
  isInteger,
  isSafeInteger,
} from '../primitives/number.js'

// Re-export isNumeric from primitives
export { isNumeric } from '../primitives/string.js'
