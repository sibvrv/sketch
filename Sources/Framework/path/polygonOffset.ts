import {Vec2} from '@Framework/math/Vec2';
import {isClockwise} from '@Framework/path/isClockwise';
import {checkLineIntersection} from '@Framework/math/checkLineIntersection';

export function polygonOffset(points: Vec2[], dist: number) {
  if (isClockwise(points)) {
    points.reverse();
  }

  const normals = [];
  const len = points.length;
  for (let i = len; --i >= 0;) {
    const p = points[i];
    const p1 = points[(i + 1) % len];

    normals[i] = p1.clone().sub(p).perpendicular().normalize().mulf(dist);
  }

  const ret = [];
  for (let i = len; --i >= 0;) {
    const p = points[i];
    const p_next = points[(i + 1) % len];

    const n_prev = normals[(len + i - 1) % len];
    const n_cur = normals[i];
    const n = n_prev.clone().add(n_cur).normalize();

    const c = checkLineIntersection(
      p.x - n.x,
      p.y - n.y,

      p.x + n.x,
      p.y + n.y,

      p.x + n_cur.x,
      p.y + n_cur.y,

      p_next.x + n_cur.x,
      p_next.y + n_cur.y
    );

    ret[i] = c.has ? c.point : p.clone().add(n_cur);
  }
  return ret;
}
