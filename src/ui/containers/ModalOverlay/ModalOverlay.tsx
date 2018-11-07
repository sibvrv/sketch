import {Component, h, PreactDOMAttributes} from 'preact';
import connectToStores from '@store/connectToStores';
import defaultStorage from '@store/defaultStorage';

/**
 * ModalOverlay Props Interface
 */
interface ModalOverlayProps {
}

/**
 * ModalOverlay State Interface
 */
interface ModalOverlayState {
}

/**
 * ModalOverlay
 * @class ModalOverlay
 * @extends Component
 */
@connectToStores('dialogs')
export default class ModalOverlay extends Component<ModalOverlayProps, ModalOverlayState> {
  /**
   * Default Props for ModalOverlay Component
   */
  static defaultProps: ModalOverlayProps = {};

  /**
   * ModalOverlay Component Constructor
   * @param {ModalOverlayProps} props
   */
  constructor(props: ModalOverlayProps) {
    super(props);
    this.state = {};
  }

  /**
   * ModalOverlay : OverlayClick Handler
   */
  handleOverlayClick = () => {
    defaultStorage.setState({
      dialog: ''
    });
  };

  /**
   * Render ModalOverlay Component
   */
  render({children}: ModalOverlayProps & PreactDOMAttributes, {}: ModalOverlayState) {
    return (
      <div class="dialogs_overlay noSelect" onClick={this.handleOverlayClick}>
        {children}
      </div>
    );
  }
}
