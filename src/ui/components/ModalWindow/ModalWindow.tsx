import {Component, h, PreactDOMAttributes} from 'preact';
import * as styles from './ModalWindow.less';

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
      <div class={styles.modal_window}>
        {children}
      </div>
    );
  }
}
