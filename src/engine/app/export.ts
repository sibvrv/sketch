// functions related to exporting

pg.export = function () {
  let exportRect;
  let canvas;

  const setup = function () {
    canvas = document.getElementById('paperCanvas');
  };

  const setExportRect = function (rect) {
    exportRect = rect;
  };

  const getExportRect = function () {
    return exportRect;
  };

  const clearExportRect = function () {
    exportRect = null;
  };

  const exportAndPromptImage = function () {
    const fileName = prompt('Name your file', 'export');

    if (fileName !== null) {
      pg.hover.clearHoveredItem();
      pg.selection.clearSelection();
      const activeLayer = pg.layer.getActiveLayer();

      // backup guide layer, then remove it (with all children) before export
      const guideLayer = pg.layer.getGuideLayer();
      const guideLayerBackup = guideLayer.exportJSON();
      guideLayer.remove();
      paper.view.update();

      if (exportRect) {
        pg.view.resetZoom();
        pg.view.resetPan();
        paper.view.update();
        const offsetX = parseInt(canvas.width * 0.5) + exportRect.x;
        const offsetY = parseInt(canvas.height * 0.5) + exportRect.y;

        const fileNameNoExtension = fileName.split('.png')[0];
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(offsetX, offsetY, exportRect.width, exportRect.height);

        const $tempCanvas = jQuery('<canvas width="' + exportRect.width + '" height="' + exportRect.height + '" style="position: absolute; z-index: -5;">');

        jQuery('body').append($tempCanvas);

        const context = $tempCanvas[0].getContext('2d');
        context.putImageData(imgData, 0, 0);
        $tempCanvas[0].toBlob(function (blob) {
          saveAs(blob, fileNameNoExtension + '.png');

          // restore guide layer (with all items) after export
          paper.project.importJSON(guideLayerBackup);

          // then reactivate the active layer
          activeLayer.activate();
        });

        $tempCanvas.remove();

      } else {
        const fileNameNoExtension = fileName.split('.png')[0];
        canvas.toBlob(function (blob) {
          saveAs(blob, fileNameNoExtension + '.png');

          // restore guide layer (with all items) after export
          paper.project.importJSON(guideLayerBackup);

          // then reactivate the active layer
          activeLayer.activate();
        });
      }

    }
  };

  const exportAndPromptSVG = function () {
    const fileName = prompt('Name your file', 'export');

    if (fileName !== null) {
      pg.hover.clearHoveredItem();
      pg.selection.clearSelection();

      const activeLayer = pg.layer.getActiveLayer();

      const fileNameNoExtension = fileName.split('.svg')[0];

      // backup guide layer, then remove it (with all children) before export
      const guideLayer = pg.layer.getGuideLayer();
      const guideLayerBackup = guideLayer.exportJSON();
      guideLayer.remove();
      paper.view.update();

      // export data, create blob  and save as file on users device
      const exportData = paper.project.exportSVG({asString: true, bounds: exportRect});
      const blob = new Blob([exportData], {type: 'image/svg+xml;charset=' + document.characterSet});
      saveAs(blob, fileNameNoExtension + '.svg');

      // restore guide layer (with all items) after export
      paper.project.importJSON(guideLayerBackup);

      // then reactivate the active layer
      activeLayer.activate();
    }
  };

  return {
    setup: setup,
    getExportRect: getExportRect,
    setExportRect: setExportRect,
    clearExportRect: clearExportRect,
    exportAndPromptImage: exportAndPromptImage,
    exportAndPromptSVG: exportAndPromptSVG
  };

}();
