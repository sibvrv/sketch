import {Vec2} from 'core/math/Vec2';
import {angleDistanceDeg} from 'core/math/angleDistanceDeg';

/**
 * Find the angle between two points
 * @param {Vec2} a
 * @param {Vec2} b
 * @returns {number}
 */
export function angleBetweenVectors(a: Vec2, b: Vec2) {
  const alpha = Math.atan2(a.y, a.x) * 180 / Math.PI;
  const beta = Math.atan2(b.y, b.x) * 180 / Math.PI;
  return angleDistanceDeg(alpha, beta);
}
