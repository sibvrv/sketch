import {Vec2} from 'core/math/Vec2';

declare global {
  interface LineLineIntersectionResult {
    has: boolean;
    point: Vec2;
    onLine1: boolean;
    onLine2: boolean;
  }
}

/**
 * Test if two lines intersect
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {number} x4
 * @param {number} y4
 * @returns {LineLineIntersectionResult}
 */
export function checkLineIntersection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): LineLineIntersectionResult {
  const result: {
    has: boolean;
    point: Vec2;
    onLine1: boolean;
    onLine2: boolean;
  } = {
    has: false,
    point: null!,
    onLine1: false,
    onLine2: false
  };

  const denominator = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));

  if (denominator === 0) {
    return result;
  }
  result.has = true;

  let a = y1 - y3;
  let b = x1 - x3;
  const numerator1 = ((x4 - x3) * a) - ((y4 - y3) * b);
  const numerator2 = ((x2 - x1) * a) - ((y2 - y1) * b);
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  result.point = new Vec2(
    x1 + (a * (x2 - x1)),
    y1 + (a * (y2 - y1))
  );
  if (a > 0 && a < 1) {
    result.onLine1 = true;
  }
  if (b > 0 && b < 1) {
    result.onLine2 = true;
  }
  return result;
}
