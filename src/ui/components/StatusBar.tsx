import {Component, h} from 'preact';
import connectToStores from '../../store/connectToStores';

/**
 * StatusBar Props Interface
 */
interface StatusBarProps {
  status?: string;
}

/**
 * StatusBar State Interface
 */
interface StatusBarState {
}

/**
 * StatusBar
 * @class StatusBar
 * @extends Component
 */
@connectToStores('status')
export default class StatusBar extends Component<StatusBarProps, StatusBarState> {
  /**
   * StatusBar Component Constructor
   * @param {StatusBarProps} props
   */
  constructor(props: StatusBarProps) {
    super(props);
    this.state = {};
  }

  /**
   * Render StatusBar Component
   */
  render({status}: StatusBarProps, {}: StatusBarState) {
    return (
      <div id="status">{status}</div>
    );
  }
}
