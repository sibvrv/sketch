import {Component, h} from 'preact';
import defaultStorage from '@store/defaultStorage';

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
    this.context.editor.onCanvasReady(canvas, ctx);
    this.setState({
      ready: true
    });
  }

  /**
   * Render EditorCanvas Component
   */
  render() {
    return <canvas id="editor" width="100" height="100" tabIndex={0} style={{width: '100%', height: '100%'}}>Your browser doesn't support the canvas element!</canvas>;
  }
}
