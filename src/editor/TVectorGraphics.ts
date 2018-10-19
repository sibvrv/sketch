import {TPath} from './TPath';
import {pathToText} from '@editor/transformToText';
import {Collection} from '@core/Collection';

export class TVectorGraphics extends Collection {
  /**
   * TVectorGraphics Constructor
   */
  constructor(parent?: Collection) {
    super('shape', parent);
  }

  Path2D(name?: string) {
    const ret = new TPath(this, name);
    this.push(ret);
    return ret;
  }

  asText() {
    const raw = this.rawItems;
    const items = [];
    for (let i = 0; i < raw.length; i++) {
      items.push(pathToText(raw[i] as TPath));
    }
    return items;
  }
}
