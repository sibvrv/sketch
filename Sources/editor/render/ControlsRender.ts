import {color_fill, color_stroke, line} from '@editor/render/canvas';
import {TPath} from '@editor/Shapes/TPath';

export function controlsRender(ctx: CanvasRenderingContext2D, shape: TPath, scale: number) {
  const path = shape.path;
  const len = path.length;

  color_stroke(ctx, '#00F');

  for (let i = 0; i < len; i++) {
    const a = path[i];
    const b = path[(i + 1) % len];

    line(ctx, a.x, a.y, b.x, b.y);
  }

  color_fill(ctx, '#FFF');
  color_stroke(ctx, '#00F');

  const size = 7 / scale;
  const hsize = size / 2;

  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const p = path[i];
    ctx.rect(p.x - hsize, p.y - hsize, size, size);
  }
  ctx.fill();
  ctx.stroke();
}
