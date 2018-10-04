import {Vec2} from '@core/math/Vec2';

export function isClockwise(path: Vec2[]) { // has some errors
  let sum = 0.0;
  const len = path.length;
  for (let i = 0; i < len; i++) {
    const v1 = path[i];
    const v2 = path[(i + 1) % len];
    sum += (v2.x - v1.x) * (v2.y + v1.y);
  }
  return sum > 0.0;
}
