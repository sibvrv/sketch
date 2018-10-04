import {Vec2} from 'core/math/Vec2';

function dist2(v: Vec2, w: Vec2) {
  return Math.sqr(v.x - w.x) + Math.sqr(v.y - w.y);
}

function distToSegmentSquared(point: Vec2, v: Vec2, w: Vec2) {
  const l2 = dist2(v, w);

  if (l2 === 0) {
    return dist2(point, v);
  }

  const t = ((point.x - v.x) * (w.x - v.x) + (point.y - v.y) * (w.y - v.y)) / l2;

  if (t < 0) {
    return dist2(point, v);
  }

  if (t > 1) {
    return dist2(point, w);
  }

  return dist2(point, new Vec2(
    v.x + t * (w.x - v.x),
    v.y + t * (w.y - v.y)
  ));
}

function distToSegment(point: Vec2, v: Vec2, w: Vec2) {
  return Math.sqrt(distToSegmentSquared(point, v, w));
}

export function distLine(a: Vec2, b: Vec2, point: Vec2) {
  return distToSegment(point, a, b);
}
