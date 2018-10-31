import {Component, h} from 'preact';
import {noop} from '@core/common/noop';
import {Collection} from '@core/Collection';
import './LayerItem.less';

/**
 * LayerItem Props Interface
 */
interface LayerItemProps {
  index: number;
  name: string;
  data?: Collection;
  collapsible?: boolean;
  selected?: boolean;
  onClick?: (item: Collection) => void;
  onDblClick?: (index: number) => void;
  onChange?: (index: number, name: string) => void;
  onRemove?: (index: number) => void;
}

/**
 * LayerItem State Interface
 */
interface LayerItemState {
  inEdit: boolean;
  level: number;
}

/**
 * LayerItem
 * @class LayerItem
 * @extends Component
 */
export default class LayerItem extends Component<LayerItemProps, LayerItemState> {
  /**
   * Default Props for LayerItem Component
   */
  static defaultProps: LayerItemProps = {
    index: 0,
    name: '',
    data: null!,
    collapsible: false,
    onClick: noop,
    onDblClick: noop,
    onChange: noop,
    onRemove: noop
  };

  input: HTMLElement;
  refInput = (el: HTMLElement) => this.input = el;

  /**
   * LayerItem Component Constructor
   * @param {LayerItemProps} props
   */
  constructor(props: LayerItemProps) {
    super(props);
    this.state = {
      inEdit: false,
      level: this.getItemLevel(props.data!)
    };
  }

  getItemLevel = (item: Collection) => {
    let level = 0;
    for (; item; item = item.parent) {
      level++;
    }
    return level;
  };

  /**
   * LayerItem : Click Handler
   */
  handleClick = (e: Event) => {
    if (!this.state.inEdit) {
      this.props.onClick!(this.props.data!);
    }
  };

  /**
   * LayerItem : Remove Handler
   */
  handleRemove = (e: Event) => {
    e.stopPropagation();
    this.props.onRemove!(this.props.index);
  };

  /**
   * LayerItem : DblClick Handler
   */
  handleDblClick = () => {
    this.setState({
      inEdit: true
    }, () => {
      this.input.focus();
    });
    this.props.onDblClick!(this.props.index);
  };

  /**
   * LayerItem : Blur Handler
   */
  handleBlur = () => {
    this.setState({
      inEdit: false
    });
    this.input.scrollLeft = 0;
    this.props.onChange!(this.props.index, (this.input.textContent || '').trim());
  };

  /**
   * LayerItem : KeyDown Handler
   */
  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key && ['Escape', 'Enter'].indexOf(e.key) >= 0) {
      this.handleBlur();
      e.preventDefault();
    }
  };

  /**
   * Render LayerItem Component
   */
  render({index, name, selected, data}: LayerItemProps, {inEdit, level}: LayerItemState) {
    const isLayer = data && data.type === 'layer';
    return (
      <div
        class={['layer-row', selected && 'selected', `level_${level}`, isLayer && 'layer-item']}
        onClick={this.handleClick}
        data-id={index}>
        {isLayer && <i class="fa fa-folder-open"/>}
        <p
          onDblClick={this.handleDblClick}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          contentEditable={inEdit}
          class={inEdit ? 'inEdit' : ''}
          ref={this.refInput}
        >{name || `Layer ${1 + index}`}</p>
        {
          !inEdit && <span class="icons-frame">
            <i class="fa fa-trash-alt" onClick={this.handleRemove}/>
          </span>
        }
      </div>
    );
  }
}
