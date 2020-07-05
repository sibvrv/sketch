import createStore from 'unistore';
import unistoreDevTools from 'unistore/devtools';
import {IMainMenuStore, mainMenuStore} from '@store/MainMenuStore';

declare global {
  interface DefaultStorage {
    status: string;
    zoom: string;
    error: string;
    dialog: string;
    selectedChange: number;
    shapeOptionsVisible: boolean;
    drawGrid: boolean;

    mainMenu: IMainMenuStore;
  }
}

const defaultStates: DefaultStorage = {
  status: '',
  zoom: '1:1',
  error: '',
  dialog: '',
  selectedChange: 0,
  shapeOptionsVisible: true,
  drawGrid: true,

  mainMenu: mainMenuStore()
};

/**
 * Default Storage
 */
const defaultStorage = __DEV__ ? unistoreDevTools(createStore(defaultStates)) : createStore(defaultStates);
export default defaultStorage;
