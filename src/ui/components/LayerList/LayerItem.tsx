import {Component, h} from 'preact';
import {noop} from '@core/common/noop';
import {setCaretPosition} from '@ui/helpers/setCaretPosition';

const enum EDITABLE {
  FALSE = 'false',
  PLAIN = 'plaintext-only'
}

/**
 * LayerItem Props Interface
 */
interface LayerItemProps {
  index: number;
  name: string;
  selected?: boolean;
  onClick?: (index: number) => void;
  onDblClick?: (index: number) => void;
  onChange?: (index: number, name: string) => void;
  onRemove?: (index: number) => void;
}

/**
 * LayerItem State Interface
 */
interface LayerItemState {
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
    this.state = {};
  }

  /**
   * LayerItem : Click Handler
   */
  handleClick = (e: Event) => {
    if (this.input.contentEditable !== EDITABLE.PLAIN) {
      this.props.onClick!(this.props.index);
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
    this.input.contentEditable = EDITABLE.PLAIN;
    this.input.className = 'inEdit';
    this.input.focus();
    this.props.onDblClick!(this.props.index);
  };

  /**
   * LayerItem : Blur Handler
   */
  handleBlur = () => {
    setCaretPosition(this.input, 0);
    this.input.contentEditable = EDITABLE.FALSE;
    this.input.className = '';
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
  render({index, name, selected}: LayerItemProps, {}: LayerItemState) {
    return (
      <div
        class={['layer-row', selected && 'selected']}
        onClick={this.handleClick}
        data-id={index}>
        <p
          onDblClick={this.handleDblClick}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          ref={this.refInput}
        >{name || `Layer ${1 + index}`}</p>
        <i
          class="fa fa-trash-alt"
          onClick={this.handleRemove}
        />
      </div>
    );
  }
}
