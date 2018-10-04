import {T2DEditor} from '@editor/T2DEditor';

declare global {
  interface GLOBALValues {
    editor: T2DEditor;

    drawGrid: boolean;

    img_background: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap | null;

    canvasScale: number;

    setState: (state: GLOBALValues) => void;
  }
}

const GLOB: GLOBALValues = {
  editor: null!,

  drawGrid: true,

  img_background: null,

  canvasScale: 1,

  setState(state: GLOBALValues) {
    for (const i in state) {
      this[i] = (state as any)[i];
    }
  }
};

export default GLOB;
