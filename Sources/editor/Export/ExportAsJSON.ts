import {T2DEditor} from '@editor/T2DEditor';

/**
 * Export collection as JSON string
 * @param editor
 */
export const exportAsJSON = (editor: T2DEditor) => JSON.stringify(editor.doSave(), null, 2);
