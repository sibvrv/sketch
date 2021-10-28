import GLOB from '@root/types';
import {T2DEditor} from 'editor/T2DEditor';
import {DrawBackground} from 'editor/render/Background';
import {shapeRender} from '@editor/render/ShapeRender';
import {controlsRender} from '@editor/render/ControlsRender';
import {color_fill, color_stroke, line} from '@editor/render/canvas';
import {Vec2, vec2_normalize} from '@Framework/math/Vec2';
import {DrawGrid} from '@editor/render/Grid';
import {TPath} from '@editor/Shapes/TPath';

interface EditorRenderOptions {
  drawGrid: boolean;
}

export function editorRender(ctx: CanvasRenderingContext2D, editor: T2DEditor, width: number, height: number, options: EditorRenderOptions) {
  const {view, selected} = editor;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  if (GLOB.img_background) {
    DrawBackground(editor, ctx, width, height);
  }

  ctx.lineWidth = 1;

  if (options.drawGrid) {
    DrawGrid(editor, ctx, width, height);
  }

  const pos = new Vec2(0, 0);

  const scale = view.zoom;

  ctx.setTransform(
    scale, 0,
    0, scale,
    Math.round(view.position.x * scale), Math.round(view.position.y * scale)
  );

  ctx.lineWidth = scale ? 0.5 / scale : 1;

  const items = editor.layer.rawItems as TPath[];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    if (item.type === 'path') {
      shapeRender(ctx, item, pos);
    } else if (item.type === 'image') {
      shapeRender(ctx, item, pos);
    }
  }

  if (selected.sector) {
    controlsRender(ctx, selected.sector, scale);
  }

  if (selected.point) {
    const size = 7 / scale;
    const hsize = size / 2;

    color_fill(ctx, '#F00');
    ctx.beginPath();
    ctx.rect(selected.point.x - hsize, selected.point.y - hsize, size, size);
    ctx.fill();
  }

  if (selected.line) {
    color_fill(ctx, '#F00');
    color_stroke(ctx, '#F00');
    const a = selected.line.A;
    const b = selected.line.B;
    line(ctx, a.x, a.y, b.x, b.y);

    const px = (a.x + b.x) / 2;
    const py = (a.y + b.y) / 2;
    // let len = Math.sqrt(Math.sqr(a.x-b.x)+Math.sqr(a.y-b.y));

    const d = new Vec2(
      b.x - a.x,
      b.y - a.y
    );
    const len = vec2_normalize(d);
    const angle = len === 0 ? 0 : Math.atan2(d.y, d.x);

    ctx.save();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(px + d.y * 20 / scale, py - d.x * 20 / scale);

    const textAngle = Math.abs(angle) > Math.PI / 2 ? Math.PI + angle : angle;

    ctx.transform(
      1 / scale, 0,
      0, 1 / scale,
      0, 0
    );

    ctx.rotate(textAngle);
    ctx.font = '14px Arial';
    ctx.fillText(len.toFixed(2), 0, 0);
    ctx.restore();
  }
}
