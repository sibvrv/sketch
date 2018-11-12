import {Component, h} from 'preact';
import {noop} from '@core/common/noop';
import * as style from './ImportImage.less';
import ModalWindow from '@ui/components/ModalWindow/ModalWindow';
import ModalHeader from '@ui/components/ModalWindow/ModalHeader';
import ModalFooter from '@ui/components/ModalWindow/ModalFooter';
import ModalBody from '@ui/components/ModalWindow/ModalBody';
import Button from '@root/ui/components/Button/Button';
import {formatBytes} from '@core/string/formatBytes';

/**
 * ImportImage Props Interface
 */
interface ImportImageProps {
  onImport?: (url: string) => any;
}

/**
 * ImportImage State Interface
 */
interface ImportImageState {
  name: string;
  size: number;
  mimeType: string;
  imageURL: string;
  imageType: string;
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
  static defaultProps: ImportImageProps = {
    onImport: noop
  };
  static defaultState: ImportImageState = {
    name: '',
    mimeType: '',
    size: 0,
    imageURL: '',
    imageType: ''
  };

  refFileLoader: HTMLInputElement;
  handleFileLoader = (element: HTMLInputElement) => this.refFileLoader = element;

  /**
   * ImportImage Component Constructor
   * @param {ImportImageProps} props
   */
  constructor(props: ImportImageProps) {
    super(props);
    this.state = {...ImportImage.defaultState};
  }

  /**
   * ImportImage : ChangeFile Handler
   */
  handleChangeFile = (e: Event) => {
    if (this.state.imageURL) {
      URL.revokeObjectURL(this.state.imageURL);
      this.setState({...ImportImage.defaultState});
    }

    const files: FileList = (e.target as any).files;
    if (files.length) {
      const file = files[0];
      const [group, imageType] = file.type.split('/');
      if (group !== 'image') {
        return;
      }

      this.setState({
        mimeType: file.type,
        name: file.name,
        size: file.size,
        imageType,
        imageURL: URL.createObjectURL(files[0])
      });
    }
  };

  /**
   * ImportImage : DoImport Handler
   */
  handleDoImport = () => {
    this.props.onImport!(this.state.imageURL);
  };

  /**
   * Render ImportImage Component
   */
  render({}: ImportImageProps, {name, imageType, size, imageURL}: ImportImageState) {
    return (
      <ModalWindow>
        <ModalHeader title="Import Image"/>
        <ModalBody>
          <div class={style.importImageDialog}>
            {name && size && <div class={style.imageFileInfo}>
              {name} ({imageType.toUpperCase()} {formatBytes(size)})
            </div>}

            <div class={style.imagePreviewContent}>
              <img src={imageURL}/>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <input ref={this.handleFileLoader} type="file" id="input" onChange={this.handleChangeFile}/>
          {imageURL && size && <Button type="primary" onClick={this.handleDoImport}>Import</Button>}
        </ModalFooter>
      </ModalWindow>
    );
  }
}
