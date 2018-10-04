import {TViewPort} from '@editor/TViewPort';
import {expect} from 'chai';
import {Vec2} from '@core/math/Vec2';

describe('TViewPort', function () {

  let view: TViewPort;

  beforeEach(function () {
    console.log('before every test in every file');
    view = new TViewPort();
  });

  describe('Zoom', function () {
    it('position = 0, 0', function () {
      view.deltaZoom(2, 0, 0);
      const result = view.position;
      expect(result).to.deep.equal(new Vec2(0, 0));
    });

  });

  describe('getZoom', function () {
    it('should ', function () {

    });
  });

  describe('snapToGrid', function () {
    it('should ', function () {

    });
  });

});
