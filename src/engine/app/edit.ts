pg.edit = function () {

  const copySelectionToClipboard = function () {
    pg.document.clearClipboard();
    const selectedItems = pg.selection.getSelectedItems();
    if (selectedItems.length > 0) {
      for (let i = 0; i < selectedItems.length; i++) {
        const jsonItem = selectedItems[i].exportJSON({asString: false});
        pg.document.pushClipboard(jsonItem);
      }
    }
  };

  const pasteObjectsFromClipboard = function () {
    pg.undo.snapshot('pasteObjectsFromClipboard');
    pg.selection.clearSelection();

    const clipboard = pg.document.getClipboard();
    if (clipboard && clipboard.length > 0) {
      for (let i = 0; i < clipboard.length; i++) {
        const item = paper.Base.importJSON(clipboard[i]);
        if (item) {
          item.selected = true;
        }
        const placedItem = pg.layer.getActiveLayer().addChild(item);
        placedItem.position.x += 20;
        placedItem.position.y += 20;
      }
      paper.project.view.update();
    }
  };

  return {
    copySelectionToClipboard: copySelectionToClipboard,
    pasteObjectsFromClipboard: pasteObjectsFromClipboard
  };

}();
