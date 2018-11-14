import GLOB from '@root/types';
import {TPoint} from 'editor/TPoint';
import {Vec2} from '@core/math/Vec2';

export function disk(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath();
  ctx.arc(GLOB.canvasScale * x, GLOB.canvasScale * y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(Math.round(GLOB.canvasScale * x1), Math.round(GLOB.canvasScale * y1));
  ctx.lineTo(Math.round(GLOB.canvasScale * x2), Math.round(GLOB.canvasScale * y2));
  ctx.stroke();
}

export function color_fill(ctx: CanvasRenderingContext2D, v: string | CanvasGradient | CanvasPattern) {
  ctx.fillStyle = v;
}

export function color_stroke(ctx: CanvasRenderingContext2D, v: string | CanvasGradient | CanvasPattern) {
  ctx.strokeStyle = v;
}

export function poly(ctx: CanvasRenderingContext2D, pts: TPoint[], v: Vec2) {
  const l = pts.length;
  if (l < 2) {
    return;
  }

  ctx.beginPath();

  const dx = v.x || 0;
  const dy = v.y || 0;

  ctx.moveTo(Math.round(GLOB.canvasScale * (dx + pts[0].x)), Math.round(GLOB.canvasScale * (dy + pts[0].y)));
  for (let i = 1; i < l; i++) {
    ctx.lineTo(Math.round(GLOB.canvasScale * (dx + pts[i].x)), Math.round(GLOB.canvasScale * (dy + pts[i].y)));
  }
  // ctx.quadraticCurveTo(20,100,200,20);
  ctx.closePath();
}
