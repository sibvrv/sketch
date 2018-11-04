import {Component, h, PreactDOMAttributes} from 'preact';

/**
 * ModalBody Props Interface
 */
interface ModalBodyProps {
}

/**
 * ModalBody State Interface
 */
interface ModalBodyState {
}

/**
 * ModalBody
 * @class ModalBody
 * @extends Component
 */
export default class ModalBody extends Component<ModalBodyProps, ModalBodyState> {
  /**
   * Default Props for ModalBody Component
   */
  static defaultProps: ModalBodyProps = {};

  /**
   * ModalBody Component Constructor
   * @param {ModalBodyProps} props
   */
  constructor(props: ModalBodyProps) {
    super(props);
    this.state = {};
  }

  /**
   * Render ModalBody Component
   */
  render({children}: ModalBodyProps & PreactDOMAttributes, {}: ModalBodyState) {
    return (
      <div>{children}</div>
    )
  }
}
