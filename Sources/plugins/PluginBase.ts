/**
 * Plugin Base Class
 */
export abstract class PluginBase {
  loaded = false;
  name = '';

  /**
   * On Plugin Init
   */
  onInit() {

  }

  /**
   * On Plugin Run
   * @param options
   */
  onRun(options: any) {

  }
}
