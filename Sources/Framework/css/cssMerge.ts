import {classMix} from './classMix';
import {compact} from '@Framework/common/compact';

declare global {
  type TCSSSelectors = string | string[] | object;
}

/**
 * Merge css rules
 * @param args
 * @returns {string}
 */
export function cssMerge(...args: any[]) {
  let ret: string[] = [];
  let item: any;
  for (const i in args) {
    if (typeof (item = args[i]) === 'string') {
      ret.push(item);
    } else if (Array.isArray(item)) {
      ret = ret.concat(item.map(it => Array.isArray(it) ? cssMerge(it) : (typeof it === 'object' ? classMix(it) : it)));
    } else if (typeof item === 'object') {
      ret.push(classMix(item));
    }
  }
  return compact(ret).join(' ');
}
