import {Component, h, PreactDOMAttributes} from 'preact';
import ShapeOptions from '@ui/components/ShapeOptions/ShapeOptions';
import ToolBar from '@ui/components/ToolBar/ToolBar';
import ExportAsText from '@ui/modals/ExportAsText/ExportAsText';
import SideBar from '@ui/components/SideBar/SideBar';
import connectToStores from '@store/connectToStores';
import StatusBar from '@ui/components/StatusBar/StatusBar';
import VectorEditor from '@ui/VectorEditor';
import EditorCanvas from '@ui/components/EditorCanvas';
import ZoomLabel from '@ui/components/ZoomLabel/ZoomLabel';
import ImportImage from '@ui/modals/ImportImage/ImportImage';

/**
 * PageEditor Props Interface
 */
interface PageEditorProps {
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
@connectToStores('error, dialog, shapeOptionsVisible')
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
  render({error, dialog, shapeOptionsVisible}: PageEditorProps & PreactDOMAttributes, {}: PageEditorState) {
    return (
      <VectorEditor>
        <div class="draw_2d">
          <EditorCanvas/>

          <ToolBar/>
          {shapeOptionsVisible && <ShapeOptions/>}

          <ZoomLabel/>
        </div>

        <SideBar/>
        <StatusBar/>

        {dialog === 'export-as-text' && <ExportAsText/>}
        {dialog === 'import-image' && <ImportImage/>}

        {error && <div class="error_message noSelect" style="font-weight: bold">{error}</div>}
      </VectorEditor>
    );
  }
}
