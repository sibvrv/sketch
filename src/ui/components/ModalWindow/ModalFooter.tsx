import {Component, h, PreactDOMAttributes} from 'preact';

/**
 * ModalFooter Props Interface
 */
interface ModalFooterProps {
}

/**
 * ModalFooter State Interface
 */
interface ModalFooterState {
}

/**
 * ModalFooter
 * @class ModalFooter
 * @extends Component
 */
export default class ModalFooter extends Component<ModalFooterProps, ModalFooterState> {
  /**
   * Default Props for ModalFooter Component
   */
  static defaultProps: ModalFooterProps = {};

  /**
   * ModalFooter Component Constructor
   * @param {ModalFooterProps} props
   */
  constructor(props: ModalFooterProps) {
    super(props);
    this.state = {};
  }

  /**
   * Render ModalFooter Component
   */
  render({children}: ModalFooterProps & PreactDOMAttributes, {}: ModalFooterState) {
    return (
      <div>{children}</div>
    )
  }
}
