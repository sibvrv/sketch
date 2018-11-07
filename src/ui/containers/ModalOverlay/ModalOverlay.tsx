import {Component, h, PreactDOMAttributes} from 'preact';
import connectToStores from '@store/connectToStores';
import defaultStorage from '@store/defaultStorage';

/**
 * ModalOverlay Props Interface
 */
interface ModalOverlayProps {
  dialog?: string;
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
@connectToStores('dialog')
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

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  hideDialogs = () => {
    defaultStorage.setState({
      dialog: ''
    });
  };

  /**
   * ModalOverlay : OverlayClick Handler
   */
  handleOverlayClick = () => {
    this.hideDialogs();
  };

  /**
   * ModalOverlay : KeyDown Handler
   */
  handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || !this.props.dialog) {
      return;
    }

    const elememt = (event.target as HTMLElement);
    const tag = elememt.tagName.toLowerCase();

    const contentEditable = elememt.nodeType !== 3 ? Boolean(elememt.getAttribute('contenteditable')) : false;

    if (!event.altKey && !event.ctrlKey && !event.shiftKey && tag !== 'input' && tag !== 'textarea' && !contentEditable && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.hideDialogs();
    }
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
