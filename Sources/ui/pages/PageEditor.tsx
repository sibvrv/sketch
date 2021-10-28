import {Component, h} from 'preact';
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
import MainMenu from '@ui/components/MainMenu/MainMenu';
import {IMainMenuStore} from '@store/MainMenuStore';

/**
 * PageEditor Props Interface
 */
interface PageEditorProps {
  error?: string;
  dialog?: string;
  shapeOptionsVisible?: boolean;
  mainMenu?: IMainMenuStore;
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
@connectToStores('dialog, error, shapeOptionsVisible, mainMenu')
export default class PageEditor extends Component<PageEditorProps, PageEditorState> {
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

  onMenuClick = (id: string) => {
    if (id === 'view.grid.toggle') {
      const {drawGrid} = defaultStorage.getState();
      defaultStorage.setState({
        drawGrid: !drawGrid,
      });
      redraw();
    }
  };

  /**
   * Render PageEditor Component
   */
  render() {
    const {
      dialog,
      error,
      shapeOptionsVisible,
      mainMenu,
    } = this.props;

    return (
      <div class={style.pageLayout}>
        <div class={[style.pageContext, dialog || error ? style.pageBlur : '']}>
          <VectorEditor>
            <MainMenu items={mainMenu?.items} onItemClick={this.onMenuClick}/>

            <div class={style.editorArea}>
              <EditorCanvas/>

              <ToolBar/>

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
