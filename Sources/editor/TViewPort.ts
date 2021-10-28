import {Vec2} from '@Framework/math/Vec2';

/**
 * View Port Class
 */
export class TViewPort {
  public position: Vec2 = new Vec2(0, 0);
  public zoom = 1;
  public zoomFactorPow2 = 1;
  public grid = 10;

  zoomInt = 0;

  isSnapToGrid = true;

  constructor() {
  }

  reset() {
    this.position.set(0, 0);
    this.resetZoom();
  }

  translate(x: number, y: number) {
    this.position.addf(x / this.zoom, y / this.zoom);
  }

  deltaZoom(delta: number, x: number, y: number) {
    const prevZoom = this.zoom;

    this.zoomInt += Math.round(delta);

    this.zoom = 1 + Math.abs(this.zoomInt);
    this.zoomFactorPow2 = Math.pow(2, Math.floor(Math.log2(this.zoom)));

    if (this.zoomInt === 0) {
      this.grid = 10;
    } else if (this.zoomInt < 0) { // zoom in
      this.zoom = 1 / this.zoom;
      this.grid = 10 * 2 * this.zoomFactorPow2;
    } else {  // zoom out
      this.grid = 10 / (this.zoomFactorPow2 / 2);
    }

//    console.log('zoom', this.zoom, 'zoomInt', this.zoomInt, 'zoomFactorPow2', this.zoomFactorPow2, 'grid', this.grid);

    const {zoom, position} = this;

    const deltaScale = zoom - prevZoom;
    const offsetX = -(x / prevZoom - position.x) * deltaScale;
    const offsetY = -(y / prevZoom - position.y) * deltaScale;

    position.x = (position.x * prevZoom + offsetX) / zoom;
    position.y = (position.y * prevZoom + offsetY) / zoom;
  }

  getZoom() {
    const zoom = 1 + Math.abs(this.zoomInt);
    return (this.zoomInt < 0) ? `1:${zoom}` : `${zoom}:1`;
  }

  resetZoom() {
    this.zoomInt = 0;
    this.zoom = 1;
    this.grid = 10;
    this.zoomFactorPow2 = 1;
  }

  getViewport(width: number, height: number) {
    const pos = this.position.clone().neg();
    const size = new Vec2(width / this.zoom, height / this.zoom);
    return [
      pos,
      pos.clone().add(size),
      size
    ];
  }

  snapToGrid(p: Vec2) {
    p.x = Math.round(p.x / this.grid) * this.grid;
    p.y = Math.round(p.y / this.grid) * this.grid;
    return this.isSnapToGrid;
  }
}
