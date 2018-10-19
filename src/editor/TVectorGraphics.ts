import {TPath} from './TPath';
import {pathToText} from '@editor/transformToText';
import {Collection} from '@core/Collection';

export class TVectorGraphics extends Collection {
  items: TPath[] = [];

  /**
   * TVectorGraphics Constructor
   */
  constructor(parent?: Collection) {
    super('shape', parent);
  }

  clear() {
    this.items.length = 0;
  }

  clone() {
    const ret = new TVectorGraphics();
    ret.items.length = this.items.length;
    for (let i = this.items.length; --i >= 0;) {
      ret.items[i] = this.items[i].clone();
    }
    return ret;
  }

  Path2D(name?: string) {
    const ret = new TPath(name);
    this.items.push(ret);
    return ret;
  }

  asText() {
    const items = [];
    for (let i = 0; i < this.items.length; i++) {
      items.push(pathToText(this.items[i]));
    }
    return items;
  }
}
