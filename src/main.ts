import GLOB from './types';
import {T2DEditor} from '@editor/T2DEditor';
import {Plugins} from '@plugins/Plugins';
import defaultStorage from '@store/defaultStorage';
import {editorRender} from '@editor/render/EditorRender';
import {Vec2} from '@core/math/Vec2';

declare global {
  interface MouseEvent {
    wheelDelta: number; // WebKit / Opera / Explorer 9
  }
}

let render_canvas: HTMLCanvasElement;
let render_ctx: CanvasRenderingContext2D = null!;
let editor: T2DEditor;
let lastDownTarget: HTMLElement = null!;

export function redraw() {
  render_canvas.width = render_canvas.offsetWidth;
  render_canvas.height = render_canvas.offsetHeight;

  editorRender(render_ctx, editor, render_canvas.width, render_canvas.height);
}

const drag = {
  position: new Vec2(0, 0),
  position_offset: new Vec2(0, 0),
  position_prev: new Vec2(0, 0),

  active: false,
  point: null,
  sector: null,
  hits: null! as Selected,
  screen: {
    active: false,
    x: 0,
    y: 0
  }
};

function getMouse(event: MouseEvent) {
  const rect = render_canvas.getBoundingClientRect();
  return (new Vec2(event.clientX - rect.left, event.clientY - rect.top)).round();
}

function doMouseDown(event: MouseEvent) {
  lastDownTarget = event.target as HTMLElement;

  event.preventDefault();
  event.stopPropagation();

  const mouse = getMouse(event);

  switch (event.button) {
    case 0:
      drag.position = mouse.clone();
      drag.position_offset.zero();
      drag.position_prev.zero();

      if (event.ctrlKey) {
        const {zoom} = editor.view;

        const sec = editor.selected.sector = editor.selected.sector || editor.graphics.Path2D();
        const p = new Vec2(
          -editor.view.position.x + mouse.x / zoom,
          -editor.view.position.y + mouse.y / zoom
        );
        editor.view.snapToGrid(p);
        sec.Point(p.x, p.y);

        redraw();
        return;
      }

      editor.select(mouse.x, mouse.y);

      const hit = drag.hits = editor.selected;
      drag.active = Boolean(hit.point || hit.line || hit.sector);

      selected_info();

      redraw();
      break;
    case 1:

      break;
    case 2:
      drag.screen.active = true;
      drag.screen.x = mouse.x;
      drag.screen.y = mouse.y;
      break;
  }

}

function doMouseMove(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  const mouse = getMouse(event);

  if (drag.screen.active) {
    editor.view.translate(mouse.x - drag.screen.x, mouse.y - drag.screen.y);

    drag.screen.x = mouse.x;
    drag.screen.y = mouse.y;

    redraw();
  }

  if (!drag.active) {
    return;
  }

  const {zoom} = editor.view;

  const p = mouse.clone();
  let pos = p.clone().sub(drag.position).divf(zoom);
  drag.position = p;

  pos = drag.position_offset.add(pos).clone();
  editor.view.snapToGrid(pos);

  const {x, y} = drag.position_prev.neg().add(pos);
  drag.position_prev = pos;

  const h = drag.hits;

  if (h.point) {
    h.point.translate(x, y);

  } else if (h.line) {
    h.line.A.translate(x, y);
    h.line.B.translate(x, y);
  } else if (h.sector) {
    h.sector.translate(x, y);
  }

  if (h.sector) {
    h.sector.fixWinding();
  }

  redraw();
}

function doMouseUp(event: MouseEvent) {
  if (lastDownTarget !== render_canvas) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  switch (event.button) {
    case 0:
      drag.active = false;

      drag.point = null;
      drag.sector = null;
      break;
    case 2:
      drag.screen.active = false;
      break;
  }
}

function doMouseWheel(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  const mouse = getMouse(event);

  let delta = 0;
  if (event.wheelDelta !== undefined) {
    // WebKit / Opera / Explorer 9
    delta = event.wheelDelta;
  } else if (event.detail !== undefined) {
    // Firefox
    delta = -event.detail;
  }

  const {view} = editor;
  delta = Math.sign(delta);

  view.deltaZoom(delta, mouse.x, mouse.y);

  defaultStorage.setState({
    zoom: view.getZoom()
  });

  redraw();
}

function selected_info() {
  const status: string[] = [];

  const {selected} = editor;
  const visible = Boolean(selected.sector || selected.point || selected.line);

  if (selected.sector) {
    status.push(`Area: ${selected.sector.getArea().toFixed(2)}`);
    status.push(`Vertex: ${selected.sector.path.length}`);
  } else {
    status.push(`Items: ${editor.graphics.items.length}`);
  }

  defaultStorage.setState({
    status: status.join(' '),
    selectedChange: Math.random(),
    shapeOptionsVisible: visible
  });
}

function onContextmenu(event: Event) {
  event.preventDefault();
  event.stopPropagation();
}

function onDoubleClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  const mouse = getMouse(event);

  let p: any;
  if (p = editor.splitAt(mouse.x, mouse.y)) {
    editor.view.snapToGrid(p);
    redraw();
  }
}

function setBackground(url: string) {
  const image = new Image();
  image.onload = function () {
    GLOB.img_background = image;
    redraw();
  };
  image.src = url;
}

editor = GLOB.editor = new T2DEditor(); // todo

export function initEditorApplication(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  render_canvas = canvas;
  render_ctx = ctx;

  // setBackground("png/geomorph-2-a.png");

  document.addEventListener('mouseup', doMouseUp, false);
  document.addEventListener('contextmenu', onContextmenu, false);

  render_canvas.addEventListener('dblclick', onDoubleClick, false);
  render_canvas.addEventListener('mousedown', doMouseDown, false);
  render_canvas.addEventListener('mousemove', doMouseMove, false);
  render_canvas.addEventListener('mousewheel', doMouseWheel, false);

  document.addEventListener('mousedown', function (event) {
    lastDownTarget = event.target as HTMLElement;
  }, false);

  document.addEventListener('keyup', function (event) {

  }, false);
  document.addEventListener('keydown', function (event) {

    switch (event.keyCode) {
      case 46:
        if (lastDownTarget === render_canvas) {
          editor.delete_selected();
          redraw();
          selected_info();
        }
        break;
    }

  }, false);
  window.addEventListener('handleResize', redraw, false);

  /* Load */
  editor.doLoad(JSON.parse(localStorage.editor2d || '{}'));

  redraw();
  selected_info();

  /* Plugins */
  Plugins.instance.init();
}
