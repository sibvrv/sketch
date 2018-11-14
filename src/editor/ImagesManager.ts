/**
 * @class ImagesManager
 */
export class ImagesManager {
  /**
   * Global Instance
   */
  private static globalInstance: ImagesManager;

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
}
