import {TPoint} from '@editor/Shapes/TPoint';

const EPSILON = 0.00001;

export const EllipseCurve = (aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, t: number) => {

  const twoPi = Math.PI * 2;
  let deltaAngle = aEndAngle - aStartAngle;
  const samePoints = Math.abs(deltaAngle) < EPSILON;

  // ensures that deltaAngle is 0 .. 2 PI
  while (deltaAngle < 0) {
    deltaAngle += twoPi;
  }
  while (deltaAngle > twoPi) {
    deltaAngle -= twoPi;
  }

  if (deltaAngle < EPSILON) {
    deltaAngle = samePoints ? 0 : twoPi;
  }

  if (aClockwise && !samePoints) {
    deltaAngle = deltaAngle === twoPi ? -twoPi : deltaAngle - twoPi;
  }

  const angle = aStartAngle + t * deltaAngle;
  const x = aX + xRadius * Math.cos(angle);
  const y = aY + yRadius * Math.sin(angle);

  return new TPoint(x, y);
}
