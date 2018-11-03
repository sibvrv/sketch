import {Component, h} from 'preact';
import defaultStorage from '@store/defaultStorage';
import {redraw} from '@root/main';
import {Vec2} from '@core/math/Vec2';
import GLOB from '@root/types';
import {selected_info} from '@ui/actions/actionsSelect';

/**
 * EditorCanvas Props Interface
 */
interface EditorCanvasProps {
}

/**
 * EditorCanvas State Interface
 */
interface EditorCanvasState {
  ready: boolean;
}

let lastDownTarget: HTMLElement = null!;
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

/**
 * EditorCanvas
 * @class EditorCanvas
 * @extends Component
 */
export default class EditorCanvas extends Component<EditorCanvasProps, EditorCanvasState> {
  /**
   * Default Props for EditorCanvas Component
   */
  static defaultProps: EditorCanvasProps = {};

  /**
   * EditorCanvas Component Constructor
   * @param {EditorCanvasProps} props
   */
  constructor(props: EditorCanvasProps) {
    super(props);
    this.state = {
      ready: false
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const canvas = this.base as HTMLCanvasElement;
    canvas.focus();

    let ctx: CanvasRenderingContext2D = null!;
    try {
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    } catch (e) {
      defaultStorage.setState({
        error: `Sorry, your browser doesn't support the canvas element.`
      });
      return;
    }

    document.addEventListener('mousedown', function (event) {
      lastDownTarget = event.target as HTMLElement;
    }, false);
    document.addEventListener('mouseup', this.handleMouseUp, false);

    window.addEventListener('resize', redraw, false);

    this.context.editor.onCanvasReady(canvas, ctx);
    this.setState({
      ready: true
    });
  }

  /**
   * EditorCanvas : KeyPress Handler
   */
  handleKeyPress = (event: KeyboardEvent) => {
    const {editor} = GLOB;

    switch (event.keyCode) {
      case 46:
        editor.delete_selected();
        redraw();
        selected_info();
        break;
    }
  };

  getMouse(event: MouseEvent) {
    const canvas = this.base as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    return (new Vec2(event.clientX - rect.left, event.clientY - rect.top)).round();
  }

  /**
   * EditorCanvas : MouseDown Handler
   */
  handleMouseDown = (event: MouseEvent) => {
    const {editor} = GLOB;
    lastDownTarget = event.target as HTMLElement;

    const mouse = this.getMouse(event);

    switch (event.button) {
      case 0:
        drag.position = mouse.clone();
        drag.position_offset.zero();
        drag.position_prev.zero();

        if (event.ctrlKey) {
          const {zoom} = editor.view;

          const sec = editor.selected.sector = editor.selected.sector || editor.layer.Path2D();
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
  };

  /**
   * EditorCanvas : MouseMove Handler
   */
  handleMouseMove = (event: MouseEvent) => {
    const {editor} = GLOB;
    event.preventDefault();
    event.stopPropagation();

    const mouse = this.getMouse(event);

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

    const hits = drag.hits;

    if (hits.point) {
      hits.point.translate(x, y);

    } else if (hits.line) {
      hits.line.A.translate(x, y);
      hits.line.B.translate(x, y);
    } else if (hits.sector) {
      hits.sector.translate(x, y);
    }

    if (hits.sector) {
      hits.sector.fixWinding();
    }

    redraw();
  };

  /**
   * EditorCanvas : MouseUp Handler
   */
  handleMouseUp = (event: MouseEvent) => {
    const canvas = this.base as HTMLCanvasElement;
    if (lastDownTarget !== canvas) {
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
  };

  /**
   * EditorCanvas : ContextMenu Handler
   */
  handleContextMenu = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * VectorEditor : DoubleClick Handler
   */
  handleDoubleClick = (event: MouseEvent) => {
    const {editor} = GLOB;
    event.preventDefault();
    event.stopPropagation();

    const mouse = this.getMouse(event);

    let p: any;
    if (p = editor.splitAt(mouse.x, mouse.y)) {
      editor.view.snapToGrid(p);
      redraw();
    }
  };

  /**
   * EditorCanvas : MouseWheel Handler
   */
  handleMouseWheel = (event: MouseEvent) => {
    const {editor} = GLOB;

    event.preventDefault();
    event.stopPropagation();

    const mouse = this.getMouse(event);

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
  };

  /**
   * Render EditorCanvas Component
   */
  render() {
    return (
      <canvas
        width="100" height="100"
        tabIndex={0}
        style={{width: '100%', height: '100%'}}
        onDblClick={this.handleDoubleClick}
        onWheel={this.handleMouseWheel}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onContextMenu={this.handleContextMenu}
        onKeyPress={this.handleKeyPress}
      >
        Your browser doesn't support the canvas element!
      </canvas>
    );
  }
}
