import {Component, h, PreactDOMAttributes} from 'preact';
import GLOB from '@root/types';
import {redraw} from '@root/main';
import defaultStorage from '@store/defaultStorage';
import VirtualList from '@ui/components/VirtualList/VirtualList';
import LayerItem from '@ui/components/LayerList/LayerItem';

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
   * @param {Event} e
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
   * @param {Event} e
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
   * @param {number} index
   */
  handleLayerClick = (index: number) => {
    const {editor} = GLOB;
    editor.selectLayer(index);
    redraw();
    this.setState({});
  };

  /**
   * SideBar : LayerRemove Handler
   * @param {number} index
   */
  handleLayerRemove = (index: number) => {
    const {editor} = GLOB;
    editor.removeLayer(index);
    redraw();
    this.setState({});
  };

  /**
   * SideBar : RenameLayer Handler
   * @param {number} index
   * @param {string} name
   */
  handleRenameLayer = (index: number, name: string) => {
    const {editor} = GLOB;
    editor.renameLayer(index, name);
    this.setState({});
  };

  /**
   * Render Layer Item
   * @param {Layer} item
   * @param {number} index
   * @returns {any}
   */
  renderLayerItem = (item: Layer, index: number) =>
    <LayerItem
      index={index}
      name={item.name || ''}
      selected={item === GLOB.editor.layer}
      data={item}
      onClick={this.handleLayerClick}
      onRemove={this.handleLayerRemove}
      onChange={this.handleRenameLayer}
    />;

  /**
   * SideBar : LayerItemsCount Handler
   */
  handleLayerItemsCount = () => {
    const {editor} = GLOB;
    return editor.layers.length + editor.layer.shape.rawItems.length;
  };

  /**
   * SideBar : LayerItems Handler
   */
  handleLayerItems = (from: number, to: number) => {
    const {editor} = GLOB;

    const items = editor.layers;
    const subItems = editor.layer.shape.rawItems;

    const subItemsStart = 1 + items.indexOf(editor.layer);
    const subItemsEnd = subItemsStart + subItems.length;

    const ret: any[] = [];
    for (let i = from; i < to; i++) {
      if (i >= subItemsStart) {
        if (i < subItemsEnd) {
          ret.push(subItems[i - subItemsStart]);
        } else {
          ret.push(items.get(i + 1 - subItemsEnd));
        }
      } else if (i >= subItemsEnd) {
        ret.push(items.get(i - subItemsEnd));
      } else {
        ret.push(items.get(i));
      }
    }
    console.log(ret);
    return ret;
  };

  /**
   * Render SideBar Component
   */
  render({children}: SideBarProps & PreactDOMAttributes, {accordion}: SideBarState) {
    return (
      <div class="right-menu noSelect">
        <div class="accordion flex-vertical absolute">
          <div class="section">
            <input type="checkbox" id="sectionFile"
                   checked={accordion.sectionFile} onChange={this.handleAccordion}/>
            <label for="sectionFile"><span>File</span></label>
            <div class="content">
              <ul>
                <li onClick={this.handleExportAsText}>
                  <i class="fa fa-file-export"/><span>Export</span>
                </li>
                <li onClick={this.handleSave}>
                  <i class="fa fa-save"/><span>Save</span>
                </li>
                <li onClick={this.handleClearLayer}>
                  <i class="fa fa-trash-alt"/><span>Clear Layer</span>
                </li>
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
                <VirtualList
                  itemHeight={30}
                  onGetItemsCount={this.handleLayerItemsCount}
                  onGetItems={this.handleLayerItems}
                  renderItem={this.renderLayerItem}/>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
