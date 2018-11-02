import {Component, h} from 'preact';
import connectToStores from '@store/connectToStores';
import * as style from './ZoomLabel.less';

/**
 * ZoomLabel Props Interface
 */
interface ZoomLabelProps {
  zoom?: number;
}

/**
 * ZoomLabel State Interface
 */
interface ZoomLabelState {
}

/**
 * ZoomLabel
 * @class ZoomLabel
 * @extends Component
 */
@connectToStores('zoom')
export default class ZoomLabel extends Component<ZoomLabelProps, ZoomLabelState> {
  /**
   * Default Props for ZoomLabel Component
   */
  static defaultProps: ZoomLabelProps = {};

  /**
   * ZoomLabel Component Constructor
   * @param {ZoomLabelProps} props
   */
  constructor(props: ZoomLabelProps) {
    super(props);
    this.state = {};
  }

  /**
   * Render ZoomLabel Component
   */
  render({zoom}: ZoomLabelProps, {}: ZoomLabelState) {
    return (
      <div class={style.zoom_label}>
        {zoom}
      </div>
    );
  }
}
