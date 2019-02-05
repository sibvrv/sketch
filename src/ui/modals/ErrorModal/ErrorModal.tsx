import {Component, h} from 'preact';
import * as style from './ErrorModal.less';
import connectToStores from '@store/connectToStores';
import ModalWindow from '@ui/components/ModalWindow/ModalWindow';
import ModalHeader from '@ui/components/ModalWindow/ModalHeader';
import ModalBody from '@ui/components/ModalWindow/ModalBody';

/**
 * ErrorModal Props Interface
 */
interface ErrorModalProps {
  error?: string;
}

/**
 * ErrorModal State Interface
 */
interface ErrorModalState {
}

/**
 * ErrorModal
 * @class ErrorModal
 * @extends Component
 */
@connectToStores('error')
export default class ErrorModal extends Component<ErrorModalProps, ErrorModalState> {
  /**
   * Default Props for ErrorModal Component
   */
  static defaultProps: ErrorModalProps = {
    error: ''
  };

  /**
   * ErrorModal Component Constructor
   * @param {ErrorModalProps} props
   */
  constructor(props: ErrorModalProps) {
    super(props);
    this.state = {};
  }

  /**
   * Render ErrorModal Component
   */
  render({error}: Readonly<ErrorModalProps>, {}: Readonly<ErrorModalState>) {
    return (
      <ModalWindow>
        <ModalHeader title="Error"/>
        <ModalBody>
          <div class={style.errorMessage}>{error}</div>
        </ModalBody>
      </ModalWindow>
    );
  }
}
