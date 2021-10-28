import {Vec2} from '@Framework/math/Vec2';

/**
 * Calculating Polygon Area
 * @param {Vec2[]} path
 * @returns {number}
 */
export function getArea(path: Vec2[]) {
  let sum = 0.0;
  const len = path.length;
  for (let i = 0; i < len; i++) {
    const v1 = path[i];
    const v2 = path[(i + 1) % len];
    sum += v1.x * v2.y - v1.y * v2.x;
  }
  return Math.abs(sum) / 2;
}
