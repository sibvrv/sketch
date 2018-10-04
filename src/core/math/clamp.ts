/**
 * Clamp Value
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(min, value), max);
}
