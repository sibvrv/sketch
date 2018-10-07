import {Component, h} from 'preact';
import {loop_range} from '@core/common/loops';

/**
 * VirtualList Props Interface
 */
interface VirtualListProps {
  data: any[];
  itemHeight: number;
  cachedItems?: number;
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
    data: [],
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
  render({cachedItems, itemHeight, renderItem, data, ...props}: VirtualListProps, {offset, height}: VirtualListState) {
    let start = (offset / itemHeight) | 0;
    let count = (height / itemHeight) | 0;

    if (cachedItems) {
      start = Math.max(0, start - (start % cachedItems));
      count += cachedItems;
    }

    const end = Math.min(data.length, start + 1 + count);

    return (
      <div class="virtual-list" {...props} onScroll={this.handleScroll}>
        <div class="virtual-list-inner" style={`height:${data.length * itemHeight}px;`}>
          <div class="virtual-list-content" style={`top:${start * itemHeight}px;`}>
            {loop_range(data, start, end, renderItem)}
          </div>
        </div>
      </div>
    );
  }
}
