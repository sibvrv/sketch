pg.order = function () {

  const bringSelectionToFront = function () {
    pg.undo.snapshot('bringSelectionToFront');
    const items = pg.selection.getSelectedItems();
    for (let i = 0; i < items.length; i++) {
      items[i].bringToFront();
    }
  };

  const sendSelectionToBack = function () {
    pg.undo.snapshot('sendSelectionToBack');
    const items = pg.selection.getSelectedItems();
    for (let i = 0; i < items.length; i++) {
      items[i].sendToBack();
    }
  };

  return {
    bringSelectionToFront: bringSelectionToFront,
    sendSelectionToBack: sendSelectionToBack
  };

}();
