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
  refCanvas: HTMLCanvasElement;

  handleFileLoader = (element: HTMLInputElement) => this.refFileLoader = element;
  handleCanvas = (element: HTMLCanvasElement) => this.refCanvas = element;

  /**
   * ImportImage Component Constructor
   * @param {ImportImageProps} props
   */
  constructor(props: ImportImageProps) {
    super(props);
    this.state = {};
  }

  /**
   * ImportImage : ChangeFile Handler
   */
  handleChangeFile = (e: Event) => {
    const ctx = this.refCanvas.getContext('2d')!;
    const img = new Image();
    img.src = URL.createObjectURL((e.target as any).files[0]); // todo fix types
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
  };

  /**
   * Render ImportImage Component
   */
  render({}: ImportImageProps, {}: ImportImageState) {
    return (
      <ModalWindow>
        <ModalHeader title="Import Image"/>
        <ModalBody>
          <div class={style.importImageDialog}>
            <h4>Preview:</h4>
            <canvas ref={this.handleCanvas} width="400" height="300" id="canvas"/>
            <h4>File:</h4>
            <input ref={this.handleFileLoader} type="file" id="input" onChange={this.handleChangeFile}/>
          </div>
        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </ModalWindow>
    );
  }
}
