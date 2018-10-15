import {Component, h} from 'preact';
import {noop} from '@core/common/noop';

/**
 * VirtualList Props Interface
 */
interface VirtualListProps {
  itemHeight: number;
  cachedItems?: number;
  onGetItemsCount: () => number;
  onGetItems: (start: number, end: number) => any[];
  renderItem: (item: any, index: number) => JSX.Element;
}

/**
 * VirtualList State Interface
 */
interface VirtualListState {
  offset: number;
  height: number;
}

/**
 * VirtualList
 * @class VirtualList
 * @extends Component
 */
export default class VirtualList extends Component<VirtualListProps, VirtualListState> {
  /**
   * Default Props for VirtualList Component
   */
  static defaultProps: VirtualListProps = {
    itemHeight: 30,
    cachedItems: 10,
    onGetItemsCount: noop,
    onGetItems: noop,
    renderItem: () => null!
  };

  /**
   * VirtualList Component Constructor
   * @param {VirtualListProps} props
   */
  constructor(props: VirtualListProps) {
    super(props);
    this.state = {
      offset: 0,
      height: 0
    };
  }

  handleResize = () => {
    if (this.state.height !== this.base!.offsetHeight) {
      this.setState({height: this.base!.offsetHeight});
    }
  };

  handleScroll = () => {
    this.setState({
      offset: this.base!.scrollTop
    });
  };

  componentDidMount() {
    this.handleResize();
    addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    this.handleResize();
  }

  /**
   * Render VirtualList Component
   */
  render({cachedItems, itemHeight, renderItem, onGetItemsCount, onGetItems, ...props}: VirtualListProps, {offset, height}: VirtualListState) {
    const itemsCount = onGetItemsCount();

    let start = (offset / itemHeight) | 0;
    let count = (height / itemHeight) | 0;

    if (cachedItems) {
      start = Math.max(0, start - (start % cachedItems));
      count += cachedItems;
    }

    const end = Math.min(itemsCount, start + 1 + count);

    const items = onGetItems(start, end);

    return (
      <div class="virtual-list" {...props} onScroll={this.handleScroll}>
        <div class="virtual-list-inner" style={`height:${itemsCount * itemHeight}px;`}>
          <div class="virtual-list-content" style={`top:${start * itemHeight}px;`}>
            {items.map((item) => renderItem(item, start++))}
          </div>
        </div>
      </div>
    );
  }
}
