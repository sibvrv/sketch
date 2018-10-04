import GLOB from '../../types';
import {T2DEditor} from '../T2DEditor';
import {color_stroke, line} from '@editor/render/canvas';

/**
 * Draw Background with grid or image
 * @param editor
 * @param {number} width
 * @param {number} height
 * @param {CanvasRenderingContext2D} ctx
 */
export function DrawBackground(editor: T2DEditor, ctx: CanvasRenderingContext2D, width: number, height: number) {
  const {zoom, zoomInt} = editor.view;

  const x = editor.view.position.x * zoom;
  const y = editor.view.position.y * zoom;
  ctx.translate(0.5, 0.5);

  if (GLOB.img_background) {
    ctx.drawImage(GLOB.img_background, x, y);
  }

  if (!GLOB.drawGrid) {
    return;
  }

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
    const d = x % div + i * div;
    line(ctx, d, 0, d, height);
  }

  for (let i = Math.round(height / div); --i >= 0;) {
    const d = y % div + i * div;
    line(ctx, 0, d, width, d);
  }

  div *= 5;

  color_stroke(ctx, '#dde');

  for (let i = Math.round(width / div); --i >= 0;) {
    const dx = x % div + i * div;
    line(ctx, dx, 0, dx, height);
  }

  for (let i = Math.round(height / div); --i >= 0;) {
    const d = y % div + i * div;
    line(ctx, 0, d, width, d);
  }

  div *= 2;
  color_stroke(ctx, '#bbc');

  for (let i = Math.round(width / div); --i >= 0;) {
    const dx = x % div + i * div;
    line(ctx, dx, 0, dx, height);
  }

  for (let i = Math.round(height / div); --i >= 0;) {
    const d = y % div + i * div;
    line(ctx, 0, d, width, d);
  }

  color_stroke(ctx, '#888');
  line(ctx, 0, y, width, y);
  line(ctx, x, 0, x, height);
}
