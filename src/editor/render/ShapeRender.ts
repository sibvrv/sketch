import {color_fill, color_stroke, line, poly} from '@editor/render/canvas';
import {TPath} from '@editor/TPath';
import {Vec2} from '@core/math/Vec2';

export function shapeRender(ctx: CanvasRenderingContext2D, shape: TPath, v: Vec2) {
  const path = shape.convertPath(shape.path);
  const len = path.length;

  color_fill(ctx, shape.mask ? 'rgba(190,160,160,0.4)' : 'rgba(160,160,190,0.8)');
  poly(ctx, path, v);
  color_fill(ctx, '#F00');
  color_stroke(ctx, '#777');

  for (let i = 0; i < len; i++) {
    const a = path[i];
    const b = path[(i + 1) % len];

    line(ctx, v.x + a.x, v.y + a.y, v.x + b.x, v.y + b.y);
  }
}
