import * as preact from 'preact';
import {cssMerge} from '../../Framework/css/cssMerge';

/**
 * VNode hook
 */
preact.options.vnode = function (node: preact.VNode) {
  if (typeof node.nodeName === 'string' && node.attributes) {
    /**
     * CSS inline-style: Convert object or array to string
     */
    if ('class' in node.attributes) {
      if (Array.isArray(node.attributes.class) || typeof node.attributes.class === 'object') {
        node.attributes.class = cssMerge(node.attributes.class);
      }

      if (!node.attributes.class) {
        delete node.attributes.class;
      }
    }
  }
  return node;
};
