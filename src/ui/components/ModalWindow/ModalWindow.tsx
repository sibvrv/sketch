import {Component, h, PreactDOMAttributes} from 'preact';

/**
 * ModalWindow Props Interface
 */
interface ModalWindowProps {
}

/**
 * ModalWindow State Interface
 */
interface ModalWindowState {
}

/**
 * ModalWindow
 * @class ModalWindow
 * @extends Component
 */
export default class ModalWindow extends Component<ModalWindowProps, ModalWindowState> {
  /**
   * Default Props for ModalWindow Component
   */
  static defaultProps: ModalWindowProps = {};

  /**
   * ModalWindow Component Constructor
   * @param {ModalWindowProps} props
   */
  constructor(props: ModalWindowProps) {
    super(props);
    this.state = {};
  }

  /**
   * Render ModalWindow Component
   */
  render({children}: ModalWindowProps & PreactDOMAttributes, {}: ModalWindowState) {
    return (
      <div>
        {children}
      </div>
    );
  }
}
