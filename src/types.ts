import {T2DEditor} from '@editor/T2DEditor';

declare global {
  interface GLOBALValues {
    editor: T2DEditor;

    img_background: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap | null;

    setState: (state: GLOBALValues) => void;
  }
}

const GLOB: GLOBALValues = {
  editor: null!,

  img_background: null,

  setState(state: GLOBALValues) {
    for (const i in state) {
      this[i] = (state as any)[i];
    }
  }
};

export default GLOB;
