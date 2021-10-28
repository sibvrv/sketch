import {Vec2} from '@core/math/Vec2';

export class TPoint extends Vec2 {
  r = 0;
  steps = 0;

  /**
   * TPoint Constructor
   */
  constructor(x?: number, y?: number) {
    super(x, y);

    this.r = 0;
    this.steps = 0;
  }

  translate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  clone() {
    const point = new TPoint(this.x, this.y);
    point.r = this.r;
    point.steps = this.steps;
    return point;
  }
}
