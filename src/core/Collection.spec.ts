import {Collection} from './Collection';
import {expect} from 'chai';

describe('Collection', function () {

  it('test push, length = 3', function () {
    const collection = new Collection('layer');
    collection.push(
      new Collection('shape'),
      new Collection('shape'),
      new Collection('shape')
    );

    const result = collection.length;
    expect(result).to.equal(3);
  });

  it('test push/pop, length = 5', function () {
    const collection = new Collection('layer');
    collection.push(
      new Collection('shape'),
      new Collection('shape'),
      new Collection('shape')
    );
    collection.pop();
    collection.push(
      new Collection('shape'),
      new Collection('shape'),
      new Collection('shape')
    );
    collection.pop();

    const result = collection.length;
    expect(result).to.equal(4);
  });

  it('sub items', function () {
    const collectionA = new Collection('graphics');
    const collectionB = new Collection('graphics', collectionA);
    collectionB.push(
      new Collection('shape'),
      new Collection('shape'),
      new Collection('shape')
    );

    const collection = new Collection('layer', collectionB);
    collection.push(
      new Collection('shape'),
      new Collection('shape'),
      new Collection('shape')
    );
    collection.pop();

    expect(collectionA.childrenCount).to.equal(5);
    expect(collectionA.length).to.equal(0);

    expect(collectionB.length).to.equal(3);
    expect(collectionB.childrenCount).to.equal(5);

    expect(collection.length).to.equal(2);
    expect(collection.childrenCount).to.equal(2);
  });

});
