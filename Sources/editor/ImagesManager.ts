/**
 * Image Data Interface
 */
export interface ImageDataInterface {
  url: string;
  image: HTMLImageElement;
  width: number;
  height: number;
  pattern?: CanvasPattern | null;
}

/**
 * @class ImagesManager
 */
export class ImagesManager {
  /**
   * Global Instance
   */
  private static globalInstance: ImagesManager;

  images: { [url: string]: ImageDataInterface } = {};

  /**
   * Get Global Instance
   * @returns {Plugins}
   */
  public static get instance() {
    return this.globalInstance = this.globalInstance || new this();
  }

  /**
   * ImagesManager Constructor
   */
  constructor() {

  }

  /**
   * Only Get Meta Data
   * @param url
   */
  getMeta(url: string): ImageDataInterface {
    return this.images[url] || null;
  }

  /**
   * Get Image Meta
   * @param url
   * @param callback
   */
  imageGetMeta(url: string, callback: (url: string, meta: ImageDataInterface) => any) {
    if (this.images[url]) {
      callback(url, this.images[url]);
      return;
    }

    const img = new Image();
    img.onload = (e: Event) => {
      const image = e.target as HTMLImageElement;
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;

      this.images[url] = {
        url,
        image,
        width,
        height
      };

      callback(url, this.images[url]);
    };
    img.src = url;
  }

  /**
   * Load Image
   * @param url
   * @param callback
   */
  loadImage(url: string, callback: (url: string, meta: ImageDataInterface) => any) {
    this.imageGetMeta(url, callback);
  }
}
