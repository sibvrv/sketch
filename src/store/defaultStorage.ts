import createStore from 'unistore';
// @ts-ignore
import * as devtools from 'unistore/devtools';

declare global {
  interface DefaultStorage {
    status: string;
    zoom: string;
    error: string;
    dialog: string;
    selectedChange: number;
    shapeOptionsVisible: boolean;
  }
}

const defaultStates: DefaultStorage = {
  status: '',
  zoom: '1:1',
  error: '',
  dialog: '',
  selectedChange: 0,
  shapeOptionsVisible: true
};

/**
 * Default Storage
 */
const defaultStorage = devtools(createStore(defaultStates));
export default defaultStorage;
