import {Collection} from '@core/Collection';

interface IteratorData {
  cur: number;
  from: number;
  limit: number;
  filter?: (item: Collection) => boolean;
}

function collectionGetItemsRangeSlow(it: Collection, result: Collection[], iterator: IteratorData) {
  const items = it.rawItems;
  for (let i = 0; i < items.length; i++) {
    iterator.cur++;
    if (iterator.cur >= iterator.from) {
      const count = result.push(items[i]);
      if (count >= iterator.limit) {
        return false;
      }
    }
    if (!collectionGetItemsRangeSlow(items[i], result, iterator)) {
      return false;
    }
  }
  return true;
}

export function collectionGetItemsRange(it: Collection, from: number, limit: number, filter?: (item: Collection) => boolean) {
  const result: Collection[] = [];
  const iterator: IteratorData = {cur: -1, from, limit, filter};
  collectionGetItemsRangeSlow(it, result, iterator);
  return result;
}
