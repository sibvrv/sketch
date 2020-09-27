pg.document = function () {
  let center: any;
  let clipboard: any[] = [];

  const setup = function () {
    paper.view.center = new paper.Point(0, 0);
    center = paper.view.center;

    // call DocumentUpdate at a reduced rate (every tenth frame)
    let int = 10;
    paper.view.onFrame = function () {
      if (int > 0) {
        int--;
      } else {
        jQuery(document).trigger('DocumentUpdate');
        int = 10;
      }
    };

    window.onbeforeunload = (function (e) {
      if (pg.undo.getStates().length > 1) {
        return 'Unsaved changes will be lost. Leave anyway?';
      }
    });
  };

  const clear = function () {
    paper.project.clear();
    pg.undo.clear();
    setup();
    pg.layer.setup();
  };

  const getCenter = function () {
    return center;
  };

  const getClipboard = function () {
    return clipboard;
  };

  const pushClipboard = function (item) {
    clipboard.push(item);
    return true;
  };

  const clearClipboard = function () {
    clipboard = [];
    return true;
  };

  const getAllSelectableItems = function () {
    const allItems = pg.helper.getAllPaperItems();
    const selectables = [];
    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i].data && !allItems[i].data.isHelperItem) {
        selectables.push(allItems[i]);
      }
    }
    return selectables;
  };

  const loadJSONDocument = function (jsonString) {
    const activeLayerID = paper.project.activeLayer.data.id;
    paper.project.clear();
    pg.toolbar.setDefaultTool();
    pg.export.setExportRect();

    paper.project.importJSON(jsonString);

    pg.layer.reinitLayers(activeLayerID);

    const exportRect = pg.guides.getExportRectGuide();
    if (exportRect) {
      pg.export.setExportRect(new paper.Rectangle(exportRect.data.exportRectBounds));
    }
    pg.undo.snapshot('loadJSONDocument');
  };

  const saveJSONDocument = function () {
    const fileName = prompt('Name your file', 'export.json');

    if (fileName !== null) {
      pg.hover.clearHoveredItem();
      pg.selection.clearSelection();
      paper.view.update();

      const fileNameNoExtension = fileName.split('.json')[0];
      const exportData = paper.project.exportJSON({asString: true});
      const blob = new Blob([exportData], {type: 'text/json'});
      saveAs(blob, fileNameNoExtension + '.json');
    }
  };

  return {
    getCenter: getCenter,
    setup: setup,
    clear: clear,
    getClipboard: getClipboard,
    pushClipboard: pushClipboard,
    clearClipboard: clearClipboard,
    getAllSelectableItems: getAllSelectableItems,
    loadJSONDocument: loadJSONDocument,
    saveJSONDocument: saveJSONDocument
  };

}();
