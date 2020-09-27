import './css/reset.less';
import './css/spectrum.less';
import './css/spectrum_override.less';
import './css/modal.less';
import './css/menu.less';
import './css/styles.less';
import './css/toolbar.less';
import './css/toolOptionPanel.less';
import './css/tools.less';

import './init';

import './app/settings';
import './app/document';
import './app/import';
import './app/export';
import './app/modal';
import './app/view';
import './app/item';
import './app/group';
import './app/layer';
import './app/selection';
import './app/toolOptionPanel';
import './app/hover';
import './app/order';
import './app/menu';
import './app/input';
import './app/guides';
import './app/boolean';
import './app/text';
import './app/tools';
import './app/toolbar';
import './app/stylebar';
import './app/statusbar';
import './app/layerPanel';
import './app/math';
import './app/edit';
import './app/compoundPath';
import './app/undo';
import './app/helper';
import './app/codeEditor';

import './geometry';

import './tools/select';
import './tools/detailselect';
import './tools/draw';
import './tools/bezier';
import './tools/cloud';
import './tools/broadbrush';
import './tools/text';
import './tools/eyedropper';
import './tools/circle';
import './tools/rectangle';
import './tools/rotate';
import './tools/scale';
import './tools/exportrect';
import './tools/zoom';
import './tools/viewgrab';
import './tools/viewzoom';

import {editorRender} from '@editor/render/EditorRender';
import GLOB from '@root/types';

pg.dev = function () {

  const loadStats = function () {
    jQuery.getScript('lib/stats.min')
      .done(function () {
        const stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '30px';

        document.body.appendChild(stats.domElement);

        setInterval(function () {

          stats.begin();

          // your code goes here

          stats.end();

        }, 1000 / 60);
      });

  };

  return {
    loadStats: loadStats
  };
}();

// setTimeout(() => {
//   pg.dev.loadStats();
// },1000)

jQuery.ajaxSetup({cache: false});

// set pg up on window load
jQuery(() => {
  pg.init();

  // fade out loading screen and reveal ui
  jQuery('#loadingScreen')
    .addClass('disabled')
    .on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function () {
      jQuery(this).remove();
    });

  paper.view.update = function () {
    if (!this._needsUpdate) {
      return false;
    }

    const project = this._project;
    const ctx = this._context;
    const size = this._viewSize;
    ctx.clearRect(0, 0, size.width + 1, size.height + 1);

    editorRender(ctx, GLOB.editor, size.width, size.height, {
      drawGrid: true
    });

    if (project) {
      project.draw(ctx, this._matrix, this._pixelRatio);
    }
    this._needsUpdate = false;
    return true;
  };
});
