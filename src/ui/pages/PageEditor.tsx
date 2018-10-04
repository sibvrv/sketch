import {Component, h, PreactDOMAttributes} from 'preact';
import ShapeOptions from '../components/ShapeOptions';
import ToolsBar from '../components/ToolsBar';
import ExportAsText from '../modals/ExportAsText';
import SideBar from '../components/SideBar';
import connectToStores from '../../store/connectToStores';
import StatusBar from '../components/StatusBar';
import VectorEditor from '@ui/VectorEditor';
import EditorCanvas from '@ui/components/EditorCanvas';

/**
 * PageEditor Props Interface
 */
interface PageEditorProps {
  zoom?: number;
  error?: string;
  dialog?: string;
  shapeOptionsVisible?: boolean;
}

/**
 * PageEditor State Interface
 */
interface PageEditorState {
}

/**
 * PageEditor
 * @class PageEditor
 * @extends Component
 */
@connectToStores('zoom, error, dialog, shapeOptionsVisible')
export default class PageEditor extends Component<PageEditorProps, PageEditorState> {
  /**
   * Default Props for PageEditor Component
   */
  static defaultProps: PageEditorProps = {};

  /**
   * PageEditor Component Constructor
   * @param {PageEditorProps} props
   */
  constructor(props: PageEditorProps) {
    super(props);
    this.state = {};
  }

  /**
   * Render PageEditor Component
   */
  render({zoom, error, dialog, shapeOptionsVisible}: PageEditorProps & PreactDOMAttributes, {}: PageEditorState) {
    return (
      <VectorEditor>
        <div class="draw_2d">

          <ToolsBar/>
          {shapeOptionsVisible && <ShapeOptions/>}

          <div id="zoom">{zoom}</div>

          <EditorCanvas/>
        </div>

        <SideBar/>
        <StatusBar/>

        {dialog === 'export-as-text' && <ExportAsText/>}
        {error && <div class="error_message noselect" style="font-weight: bold">{error}</div>}
      </VectorEditor>
    );
  }
}
