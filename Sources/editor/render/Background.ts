import GLOB from '../../types';
import {T2DEditor} from '../T2DEditor';

/**
 * Draw Background image
 * @param editor
 * @param {number} width
 * @param {number} height
 * @param {CanvasRenderingContext2D} ctx
 */
export function DrawBackground(editor: T2DEditor, ctx: CanvasRenderingContext2D, width: number, height: number) {
  const {zoom} = editor.view;

  const x = editor.view.position.x * zoom;
  const y = editor.view.position.y * zoom;

  ctx.translate(0.5, 0.5);
  ctx.drawImage(GLOB.img_background!, x, y);
}
