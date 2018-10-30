import {Component, h, PreactDOMAttributes} from 'preact';
import GLOB from '@root/types';
import {redraw} from '@root/main';
import {TPath} from '@editor/TPath';
import defaultStorage from '@store/defaultStorage';
import VirtualList from '@ui/components/VirtualList/VirtualList';
import LayerItem from '@ui/components/LayerList/LayerItem';
import {collectionGetItemsRange} from '@core/CollectionUtils';
import {Collection} from '@core/Collection';
import './SideBar.less';
import {selected_info} from '@ui/actions/actionsSelect';

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
   * @param {Collection} item
   */
  handleLayerClick = (item: Collection) => {
    const {editor} = GLOB;

    let layer = item;
    while (layer && layer.type !== 'layer') {
      layer = layer.parent;
    }

    if (layer) {
      editor.selectLayer(editor.layers.indexOf(layer));
    }

    if (item.type === 'path') {
      editor.selected.reset();
      editor.selected.sector = item as TPath;
      selected_info();
    }

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
   * @param {Collection} item
   * @param {number} index
   * @returns {any}
   */
  renderLayerItem = (item: Collection, index: number) =>
    <LayerItem
      index={index}
      name={item.props('name') as string}
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
    return editor.layers.childrenCount;
  };

  /**
   * SideBar : LayerItems Handler
   */
  handleLayerItems = (from: number, to: number) => {
    const {editor} = GLOB;
    return collectionGetItemsRange(editor.layers, from, Math.max(10, to - from));
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
