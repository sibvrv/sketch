/**
 * Simple Loop Helper
 * @param {number} from
 * @param {number} to
 * @param {(index: number) => any} callback
 * @returns {any[]}
 */
export function loop(from: number, to: number, callback: (index: number) => any) {
  const ret = [];
  let result;
  for (let i = from; i < to; i++) {
    result = callback(i);
    if (typeof result !== 'undefined') {
      ret.push(result);
    }
  }
  return ret;
}

/**
 * Loop over elements
 * @param {any[] | object} list
 * @param {(item: any, key: (string | number), inext: number) => any[]} callback
 * @returns {any[]}
 */
export function loopv<T>(list: T[] | { [key: number]: T } | { [key: string]: T }, callback: (item: T, key: string | number, inext: number) => any) {
  const ret = [];
  if (Array.isArray(list) || typeof list === 'object') {
    let index = 0;
    let result: any;
    for (const key in list) {
      if (typeof (result = callback((list as any)[key] as T, key, index++)) !== 'undefined') {
        ret.push(result);
      }
    }
  }
  return ret;
}

/**
 * Array Loop helper
 * @param {any[]} list
 * @param {number} from
 * @param {number} to
 * @param {(index: number) => any} callback
 * @returns {any[]}
 */
export function loop_range<TItem>(list: TItem[], from: number, to: number, callback: (item: TItem, index: number) => any) {
  const ret = [];
  let result;
  for (let i = from; i < to; i++) {
    result = callback(list[i], i);
    if (typeof result !== 'undefined') {
      ret.push(result);
    }
  }
  return ret;
}
