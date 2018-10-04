import {Component, h, PreactDOMAttributes} from 'preact';
import defaultStorage from '@store/defaultStorage';
import GLOB from '@root/types';

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

  /**
   * ExportAsText : Close Handler
   */
  handleClose = () => {
    defaultStorage.setState({
      dialog: ''
    });
  };

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
      <div class="export_panel">
        <div class="btn close" onClick={this.handleClose}>close</div>
        <textarea class="export_data" value={data}/>
      </div>
    );
  }
}
