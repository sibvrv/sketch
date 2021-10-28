import {Vec2} from '@Framework/math/Vec2';

/**
 * Move Towards Length
 * @param {Vec2} movingPoint
 * @param {Vec2} targetPoint
 * @param {number} amount
 * @returns {{x: number; y: number}}
 */
export function moveTowardsLength(movingPoint: Vec2, targetPoint: Vec2, amount: number) {
  const width = (targetPoint.x - movingPoint.x);
  const height = (targetPoint.y - movingPoint.y);

  const distance = Math.sqrt(width * width + height * height);

  return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance));
}

/**
 * Move Towards Fractional
 * @param {Vec2} movingPoint
 * @param {Vec2} targetPoint
 * @param {number} fraction
 * @returns {{x: number; y: number}}
 */
export function moveTowardsFractional(movingPoint: Vec2, targetPoint: Vec2, fraction: number) {
  return {
    x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
    y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction
  };
}
