import {Collection} from '@core/Collection';

export function collectionGetItemsRange(it: Collection, from: number, limit: number, filter?: (item: Collection) => boolean) {
  const total = it.childrenCount;
  const ret: Collection[] = [];

  const items = it.rawItems;
  const scope = [];
  let startIndex = 0;
  for (let current = 0, index = 0; current < total; current += items[index++].childrenCount) {
    if (current <= from) {
      startIndex = index;
    }
  }

  console.log('start Index', startIndex);

  return ret;
}
