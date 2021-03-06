import '@root/polyfills';
import 'normalize.css';
import '@ui/style.less';
import {h, render} from 'preact';
import PageEditor from './ui/pages/PageEditor';
import '@ui/helpers/preactHooks';
// @ts-ignore
import {createStore, Provider} from 'unistore/full/preact';
import defaultStorage from './store/defaultStorage';

render(<Provider store={defaultStorage}><PageEditor/></Provider>, document.querySelector('#app')!);
