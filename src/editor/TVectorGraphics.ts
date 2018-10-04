import {TPath} from './TPath';
import {pathToText} from '@editor/transformToText';

export class TVectorGraphics {
  items: TPath[] = [];

  clear() {
    this.items.length = 0;
  }

  clone() {
    const ret = new TVectorGraphics();
    ret.items = new Array(this.items.length);
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
