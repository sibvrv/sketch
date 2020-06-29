import {Component, h, PreactDOMAttributes} from 'preact';
import * as style from './PageEditor.less';
import ShapeOptions from '@ui/components/ShapeOptions/ShapeOptions';
import ToolBar from '@ui/components/ToolBar/ToolBar';
import ExportAsText from '@ui/modals/ExportAsText/ExportAsText';
import SideBar from '@ui/components/SideBar/SideBar';
import connectToStores from '@store/connectToStores';
import StatusBar from '@ui/components/StatusBar/StatusBar';
import VectorEditor from '@ui/components/VectorEditor';
import EditorCanvas from '@ui/components/EditorCanvas';
import ZoomLabel from '@ui/components/ZoomLabel/ZoomLabel';
import ImportImage from '@ui/modals/ImportImage/ImportImage';
import ModalOverlay from '@ui/containers/ModalOverlay/ModalOverlay';
import ModalSection from '@ui/containers/ModalSection/ModalSection';
import GLOB from '@root/types';
import defaultStorage from '@store/defaultStorage';
import {redraw} from '@root/main';
import ErrorModal from '@ui/modals/ErrorModal/ErrorModal';
import ToolBarSettings from '@ui/components/ToolBar/ToolBarSettings';

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
@connectToStores('dialog, error, shapeOptionsVisible')
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
   * PageEditor : ImportImage Handler
   */
  handleImportImage = (name: string, url: string) => {
    GLOB.editor.layer.Image(name, url);
    defaultStorage.setState({dialog: ''});
    redraw();
  };

  /**
   * Render PageEditor Component
   */
  render({dialog, error, shapeOptionsVisible}: PageEditorProps & PreactDOMAttributes, {}: PageEditorState) {
    return (
      <div class={style.pageLayout}>
        <div class={[style.pageContext, dialog || error ? style.pageBlur : '']}>
          <VectorEditor>
            <div class={style.editorArea}>
              <EditorCanvas/>

              <ToolBar/>
              <ToolBarSettings/>

              {shapeOptionsVisible && <ShapeOptions/>}

              <ZoomLabel/>
            </div>

            <SideBar/>
            <StatusBar/>
          </VectorEditor>
        </div>

        <ModalOverlay>
          <ModalSection name="error">
            <ErrorModal/>
          </ModalSection>
          <ModalSection name="export-as-text">
            <ExportAsText/>
          </ModalSection>
          <ModalSection name="import-image">
            <ImportImage onImport={this.handleImportImage}/>
          </ModalSection>
        </ModalOverlay>
      </div>
    );
  }
}
