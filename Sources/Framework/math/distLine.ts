import {Vec2} from 'Framework/math/Vec2';

/**
 * Squared distance between a point and a line segment
 * @param {Vec2} point
 * @param {Vec2} v
 * @param {Vec2} w
 * @returns {number}
 */
function distToSegmentSquared(point: Vec2, v: Vec2, w: Vec2) {
  const l2 = v.squareDist(w);

  if (l2 === 0) {
    return point.squareDist(v);
  }

  const t = ((point.x - v.x) * (w.x - v.x) + (point.y - v.y) * (w.y - v.y)) / l2;

  if (t < 0) {
    return point.squareDist(v);
  }

  if (t > 1) {
    return point.squareDist(w);
  }

  return point.squareDist(new Vec2(
    v.x + t * (w.x - v.x),
    v.y + t * (w.y - v.y)
  ));
}

/**
 * Shortest distance between a point and a line segment
 * @param {Vec2} point
 * @param {Vec2} a
 * @param {Vec2} b
 * @returns {number}
 */
export function distToLineSegment(point: Vec2, a: Vec2, b: Vec2) {
  return Math.sqrt(distToSegmentSquared(point, a, b));
}
