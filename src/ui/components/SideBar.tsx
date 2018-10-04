import {Component, h, PreactDOMAttributes} from 'preact';
import GLOB from '@root/types';
import {redraw} from '@root/main';
import defaultStorage from '@store/defaultStorage';
import VirtualList from '@ui/components/VirtualList/VirtualList';

/**
 * SideBar Props Interface
 */
interface SideBarProps {
}

/**
 * SideBar State Interface
 */
interface SideBarState {
}

/**
 * SideBar
 * @class SideBar
 * @extends Component
 */
export default class SideBar extends Component<SideBarProps, SideBarState> {
  /**
   * Default Props for SideBar Component
   */
  static defaultProps: SideBarProps = {};

  /**
   * SideBar Component Constructor
   * @param {SideBarProps} props
   */
  constructor(props: SideBarProps) {
    super(props);
    this.state = {};
  }

  /**
   * SideBar : ExportAsText Handler
   */
  handleExportAsText = () => {
    defaultStorage.setState({
      dialog: 'export-as-text'
    });
  };

  /**
   * SideBar : NewLayer Handler
   */
  handleNewLayer = () => {
    const {editor} = GLOB;

    editor.selectLayer(editor.layers.length);
    redraw();
    this.setState({});
  };

  /**
   * SideBar : NewLayout Handler
   */
  handleNewLayout = () => {
    const {editor} = GLOB;

    editor.selectLayout(editor.layout.length);
    redraw();
    this.setState({});
  };

  /**
   * SideBar : Save Handler
   */
  handleSave = () => {
    localStorage.editor2d = JSON.stringify(GLOB.editor.doSave());
  };

  /**
   * SideBar : GridClick Handler
   */
  handleGridClick = (e: Event) => {
    GLOB.drawGrid = (e.currentTarget as HTMLInputElement).checked;
    redraw();
  };

  /**
   * SideBar : ClearLayer Handler
   */
  handleClearLayer = () => {
    GLOB.editor.clearLayer();
    redraw();
  };

  /**
   * SideBar : LayerClick Handler
   */
  handleLayerClick = (e: Event) => {
    const id = parseInt((e.currentTarget as HTMLElement).dataset.id || '0');
    const {editor} = GLOB;
    editor.selectLayer(id);
    redraw();
    this.setState({});
  };

  /**
   * SideBar : LayoutClick Handler
   */
  handleLayoutClick = (e: Event) => {
    const id = parseInt((e.currentTarget as HTMLElement).dataset.id || '0');
    const {editor} = GLOB;
    editor.selectLayout(id);
    redraw();
    this.setState({});
  };

  /**
   * SideBar : LayerRemove Handler
   */
  handleLayerRemove = (e: Event) => {
    e.preventDefault();
    const id = parseInt((e.currentTarget as HTMLElement).dataset.id || '0');
    const {editor} = GLOB;
    editor.removeLayer(id);
    redraw();
    this.setState({});
  };

  renderLayerItem = (item: Layer, index: number) =>
    <div
      class={['layer-row', item === GLOB.editor.layer && 'selected']}
      onClick={this.handleLayerClick}
      data-id={index}>
      <p>{item.name ? item.name : `Layer ${1 + index}`}</p>
      <i
        class="fa fa-trash-alt"
        onClick={this.handleLayerRemove}
      />
    </div>;

  /**
   * SideBar : LayoutRemove Handler
   */
  handleLayoutRemove = (e: Event) => {
    e.preventDefault();
    const id = parseInt((e.currentTarget as HTMLElement).dataset.id || '0');
    const {editor} = GLOB;
    editor.removeLayout(id);
    redraw();
    this.setState({});
  };

  renderLayoutItem = (item: TLayers, index: number) =>
    <div
      class={['layer-row', item === GLOB.editor.layers && 'selected']}
      onClick={this.handleLayoutClick}
      data-id={index}>
      <p>Layout {1 + index}</p>
      <i
        class="fa fa-trash-alt"
        onClick={this.handleLayoutRemove}
      />
    </div>;

  /**
   * Render SideBar Component
   */
  render({children}: SideBarProps & PreactDOMAttributes, {}: SideBarState) {
    const {editor} = GLOB;

    const data: any = [];
    for (let i = 500; --i >= 0;) {
      data.push({i, Text: 'YEs'});
    }

    return (
      <div class="right-menu noselect">
        <div class="accordion">
          <div class="section">
            <input type="checkbox" id="sec-files" checked/>
            <label for="sec-files"><span>File</span></label>
            <div class="content">
              <ul>
                <li onClick={this.handleExportAsText}><i class="fa fa-file-export"/><span>Export</span></li>
                <li onClick={this.handleSave}><i class="fa fa-save"/><span>Save</span></li>
                <li onClick={this.handleClearLayer}><i class="fa fa-trash-alt"/><span>Clear Layer</span></li>
                <li>
                  <input onChange={this.handleGridClick} id="opt-grid" type="checkbox" checked/>
                  <label for="opt-grid">Show Grid</label>
                </li>
              </ul>
            </div>
          </div>

          <div class="section">
            <input type="checkbox" id="sec-layers" value="toggle" checked/>
            <label for="sec-layers"> <span>Layer</span></label>
            <div class="content" id="vlist-layers">
              <ul>
                <li id="new-layer" onClick={this.handleNewLayer}><i class="fa fa-plus"/><span>New</span></li>
              </ul>
              <div class="layers-list">
                <VirtualList itemHeight={30} data={editor.layers} renderItem={this.renderLayerItem}/>
              </div>
            </div>
          </div>

          <div class="section">
            <input type="checkbox" id="sec-layouts" value="toggle"/>
            <label for="sec-layouts"> <span>Layouts</span></label>
            <div class="content" id="vlist-layouts">
              <ul>
                <li id="new-layout" onClick={this.handleNewLayout}><i class="fa fa-plus"/><span>New</span></li>
              </ul>
              <div class="layers-list">
                <VirtualList itemHeight={30} data={editor.layout} renderItem={this.renderLayoutItem}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
