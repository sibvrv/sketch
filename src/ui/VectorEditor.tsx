import {Component, h, PreactDOMAttributes} from 'preact';
import {initEditorApplication} from '@root/main';

/**
 * VectorEditor Props Interface
 */
interface VectorEditorProps {
}

/**
 * VectorEditor State Interface
 */
interface VectorEditorState {
}

/**
 * VectorEditor
 * @class VectorEditor
 * @extends Component
 */
export default class VectorEditor extends Component<VectorEditorProps, VectorEditorState> {
  /**
   * Default Props for VectorEditor Component
   */
  static defaultProps: VectorEditorProps = {};

  editorContext = {};

  /**
   * VectorEditor Component Constructor
   * @param {VectorEditorProps} props
   */
  constructor(props: VectorEditorProps) {
    super(props);
    this.state = {};
    this.editorContext = {
      onCanvasReady: this.onCanvasReady
    };
  }

  getChildContext() {
    return {
      editor: this.editorContext
    };
  }

  onCanvasReady = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    initEditorApplication(canvas, ctx);
  };

  /**
   * Render VectorEditor Component
   */
  render({children}: VectorEditorProps & PreactDOMAttributes, {}: VectorEditorState) {
    return (
      <div>{children}</div>
    );
  }
}
