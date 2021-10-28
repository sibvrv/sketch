import {PluginBase} from '@plugins/PluginBase';

/* Plugin API */

declare global {
  interface PluginsList {
    [key: string]: PluginBase;
  }
}

export class Plugins {
  /**
   * Global Instance
   */
  private static globalInstance: Plugins;

  /**
   * Plugins List
   * @type {{}}
   */
  plugins: PluginsList = {};

  /**
   * Get Global Instance
   * @returns {Plugins}
   */
  public static get instance() {
    return this.globalInstance = this.globalInstance || new this();
  }

  /**
   * Register Plugin
   * @param {PluginBase} plugin
   */
  register(plugin: PluginBase) {
    this.plugins[plugin.name] = plugin;
    plugin.loaded = false;
  }

  /**
   * Init Plugins
   */
  init() {
    for (const i in this.plugins) {
      const it = this.plugins[i];
      if (it.onInit) {
        it.onInit();
      }
    }
  }

  /**
   * Run Plugin
   * @param {string} name
   * @param options
   */
  run(name: string, options: any) {
    const it = this.plugins[name];
    if (it.onRun) {
      it.onRun(options);
    }
  }
}
