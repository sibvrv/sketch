declare global {
  interface Math {
    log2: (v: number) => number;
    sign: (v: number) => number;
    sqr: (v: number) => number;
  }
}

Math.log2 = Math.log2 || function (v: number) {
  return Math.log(v) * Math.LOG2E;
};

Math.sign = Math.sign || function (x) {
  x = +x;
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};

export function sqr(v: number) {
  return v * v;
}

Math.sqr = Math.sqr || sqr;
