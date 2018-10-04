/**
 * Using bit manipulation to decide whether a number is power of 2
 * @param {number} value
 * @returns {number | boolean}
 */
export function isPowerOf2(value: number) {
  return value && !(value & (value - 1));
}
