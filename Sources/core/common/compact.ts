/**
 * Base Compact Object
 * @param {Object} object
 */
export function compactObject<T>(object: T) {
  const ret: any = {};
  for (const i in object) {
    if (object[i]) {
      ret[i] = object[i];
    }
  }
  return ret;
}

/**
 * Base Compact Object
 * @param {Array} data
 */
export function compactArray(data: any[]) {
  const ret = [];
  for (let len = data.length, i = 0; i < len; i++) {
    if (data[i]) {
      ret.push(data[i]);
    }
  }
  return ret;
}

/**
 * Compact Object or Array
 * @param {object | Array} data
 * @returns {{} | Array}
 */
export function compact(data: object | any[]): any {
  return Array.isArray(data) ? compactArray(data) : (typeof data === 'object' ? compactObject(data) : data);
}
