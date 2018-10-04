import {TViewPort} from './TViewPort';
import {TPoint} from './TPoint';
import {TVectorGraphics} from './TVectorGraphics';
import {TControllerList} from './TController';
import {TPath} from './TPath';
import {isPointInPoly} from '@core/math/isPointInPoly';

declare global {
  interface Layer {
    name?: string;
    shape: TVectorGraphics;
    controls: TControllerList;
  }

  interface Selected {
    sector: TPath;
    line: TLine;
    point: TPoint;

    reset(): void;
  }

  type TLayers = Layer[];
  type TLayerList = TLayers[];
}

export class T2DEditor {
  layout: TLayerList = [];
  layers: TLayers = null!;

  layer: Layer = null!;
  graphics: TVectorGraphics = null!;
  controls: TControllerList = null!;

  selected: Selected = {
    sector: null!,
    point: null!,
    line: null!,
    reset() {
      this.sector = null;
      this.point = null;
      this.line = null;
    }
  };

  view = new TViewPort();

  /**
   * T2DEditor Constructor
   */
  constructor() {
    this.selectLayout(0);
  }

  selectLayout(index: number) {
    if (!this.layout[index]) {
      this.layout[index] = [];
    }
    this.layers = this.layout[index];
    this.selectLayer(0);
    this.selected.reset();
    return this.layers;
  }

  selectLayer(index: number) {
    if (!this.layers[index]) {
      this.layers[index] = {
        shape: new TVectorGraphics(),
        controls: new TControllerList()
      };
    }
    this.layer = this.layers[index];

    this.graphics = this.layer.shape;
    this.controls = this.layer.controls;

    this.selected.reset();
    return this.layer;
  }

  removeLayout(index: number) {
    if (!this.layout[index]) {
      return;
    }
    this.layout.splice(index, 1);
    this.selectLayout(Math.max(0, index - 1));
  }

  removeLayer(index: number) {
    if (!this.layers[index]) {
      return;
    }
    this.layers[index].shape.clear();
    this.layers.splice(index, 1);
    this.selectLayer(Math.max(0, index - 1));
  }

  clearLayer() {
    this.selected.reset();
    this.layer.shape.clear();
  }

  select(in_x: number, in_y: number, t?: number) {
    const shapeItems = this.graphics.items;
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

  delete_selected() {
    const sel = this.selected;
    if (sel.line) {
      sel.sector.deletePoint(sel.line.A as TPoint);
      sel.sector.deletePoint(sel.line.B as TPoint);
    } else if (sel.point) {
      sel.sector.deletePoint(sel.point as TPoint);
    } else if (sel.sector) {
      const sec = this.graphics.items;
      const index = sec.indexOf(sel.sector);
      if (index < 0) {
        return;
      }
      sec.splice(index, 1);
    }

    this.selected.reset();
  }

  splitAt(in_x: number, in_y: number, tr?: number) {
    const x = in_x / this.view.zoom - this.view.position.x;
    const y = in_y / this.view.zoom - this.view.position.y;

    const sel = this.selected;
    if (sel.sector) {
      return sel.sector.splitAt(x, y, (tr || 5) / this.view.zoom);
    }
    return null;
  }

  doExport() {
    return JSON.stringify(this.doSave(), null, '\t');
  }

  doSave() {
    const layout: any[] = [];

    for (const lo in this.layout) {
      const layer_item = this.layout[lo];
      const layers = [];
      for (const key in layer_item) {
        const layer = layer_item[key];
        const shape = layer.shape.asText();

        if (!shape.length) {
          continue;
        }

        layers.push({
          shape
        });
      }
      layout[lo] = layers;
    }
    return layout;
  }

  doLoad(data: any) {
    this.selected.reset();
    this.layout = [];

    for (const lo in data) {
      this.layers = this.selectLayout(+lo);
      const layerData = data[+lo];

      for (const key in layerData) {
        const ld = layerData[+key];
        const shape = ld.shape;
        const layer = this.selectLayer(+key);

        for (const i in shape) {
          const it = shape[i];
          const path = it.path;
          const p = layer.shape.Path2D();
          for (const pt in path) {
            const point = path[+pt];

            const newpoint = new TPoint(point.x, point.y);
            p.path.push(newpoint);

            if (point.r) {
              newpoint.r = +point.r;
              newpoint.steps = +(point.s || 0);
            }
          }

          p.setProps({
            name: it.name || '',
            class: it.class || '',
            tags: it.tags || '',
            mask: it.mask || false
          });
        }
      }
    }

    this.selectLayout(0);
    this.selectLayer(0);
  }
}
