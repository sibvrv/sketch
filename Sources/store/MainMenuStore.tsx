import {IMenuItem} from '@ui/components/MainMenu/MainMenu';
import {h} from 'preact';

/**
 * Main Menu Store
 */
export interface IMainMenuStore {
  items: IMenuItem[];
}

export const mainMenuStore = (): IMainMenuStore => ({
  items: [
    {
      title: <span class="fa fa-bars burgerButton"/>,
      items: [
        {
          title: 'New',
        },
        {
          title: 'Clear Layer',
        },
        {
          title: 'Open',
        },
        {
          title: 'Save',
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Undo', class: 'halfWidth',
        },
        {
          title: 'Redo', class: 'halfWidth',
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Import',
          items: [
            {
              title: <span>Image<input id="fileUploadImage" class="fileUploadInput" type="file"
                                       accept=".gif, .jpg, .jpeg, .png"/></span>,
            },
            {
              title: <span>SVG<input id="fileUploadSVG" class="fileUploadInput" type="file" accept=".svg"/></span>,
            },
            {
              title: 'SVG from URL',
            },
          ],
        },
        {
          title: 'Export',
          items: [
            {
              title: 'Image',
            },
            {
              title: 'SVG',
            },
          ],
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Layers',
        },
        {
          title: 'Script Editor',
        },
        {
          title: '', class: 'space',
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Reset settings',
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'About',
        },
      ],
    },
    {
      title: 'Tool',
      items: [
        {
          title: 'Edit',
          items: [
            {
              title: 'Copy',
            },
            {
              title: 'Paste',
            },
            {
              title: 'Delete',
            },
          ],
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Select',
          items: [
            {
              title: 'Select all',
            },
            {
              title: 'Deselect all',
            },
            {
              title: 'Invert selection',
            },
            {
              title: 'Random items',
            },
          ],
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Group',
          items: [
            {
              title: 'Group',
            },
            {
              title: 'Ungroup',
            },
          ],
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Layer',
          items: [
            {
              title: 'Move to active Layer',
            },
          ],
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Order',
          items: [
            {
              title: 'Bring to front',
            },
            {
              title: 'Send to back',
            },
          ],
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Compound path',
          items: [
            {
              title: 'Create compound path',
            },
            {
              title: 'Release compound path',
            },
          ],
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Boolean operations',
          items: [
            {
              title: 'Unite',
            },
            {
              title: 'Intersect',
            },
            {
              title: 'Subtract',
            },
            {
              title: 'Exclude',
            },
            {
              title: 'Divide',
            },
          ],
        },
        {
          title: '', class: 'space',
        },
        {
          title: 'Text',
          items: [
            {
              title: 'Text to outlines',
            },
          ],
        },
      ],
    },
    {
      title: 'View',
      items: [
        {
          title: 'Zoom in',
        },
        {
          title: 'Zoom out',
        },
        {
          title: 'Reset zoom',
        },
        {
          title: 'Reset pan',
        },
        {
          title: '', class: 'space',
        },
        {
          id: 'view.grid.toggle',
          title: 'Toggle Grid',
        },
      ],
    },
  ],
});
