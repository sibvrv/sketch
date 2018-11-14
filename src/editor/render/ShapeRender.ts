import {color_fill, color_stroke, poly} from '@editor/render/canvas';
import {TPath} from '@editor/TPath';
import {Vec2} from '@core/math/Vec2';
import {ImagesManager} from '@editor/ImagesManager';

export function shapeRender(ctx: CanvasRenderingContext2D, shape: TPath, v: Vec2) {
  const path = shape.convertPath(shape.path);

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
    ctx.fill('evenodd');

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  } else {
    color_fill(ctx, fill);

    poly(ctx, path, v);

    ctx.fill('evenodd');
  }

  color_fill(ctx, '#F00');
  color_stroke(ctx, '#777');

  poly(ctx, path, v);
  ctx.stroke();
}
