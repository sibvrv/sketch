export function angleDistanceDeg(alpha: number, beta: number) {
  const phi = Math.abs(beta - alpha) % 360;
  return phi > 180 ? 360 - phi : phi;
}
