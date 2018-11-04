import {Component, h} from 'preact';

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
   * Render ModalHeader Component
   */
  render({title, closeButton}: ModalHeaderProps, {}: ModalHeaderState) {
    return (
      <div>
        <h5>{title}</h5>
        {closeButton &&
        <button type="button" class="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>}
      </div>
    );
  }
}
