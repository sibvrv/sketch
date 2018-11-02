import {Component, h} from 'preact';
import defaultStorage from '@store/defaultStorage';
import {redraw} from '@root/main';
import {Vec2} from '@core/math/Vec2';
import GLOB from '@root/types';

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
    let ctx: CanvasRenderingContext2D = null!;
    try {
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    } catch (e) {
      defaultStorage.setState({
        error: `Sorry, your browser doesn't support the canvas element.`
      });
      return;
    }

    canvas.addEventListener('dblclick', this.handleDoubleClick, false);
    canvas.addEventListener('mousewheel', this.handleMouseWheel, false);
    canvas.addEventListener('contextmenu', this.handleContextMenu, false);

    this.context.editor.onCanvasReady(canvas, ctx);
    this.setState({
      ready: true
    });
  }

  getMouse(event: MouseEvent) {
    const canvas = this.base as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    return (new Vec2(event.clientX - rect.left, event.clientY - rect.top)).round();
  }

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
    return <canvas id="editor" width="100" height="100" tabIndex={0} style={{width: '100%', height: '100%'}}>
      Your browser doesn't support the canvas element!
    </canvas>;
  }
}
