import {collectionGetItemsRange} from '@core/CollectionUtils';
import {Collection} from '@core/Collection';

function pad(text: string, size: number) {
  let s = '';
  for (let i = size; --i >= 0;) {
    s += ' ';
  }
  return s + text;
}

let _index = 0;

function helperItemsGen(parent: Collection, count: number, depth?: number) {
  for (let i = 0; i < count; i++) {
    const item = new Collection(`item_${depth}_${i}_${_index++}`, parent);
    if (depth) {
      helperItemsGen(item, 10, depth - 1);
    }
    parent.push(item);
  }
}

function dump(it: Collection, step?: number) {
  step = step || 0;
  console.log(pad(it.type, step), it.childrenCount);
  const items = it.rawItems;
  step += 2;
  for (let i = 0; i < items.length; i++) {
    dump(items[i], step);
  }
}

describe('Collection Utils', function () {
  it('Range Check', function () {

    const doc = new Collection('document');
    helperItemsGen(doc, 15, 3);

    dump(doc);

    const items = collectionGetItemsRange(doc, 15562, 15581);

  });
});
