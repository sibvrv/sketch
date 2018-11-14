import GLOB from '@root/types';
import {T2DEditor} from 'editor/T2DEditor';
import {DrawBackground} from 'editor/render/Background';
import {shapeRender} from '@editor/render/ShapeRender';
import {controlsRender} from '@editor/render/ControlsRender';
import {color_fill, color_stroke, disk, line} from '@editor/render/canvas';
import {Vec2, vec2_normalize} from '@core/math/Vec2';
import {DrawGrid} from '@editor/render/Grid';
import {TPath} from '@editor/TPath';

export function editorRender(ctx: CanvasRenderingContext2D, editor: T2DEditor, width: number, height: number) {
  const {view, selected} = editor;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  if (GLOB.img_background) {
    DrawBackground(editor, ctx, width, height);
  }
  if (GLOB.drawGrid) {
    DrawGrid(editor, ctx, width, height);
  }

  const dx = view.position.x;
  const dy = view.position.y;
  GLOB.canvasScale = view.zoom;

  const items = editor.layer.rawItems as TPath[];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    if (item.type === 'path') {
      shapeRender(ctx, items[i], view.position);
    }
  }

  if (selected.sector) {
    controlsRender(ctx, selected.sector, view.position);
  }

  if (selected.point) {
    color_fill(ctx, '#F00');
    disk(ctx, dx + selected.point.x, dy + selected.point.y, 4);
  }

  if (selected.line) {
    color_stroke(ctx, '#F00');
    const a = selected.line.A;
    const b = selected.line.B;
    line(ctx, dx + a.x, dy + a.y, dx + b.x, dy + b.y);

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
    ctx.translate(GLOB.canvasScale * (dx + px) + d.y * 20, GLOB.canvasScale * (dy + py) - d.x * 20);

    const textAngle = Math.abs(angle) > Math.PI / 2 ? Math.PI + angle : angle;

    ctx.rotate(textAngle);
    ctx.font = '14px Arial';
    ctx.fillText(len.toFixed(2), 0, 0);
    ctx.restore();
  }
  GLOB.canvasScale = 1;
}
