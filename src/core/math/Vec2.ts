/**
 * Vec2
 */
export class Vec2 {
  x: number;
  y: number;

  /**
   * Vec2 Constructor
   */
  constructor(x: number, y: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  copy(v: Vec2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  zero() {
    this.x = 0;
    this.y = 0;
    return this;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(v: Vec2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  addf(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  sub(v: Vec2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(v: Vec2) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  divf(v: number) {
    this.x /= v;
    this.y /= v;
    return this;
  }

  mulf(v: number) {
    this.x *= v;
    this.y *= v;
    return this;
  }

  neg() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  mid(v: Vec2) {
    return new Vec2((this.x + v.x) * 0.5, (this.y + v.y) * 0.5);
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  equal(v: Vec2) {
    return this.x === v.x && this.y === v.y;
  }

  cross(v: Vec2) {
    return this.x * v.y - this.y * v.x;
  }

  perpendicular() {
    const t = this.x;
    this.x = -this.y;
    this.y = t;
    return this;
  }

  normalize() {
    let len = this.x * this.x + this.y * this.y;
    len = (len === 0) ? 1 : Math.sqrt(len);
    this.x /= len;
    this.y /= len;
    return this;
  }

  length() {
    const x = this.x;
    const y = this.y;
    return Math.sqrt(x * x + y * y);
  }

  dist(v: Vec2) {
    const x = this.x - v.x;
    const y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
  }

  squareDist(v: Vec2) {
    const x = this.x - v.x;
    const y = this.y - v.y;
    return x * x + y * y;
  }

  fromAngle(a: number) {
    this.x = Math.cos(a);
    this.y = Math.sin(a);
    return this;
  }

  toAngle() {
    let a = Math.atan2(this.y, this.x);
    if (a < 0) {
      a += Math.PI * 2;
    }
    return a;
  }

  rotate(angle: number) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const x = this.x;
    const y = this.y;
    this.x = x * c - y * s;
    this.y = x * s + y * c;
    return this;
  }
}

export function vec2_normalize(v: Vec2) {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) {
    v.x = v.y = 0;
    return len;
  }
  v.x /= len;
  v.y /= len;
  return len;
}
