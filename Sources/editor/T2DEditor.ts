import {TViewPort} from './TViewPort';
import {TControllerList} from './TController';
import {isPointInPoly} from '@Framework/math/isPointInPoly';
import {Collection} from '@Framework/Collection';
import {pathToText} from '@editor/transformToText';
import {ImagesManager} from '@editor/ImagesManager';
import {TLine, TPath} from '@editor/Shapes/TPath';
import {TPoint} from '@editor/Shapes/TPoint';

declare global {
  interface Layer {
    name?: string;
    controls: TControllerList;
  }

  interface Selected {
    sector: TPath;
    line: TLine;
    point: TPoint;

    reset(): void;

    resetInner(): void;

    selectPoint(point: TPoint): void;
  }
}

class CollectionLayer extends Collection {
  name: string;
  controls = new TControllerList();

  /**
   * CollectionLayer Constructor
   */
  constructor(parent: Collection) {
    super('layer', parent);
    this.define('name');
  }

  /**
   * Create New Path
   * @param name
   * @constructor
   */
  Path2D(name?: string) {
    const ret = new TPath(this, name);
    this.push(ret);
    return ret;
  }

  /**
   * Create New Image
   * @param name
   * @param src
   * @constructor
   */
  Image(name: string, src: string) {
    const image = new TPath(this, name);
    image.type = 'image';
    image.props({src});
    ImagesManager.instance.imageGetMeta(src, (url, meta) => {
      image.Rect(0, 0, meta.width, meta.height);
    });
    this.push(image);
    return image;
  }

  /**
   * Convert To Text
   */
  asText() {
    const raw = this.rawItems;
    const items = [];
    for (let i = 0; i < raw.length; i++) {
      items.push(pathToText(raw[i] as TPath));
    }
    return items;
  }
}

export class T2DEditor {
  layers = new Collection('document');

  layer: CollectionLayer = null!;
  controls: TControllerList = null!;

  selected: Selected = {
    sector: null!,
    point: null!,
    line: null!,
    reset() {
      this.sector = null;
      this.point = null;
      this.line = null;
    },
    resetInner() {
      this.point = null;
      this.line = null;
    },
    selectPoint(point: TPoint) {
      this.line = null;
      this.point = point;
    }
  };

  view = new TViewPort();

  /**
   * T2DEditor Constructor
   */
  constructor() {
    this.selectLayer(0);
    this.selected.reset();
  }

  /**
   * Select Layer
   * @param {number} index
   * @returns {Layer}
   */
  selectLayer(index: number) {
    if (!this.layers.get(index)) {
      this.layers.set(index, new CollectionLayer(this.layers));
    }
    this.layer = this.layers.get(index) as CollectionLayer;
    this.controls = this.layer.controls;

    this.selected.reset();
    return this.layer;
  }

  /**
   * Remove Layer
   * @param {number} index
   */
  removeLayer(index: number) {
    const item = this.layers.get(index) as CollectionLayer;
    if (!item) {
      return;
    }
    item.clean();
    this.layers.remove(index);
    this.selectLayer(Math.max(0, index - 1));
  }

  /**
   * Clear Layer
   */
  clearLayer() {
    this.selected.reset();
    this.layer.clean();
  }

  /**
   * Select Path, Point, Line and etc...
   * @param {number} in_x
   * @param {number} in_y
   * @param {number} t
   */
  select(in_x: number, in_y: number, t?: number) {
    const shapeItems: TPath[] = this.layer.rawItems as any;
    t = t || 5;

    let sel = this.selected;

    const x = in_x / this.view.zoom - this.view.position.x;
    const y = in_y / this.view.zoom - this.view.position.y;
    t = t / this.view.zoom;

    if (sel.sector) {
      sel.point = null!;
      sel.line = null!;

      const p = sel.sector.getPointAt(x, y, t);
      if (p) {
        sel.point = p;
        return;
      }

      const line = sel.sector.getLineAt(x, y, t);
      if (line) {
        sel.line = line;
        return;
      }

      if (isPointInPoly(x, y, sel.sector.path)) {
        return;
      }
    }

    this.selected.reset();
    sel = this.selected;

    for (let i = shapeItems.length; --i >= 0;) {
      const shape = shapeItems[i];

      if (shape.path.length <= 2) {

        const point = shape.getPointAt(x, y, t);
        if (point) {
          sel.sector = shape;
          sel.point = point;
          break;
        }

        const line = shape.getLineAt(x, y, t);
        if (line) {
          sel.sector = shape;
          sel.line = line;
          break;
        }

        continue;
      }

      if (isPointInPoly(x, y, shape.path)) {
        sel.sector = shape;
        break;
      }
    }
  }

  /**
   * Delete Selected
   */
  public deleteSelected() {
    const sel = this.selected;
    if (sel.line) {
      sel.sector.deletePoint(sel.line.A as TPoint);
      sel.sector.deletePoint(sel.line.B as TPoint);
      this.selected.resetInner();
    } else if (sel.point) {
      sel.sector.deletePoint(sel.point as TPoint);
      this.selected.resetInner();
    } else if (sel.sector) {
      const sec = this.layer.rawItems;
      const index = sec.indexOf(sel.sector);
      if (index < 0) {
        return;
      }
      sec.splice(index, 1);
      this.selected.reset();
    }
  }

  /**
   * Split Line At
   * @param {number} in_x
   * @param {number} in_y
   * @param {number} tr
   * @returns {any}
   */
  public splitAt(in_x: number, in_y: number, tr?: number) {
    const x = in_x / this.view.zoom - this.view.position.x;
    const y = in_y / this.view.zoom - this.view.position.y;

    const sel = this.selected;
    if (sel.sector) {
      return sel.sector.splitAt(x, y, (tr || 5) / this.view.zoom);
    }
    return null;
  }

  /**
   * Convert To Object
   * @returns {any[]}
   */
  doSave() {
    const layers: any[] = [];

    this.layers.each((layer: CollectionLayer) => {
      const shape = layer.asText();

      if (!shape.length) {
        return;
      }

      layers.push({
        name: layer.name,
        shape
      });
    });

    return layers;
  }

  /**
   * Load From Object
   * @param data
   */
  doLoad(data: any) {
    this.selected.reset();
    this.layers.clean();

    for (const key in data) {
      const ld = data[+key];
      const shape = ld.shape;
      const layer = this.selectLayer(+key);
      layer.name = ld.name || '';

      for (const i in shape) {
        const it = shape[i];
        const path = it.path;
        const p = layer.Path2D();
        for (const pt in path) {
          const point = path[+pt];

          const newpoint = new TPoint(point.x, point.y);
          p.path.push(newpoint);

          if (point.r) {
            newpoint.r = +point.r;
            newpoint.steps = +(point.s || 0);
          }
        }

        p.props({
          name: it.name || '',
          class: it.class || '',
          tags: it.tags || '',
          mask: it.mask || false
        });
      }
    }

    this.selectLayer(0);
  }
}
