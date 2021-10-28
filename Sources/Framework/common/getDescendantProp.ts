/**
 * getDescendantProp
 * @param obj
 * @param {string} path
 * @returns {any}
 */
export function getDescendantProp(obj: any, path: string | string[]) {
  const arr: string[] = Array.isArray(path) ? [...path] : path.split('.');
  while (arr.length && (obj = obj[arr.shift()!])) {
  }
  return obj;
}
