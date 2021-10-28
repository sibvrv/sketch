import {Component, h} from 'preact';
import * as styles from './ModalHeader.less';
import defaultStorage from '@store/defaultStorage';

/**
 * ModalHeader Props Interface
 */
interface ModalHeaderProps {
  title: string;
  closeButton?: boolean;
}

/**
 * ModalHeader State Interface
 */
interface ModalHeaderState {
}

/**
 * ModalHeader
 * @class ModalHeader
 * @extends Component
 */
export default class ModalHeader extends Component<ModalHeaderProps, ModalHeaderState> {
  /**
   * Default Props for ModalHeader Component
   */
  static defaultProps: ModalHeaderProps = {
    title: '',
    closeButton: true
  };

  /**
   * ModalHeader Component Constructor
   * @param {ModalHeaderProps} props
   */
  constructor(props: ModalHeaderProps) {
    super(props);
    this.state = {};
  }

  /**
   * ModalHeader : Close Handler
   */
  handleClose = () => {
    defaultStorage.setState({
      dialog: '',
      error: ''
    });
  };

  /**
   * Render ModalHeader Component
   */
  render({title, closeButton}: ModalHeaderProps, {}: ModalHeaderState) {
    return (
      <div class={styles.modal_header}>
        <h5 class={styles.modal_title}>{title}</h5>
        {closeButton &&
        <button onClick={this.handleClose} type="button" class={styles.modal_close} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>}
      </div>
    );
  }
}
