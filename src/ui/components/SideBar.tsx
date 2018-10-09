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
  accordion: {
    [item: string]: boolean
  };
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
    this.state = {
      accordion: {
        sectionFile: true,
        sectionLayers: true
      }
    };
  }

  /**
   * SideBar : Accordion Handler
   */
  handleAccordion = (e: Event) => {
    const checkBox = e.currentTarget as HTMLInputElement;
    this.setState({
      accordion: {...this.state.accordion, [checkBox.id]: checkBox.checked}
    });
  };

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

  /**
   * Render Layer Item
   * @param {Layer} item
   * @param {number} index
   * @returns {any}
   */
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
   * Render SideBar Component
   */
  render({children}: SideBarProps & PreactDOMAttributes, {accordion}: SideBarState) {
    const {editor} = GLOB;

    return (
      <div class="right-menu noSelect">
        <div class="accordion flex-vertical absolute">
          <div class="section">
            <input type="checkbox" id="sectionFile"
                   checked={accordion.sectionFile} onChange={this.handleAccordion}/>
            <label for="sectionFile"><span>File</span></label>
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

          <div class="section grow flex-vertical">
            <input type="checkbox" id="sectionLayers"
                   checked={accordion.sectionLayers}
                   onChange={this.handleAccordion}/>
            <label for="sectionLayers"> <span>Layer</span></label>
            <div class="content grow flex-vertical" id="vlist-layers">
              <ul class="layer-toolbar">
                <li onClick={this.handleNewLayer}><i class="fa fa-plus"/><span>New</span></li>
              </ul>
              <div class="layers-list grow">
                <VirtualList itemHeight={30} data={editor.layers} renderItem={this.renderLayerItem}/>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
