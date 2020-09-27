pg.compoundPath = function () {

  const isCompoundPath = function (item: any) {
    return item && item.className === 'CompoundPath';
  };

  const isCompoundPathChild = function (item: any) {
    if (item.parent) {
      return item.parent.className === 'CompoundPath';
    } else {
      return false;
    }
  };

  const getItemsCompoundPath = function (item: any) {
    const itemParent = item.parent;

    if (isCompoundPath(itemParent)) {
      return itemParent;
    } else {
      return null;
    }

  };

  const createFromSelection = function () {
    const items = pg.selection.getSelectedPaths();
    if (items.length < 2) {
      return;
    }

    let path = new paper.CompoundPath({fillRule: 'evenodd'});

    for (let i = 0; i < items.length; i++) {
      path.addChild(items[i]);
      items[i].selected = false;
    }

    path = pg.stylebar.applyActiveToolbarStyle(path);

    pg.selection.setItemSelection(path, true);
    pg.undo.snapshot('createCompoundPathFromSelection');
  };

  const releaseSelection = function () {
    const items = pg.selection.getSelectedItems();

    const cPathsToDelete = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (isCompoundPath(item)) {

        for (let j = 0; j < item.children.length; j++) {
          const path = item.children[j];
          path.parent = item.layer;
          pg.selection.setItemSelection(path, true);
          j--;
        }
        cPathsToDelete.push(item);
        pg.selection.setItemSelection(item, false);

      } else {
        items[i].parent = item.layer;
      }
    }

    for (let j = 0; j < cPathsToDelete.length; j++) {
      cPathsToDelete[j].remove();
    }
    pg.undo.snapshot('releaseCompoundPath');
  };

  return {
    isCompoundPath: isCompoundPath,
    isCompoundPathChild: isCompoundPathChild,
    getItemsCompoundPath: getItemsCompoundPath,
    createFromSelection: createFromSelection,
    releaseSelection: releaseSelection
  };
}();
