import {TPoint} from './TPoint';
import {Vec2} from '@core/math/Vec2';
import {distToLineSegment} from '@core/math/distLine';
import {isClockwise} from '@core/path/isClockwise';
import {getArea} from '@core/path/getArea';
import {Collection} from '@core/Collection';

declare global {
  interface TLine {
    A: TPoint;
    B: TPoint;
  }
}

function asVec(p: TPoint, pp: TPoint, v: any) {
  v.x = pp.x - p.x;
  v.y = pp.y - p.y;
  v.len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (v.len) {
    v.nx = v.x / v.len;
    v.ny = v.y / v.len;
    v.ang = Math.atan2(v.ny, v.nx);
  } else {
    v.nx = 0;
    v.ny = 0;
    v.ang = 0;
  }
}

const EPSILON = 0.00001;

function EllipseCurve(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, t: number) {

  const twoPi = Math.PI * 2;
  let deltaAngle = aEndAngle - aStartAngle;
  const samePoints = Math.abs(deltaAngle) < EPSILON;

  // ensures that deltaAngle is 0 .. 2 PI
  while (deltaAngle < 0) {
    deltaAngle += twoPi;
  }
  while (deltaAngle > twoPi) {
    deltaAngle -= twoPi;
  }

  if (deltaAngle < EPSILON) {
    deltaAngle = samePoints ? 0 : twoPi;
  }

  if (aClockwise && !samePoints) {
    deltaAngle = deltaAngle === twoPi ? -twoPi : deltaAngle - twoPi;
  }

  const angle = aStartAngle + t * deltaAngle;
  const x = aX + xRadius * Math.cos(angle);
  const y = aY + yRadius * Math.sin(angle);

  return new TPoint(x, y);
}

export class TPath extends Collection {
  path: TPoint[] = [];
  mask: boolean;

  /**
   * TPath Constructor
   */
  constructor(parent?: Collection, name?: string) {
    super('path', parent);
    this.props({
      name: name || '',
      class: '',
      tags: '',
      mask: false
    });
    this.define<boolean>('mask');
  }

  /**
   * Clone Path
   * @returns {TPath}
   */
  clone() {
    const ret = new TPath();
    ret.props(this.rawProps);
    ret.path = new Array(this.path.length);
    for (let i = this.path.length; --i >= 0;) {
      ret.path[i] = this.path[i].clone();
    }
    return ret;
  }

  /**
   * Get Area
   * @returns {number}
   */
  getArea() {
    return getArea(this.path);
  }

  /**
   * Add Point
   * @param {number} x
   * @param {number} y
   * @returns {this}
   * @constructor
   */
  Point(x: number, y: number) {
    const p = new TPoint(x, y);
    this.path.push(p);
    return this;
  }

  /**
   * Make Rect
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @constructor
   */
  Rect(x: number, y: number, w: number, h: number) {
    this.Point(x, y).Point(x + w, y).Point(x + w, y + h).Point(x, y + h);
  }

  /**
   * Get Point At
   * @param {number} x
   * @param {number} y
   * @param {number} tr
   * @returns {any}
   */
  getPointAt(x: number, y: number, tr: number) {
    const pt = this.path;
    for (let i = pt.length; --i >= 0;) {
      const p = pt[i];
      if (Math.abs(p.x - x) <= tr && Math.abs(p.y - y) <= tr) {
        return p;
      }
    }
    return null;
  }

  /**
   * Get Line At
   * @param {number} x
   * @param {number} y
   * @param {number} tr
   * @returns {TLine}
   */
  getLineAt(x: number, y: number, tr: number): TLine {
    const path = this.path;
    const len = path.length;

    let dist = tr * 2 + 10;
    let pointid = -1;
    const pt = new Vec2(x, y);

    for (let i = 0; i < len; i++) {
      const a = path[i];
      const b = path[(i + 1) % len];
      const d = distToLineSegment(pt, a, b);
      if (d > tr) {
        continue;
      }

      if (d < dist) {
        dist = d;
        pointid = i;
      }
    }
    if (pointid < 0) {
      return null!;
    }

    return {
      A: path[pointid],
      B: path[(pointid + 1) % len]
    };
  }

  /**
   * Delete Point
   * @param {TPoint} pt
   */
  deletePoint(pt: TPoint) {
    const p = this.path;
    const index = p.indexOf(pt);
    if (index >= 0) {
      p.splice(index, 1);
    }
  }

  /**
   * Split At
   * @param {number} x
   * @param {number} y
   * @param {number} tr
   * @returns {any}
   */
  splitAt(x: number, y: number, tr: number) {
    const path = this.path;
    const len = path.length;

    let dist = tr * 2 + 10;
    let pointid = -1;
    const pt = new Vec2(x, y);

    for (let i = 0; i < len; i++) {
      const a = path[i];
      const b = path[(i + 1) % len];
      const d = distToLineSegment(pt, a, b);
      if (d > tr) {
        continue;
      }

      if (d < dist) {
        dist = d;
        pointid = i;
      }
    }
    if (pointid < 0) {
      return null;
    }

    const np = path[pointid].clone();
    np.x = x;
    np.y = y;

    path.splice(pointid + 1, 0, np);

    return np;
  }

  /**
   * Translate
   * @param {number} x
   * @param {number} y
   */
  translate(x: number, y: number) {
    const path = this.path;
    for (let i = path.length; --i >= 0;) {
      const p = path[i];
      p.x += x;
      p.y += y;
    }
  }

  /**
   * Is Clockwise
   * @returns {boolean}
   */
  isClockwise() {
    return isClockwise(this.path);
  }

  /**
   * Fix Winding
   */
  fixWinding() {
    if (this.isClockwise()) {
      this.path.reverse();
    }
  }

  getPoint(p0: TPoint, p1: TPoint, p2: TPoint, t: number) {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return new TPoint(x, y);
  }

  /*
    roundIsosceles(p1: TPoint, p2: TPoint, p3: TPoint, t: number) {
    let mt = 1-t,
    c1x = (mt*p1.x + t*p2.x),
    c1y = (mt*p1.y + t*p2.y),

    c2x = (mt*p3.x + t*p2.x),
    c2y = (mt*p3.y + t*p2.y);
    return new float[]{ c1x, c1y, c2x, c2y };
  }
  */

  convertPath(in_path = this.path) {
    const path: TPoint[] = [];

    const v1: any = {};
    const v2: any = {};
    let cRadius = 0;

    for (let pt = 0, len = in_path.length; pt < len; pt++) {
      const point = in_path[pt];
      if (point.r) {
        const prev = in_path[(len + pt - 1) % len];
        const next = in_path[(pt + 1) % len];

        const steps = Math.max(1, point.steps || 1);

        const radius = point.r;

        const p0 = prev;
        const p1 = point;
        const p2 = next;

        asVec(p1, p0, v1);
        asVec(p1, p2, v2);

        if (v1.nx + v2.nx === 0 && v1.ny + v2.ny === 0) {
          path.push(point);
          continue;
        }

        const sinA = v1.nx * v2.ny - v1.ny * v2.nx;
        const sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;

        let angle = Math.asin(sinA);

        let radDirection = 1;
        let drawDirection = false;
        if (sinA90 < 0) {
          if (angle < 0) {
            angle = Math.PI + angle;
          } else {
            angle = Math.PI - angle;
            radDirection = -1;
            drawDirection = true;
          }
        } else {
          if (angle > 0) {
            radDirection = -1;
            drawDirection = true;
          }
        }

        const halfAngle = angle / 2;
        let lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
        if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
          lenOut = Math.min(v1.len / 2, v2.len / 2);
          cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
        } else {
          cRadius = radius;
        }
        let x = p1.x + v2.nx * lenOut;
        let y = p1.y + v2.ny * lenOut;
        x += -v2.ny * cRadius * radDirection;
        y += v2.nx * cRadius * radDirection;

        for (let i = 0; i <= steps; i++) {
          // todo optimize it
          const cp = EllipseCurve(
            x, y,
            cRadius, cRadius,
            v1.ang + Math.PI / 2 * radDirection,
            v2.ang - Math.PI / 2 * radDirection,
            drawDirection,
            i / steps
          );
          path.push(cp);
        }

      } else {
        path.push(point);
      }
    }
    return path;
  }
}
