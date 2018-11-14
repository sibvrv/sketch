import {color_fill, color_stroke, line, poly} from '@editor/render/canvas';
import {TPath} from '@editor/TPath';
import {Vec2} from '@core/math/Vec2';
import {ImagesManager} from '@editor/ImagesManager';

export function shapeRender(ctx: CanvasRenderingContext2D, shape: TPath, v: Vec2) {
  const path = shape.convertPath(shape.path);
  const len = path.length;

  const fill = shape.mask ? 'rgba(190,160,160,0.4)' : 'rgba(160,160,190,0.8)';

  if (shape.type === 'image') {
    const url = shape.props('src') as string;
    const meta = ImagesManager.instance.getMeta(url);
    if (meta) {
      meta.pattern = meta.pattern || ctx.createPattern(meta.image, 'repeat');
    }
    ctx.fillStyle = meta.pattern || fill;

    // todo zoom, image scale, rotate
    const offset = v.clone().add(path[0]);
    ctx.translate(offset.x, offset.y);
    poly(ctx, path, path[0].clone().neg());
    ctx.translate(-offset.x, -offset.y);
  } else {
    color_fill(ctx, fill);
    poly(ctx, path, v);
  }

  color_fill(ctx, '#F00');
  color_stroke(ctx, '#777');

  for (let i = 0; i < len; i++) {
    const a = path[i];
    const b = path[(i + 1) % len];

    line(ctx, v.x + a.x, v.y + a.y, v.x + b.x, v.y + b.y);
  }
}
