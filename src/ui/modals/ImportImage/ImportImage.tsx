import {Component, h} from 'preact';
import * as style from './ImportImage.less';
import ModalWindow from '@ui/components/ModalWindow/ModalWindow';
import ModalHeader from '@ui/components/ModalWindow/ModalHeader';
import ModalFooter from '@ui/components/ModalWindow/ModalFooter';
import ModalBody from '@ui/components/ModalWindow/ModalBody';

/**
 * ImportImage Props Interface
 */
interface ImportImageProps {
}

/**
 * ImportImage State Interface
 */
interface ImportImageState {
  imageURL: string;
}

/**
 * ImportImage
 * @class ImportImage
 * @extends Component
 */
export default class ImportImage extends Component<ImportImageProps, ImportImageState> {
  /**
   * Default Props for ImportImage Component
   */
  static defaultProps: ImportImageProps = {};

  refFileLoader: HTMLInputElement;
  handleFileLoader = (element: HTMLInputElement) => this.refFileLoader = element;

  /**
   * ImportImage Component Constructor
   * @param {ImportImageProps} props
   */
  constructor(props: ImportImageProps) {
    super(props);
    this.state = {
      imageURL: ''
    };
  }

  /**
   * ImportImage : ChangeFile Handler
   */
  handleChangeFile = (e: Event) => {
    this.setState({
      imageURL: URL.createObjectURL((e.target as any).files[0]) // todo fix types
    });
  };

  /**
   * Render ImportImage Component
   */
  render({}: ImportImageProps, {imageURL}: ImportImageState) {
    return (
      <ModalWindow>
        <ModalHeader title="Import Image"/>
        <ModalBody>
          <div class={style.importImageDialog}>
            <div class={style.imagePreviewContent}>
              <img src={imageURL}/>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <input ref={this.handleFileLoader} type="file" id="input" onChange={this.handleChangeFile}/>
        </ModalFooter>
      </ModalWindow>
    );
  }
}
