import {T2DEditor} from '@editor/T2DEditor';
import {color_stroke, line} from '@editor/render/canvas';

/**
 * Draw Grid
 * @param editor
 * @param {number} width
 * @param {number} height
 * @param {CanvasRenderingContext2D} ctx
 */
export function DrawGrid(editor: T2DEditor, ctx: CanvasRenderingContext2D, width: number, height: number) {
  const {zoom, zoomInt} = editor.view;

  let x = editor.view.position.x * zoom;
  let y = editor.view.position.y * zoom;

  ctx.translate(0.5, 0.5);

  let gzoom = 1 + Math.abs(zoomInt);

  const gridScale = editor.view.zoomFactorPow2;

  color_stroke(ctx, '#eef');
  const g = gzoom;

  if (g >= 4) {
    const step = gzoom - gridScale;
    gzoom = 2 + step * 2 / gridScale;
  }

  if (zoomInt < 0 && g >= 2) {
    gzoom = 4 / gzoom;
  }

  let div = 10 * gzoom;

  for (let i = Math.round(width / div); --i >= 0;) {
    const d = Math.round(x % div + i * div);
    line(ctx, d, 0, d, height);
  }

  for (let i = Math.round(height / div); --i >= 0;) {
    const d = Math.round(y % div + i * div);
    line(ctx, 0, d, width, d);
  }

  div *= 5;

  color_stroke(ctx, '#dde');

  for (let i = Math.round(width / div); --i >= 0;) {
    const dx = Math.round(x % div + i * div);
    line(ctx, dx, 0, dx, height);
  }

  for (let i = Math.round(height / div); --i >= 0;) {
    const d = Math.round(y % div + i * div);
    line(ctx, 0, d, width, d);
  }

  div *= 2;
  color_stroke(ctx, '#bbc');

  for (let i = Math.round(width / div); --i >= 0;) {
    const dx = Math.round(x % div + i * div);
    line(ctx, dx, 0, dx, height);
  }

  for (let i = Math.round(height / div); --i >= 0;) {
    const d = Math.round(y % div + i * div);
    line(ctx, 0, d, width, d);
  }

  x = Math.round(x);
  y = Math.round(y);

  color_stroke(ctx, '#888');
  line(ctx, 0, y, width, y);
  line(ctx, x, 0, x, height);
}
