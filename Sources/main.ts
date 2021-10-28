import GLOB from './types';
import {T2DEditor} from '@editor/T2DEditor';
import {Plugins} from '@plugins/Plugins';
import {editorRender} from '@editor/render/EditorRender';
import {selected_info} from '@ui/actions/actionsSelect';
import defaultStorage from '@store/defaultStorage';

declare global {
  interface MouseEvent {
    wheelDelta: number; // WebKit / Opera / Explorer 9
  }
}

let render_canvas: HTMLCanvasElement;
let render_ctx: CanvasRenderingContext2D = null!;

export function redraw() {
  const states = defaultStorage.getState();
  render_canvas.width = render_canvas.offsetWidth;
  render_canvas.height = render_canvas.offsetHeight;

  editorRender(render_ctx, GLOB.editor, render_canvas.width, render_canvas.height, {
    drawGrid: states.drawGrid
  });
}

function setBackground(url: string) {
  const image = new Image();
  image.onload = function () {
    GLOB.img_background = image;
    redraw();
  };
  image.src = url;
}

GLOB.editor = new T2DEditor(); // todo

export function initEditorApplication(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  render_canvas = canvas;
  render_ctx = ctx;

  // setBackground("png/geomorph-2-a.png");

  /* Load */
  GLOB.editor.doLoad(JSON.parse(localStorage.editor2d || '{}'));

  redraw();
  selected_info();

  /* Plugins */
  Plugins.instance.init();
}
