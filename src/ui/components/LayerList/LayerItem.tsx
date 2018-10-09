import {Component, h} from 'preact';
import {noop} from '@core/common/noop';

/**
 * LayerItem Props Interface
 */
interface LayerItemProps {
  index: number;
  name: string;
  selected?: boolean;
  onClick?: (index: number) => void;
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
    onClick: noop
  };

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
    this.props.onClick!(this.props.index);
  };

  /**
   * LayerItem : Remove Handler
   */
  handleRemove = (e: Event) => {
    e.stopPropagation();
    this.props.onRemove!(this.props.index);
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
        <p>{name ? name : `Layer ${1 + index}`}</p>
        <i
          class="fa fa-trash-alt"
          onClick={this.handleRemove}
        />
      </div>
    );
  }
}
