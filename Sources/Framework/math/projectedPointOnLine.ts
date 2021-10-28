import {Vec2} from 'Framework/math/Vec2';

export function projectedPointOnLineFast(v1: Vec2, v2: Vec2, p: Vec2) {
  // get dot product of e1, e2
  const e1 = {
    x: v2.x - v1.x,
    y: v2.y - v1.y
  };
  const e2 = {
    x: p.x - v1.x,
    y: p.y - v1.y
  };
  const valDp = e1.x * e2.x + e1.y * e2.y;
  // get squared length of e1
  const len2 = e1.x * e1.x + e1.y * e1.y;
  return new Vec2(
    (v1.x + (valDp * e1.x) / len2),
    (v1.y + (valDp * e1.y) / len2)
  );
}
