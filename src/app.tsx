import '@root/polyfills/math-polyfills';
import {h, render} from 'preact';
import PageEditor from './ui/pages/PageEditor';
import '@ui/preactHooks';
// @ts-ignore
import {createStore, Provider} from 'unistore/full/preact';
import defaultStorage from './store/defaultStorage';

render(<Provider store={defaultStorage}><PageEditor/></Provider>, document.querySelector('#app')!);
