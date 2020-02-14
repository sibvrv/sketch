import {Component, h} from 'preact';
import connectToStores from '@store/connectToStores';
import * as style from './ZoomLabel.less';
import {viewActions, ViewActionsInterface} from '@ui/actions/vewActions';

/**
 * ZoomLabel Props Interface
 */
interface ZoomLabelProps extends ViewActionsInterface {
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
@connectToStores('zoom', null!, viewActions)
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
   * ZoomLabel : Reset Handler
   */
  handleReset = () => {
    this.props.setZoom!(1);
  };

  /**
   * Render ZoomLabel Component
   */
  render({zoom}: ZoomLabelProps, {}: ZoomLabelState) {
    return (
      <div class={style.zoom_label} onClick={this.handleReset}>
        {zoom}
      </div>
    );
  }
}
