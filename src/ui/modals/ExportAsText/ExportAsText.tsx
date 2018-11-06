import {Component, h, PreactDOMAttributes} from 'preact';
import defaultStorage from '@store/defaultStorage';
import GLOB from '@root/types';
import * as styles from './ExportAsText.less';
import ModalWindow from '@ui/components/ModalWindow/ModalWindow';
import ModalHeader from '@ui/components/ModalWindow/ModalHeader';
import ModalBody from '@ui/components/ModalWindow/ModalBody';

/**
 * ExportAsText Props Interface
 */
interface ExportAsTextProps {
}

/**
 * ExportAsText State Interface
 */
interface ExportAsTextState {
  data: string;
}

/**
 * ExportAsText
 * @class ExportAsText
 * @extends Component
 */
export default class ExportAsText extends Component<ExportAsTextProps, ExportAsTextState> {
  /**
   * Default Props for ExportAsText Component
   */
  static defaultProps: ExportAsTextProps = {};

  /**
   * ExportAsText Component Constructor
   * @param {ExportAsTextProps} props
   */
  constructor(props: ExportAsTextProps) {
    super(props);
    this.state = {
      data: ''
    };
  }

  componentDidMount() {
    this.setState({
      data: GLOB.editor.doExport()
    });
  }

  /**
   * Render ExportAsText Component
   */
  render({children}: ExportAsTextProps & PreactDOMAttributes, {data}: ExportAsTextState) {
    return (
      <ModalWindow>
        <ModalHeader title="Export as Text"/>
        <ModalBody>
          <div class={styles.export_data} tabIndex={0} contentEditable={true}>
            {data}
          </div>
        </ModalBody>
      </ModalWindow>
    );
  }
}
