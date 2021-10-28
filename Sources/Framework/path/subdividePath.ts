import {Vec2} from '@Framework/math/Vec2';

export function subdividePath(points: Vec2[], maxdist: number) {
  const len = points.length;

  const rpoints = [];
  for (let i = 0; i < len; i++) {
    const p = points[i];
    const p1 = points[(i + 1) % len];
    let cnt = Math.floor(p.dist(p1) / maxdist);

    rpoints.push(p);

    if (cnt === 0) {
      continue;
    }
    cnt += 1;

    const v = (p1.clone().sub(p)).mulf(1 / cnt);
    for (let k = 1; k < cnt; k++) {
      const np = p.clone().add(v.clone().mulf(k));
      rpoints.push(np);
    }
  }
  return rpoints;
}
