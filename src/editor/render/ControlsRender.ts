import {color_fill, color_stroke, disk, line} from '@editor/render/canvas';
import {TPath} from '@editor/TPath';
import {Vec2} from '@core/math/Vec2';

export function controlsRender(ctx: CanvasRenderingContext2D, shape: TPath, v: Vec2) {
  const path = shape.path;
  const len = path.length;

  color_stroke(ctx, '#00F');

  for (let i = 0; i < len; i++) {
    const a = path[i];
    const b = path[(i + 1) % len];

    line(ctx, v.x + a.x, v.y + a.y, v.x + b.x, v.y + b.y);
  }

  color_fill(ctx, '#369');
  for (let i = 0; i < len; i++) {
    const p = path[i];
    disk(ctx, v.x + p.x, v.y + p.y, 4);
  }
}
