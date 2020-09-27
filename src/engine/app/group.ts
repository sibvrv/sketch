// function related to groups and grouping

pg.group = function () {

  const groupSelection = function () {
    const items = pg.selection.getSelectedItems();
    if (items.length > 0) {
      const group = new paper.Group(items);
      pg.selection.clearSelection();
      pg.selection.setItemSelection(group, true);
      pg.undo.snapshot('groupSelection');
      jQuery(document).trigger('Grouped');
      return group;
    } else {
      return false;
    }
  };

  const ungroupSelection = function () {
    const items = pg.selection.getSelectedItems();
    ungroupItems(items);
    pg.statusbar.update();
  };

  const groupItems = function (items) {
    if (items.length > 0) {
      const group = new paper.Group(items);
      jQuery(document).trigger('Grouped');
      pg.undo.snapshot('groupItems');
      return group;
    } else {
      return false;
    }
  };

  // ungroup items (only top hierarchy)
  const ungroupItems = function (items) {
    const emptyGroups = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (isGroup(item) && !item.data.isPGTextItem) {
        ungroupLoop(item, false);

        if (!item.hasChildren()) {
          emptyGroups.push(item);
        }
      }
    }

    // remove all empty groups after ungrouping
    for (let j = 0; j < emptyGroups.length; j++) {
      emptyGroups[j].remove();
    }
    jQuery(document).trigger('Ungrouped');
    pg.undo.snapshot('ungroupItems');
  };

  const ungroupLoop = function (group, recursive) {
    // don't ungroup items that are no groups
    if (!group || !group.children || !isGroup(group)) {
      return;
    }

    group.applyMatrix = true;
    // iterate over group children recursively
    for (let i = 0; i < group.children.length; i++) {
      const groupChild = group.children[i];
      if (groupChild.hasChildren()) {

        // recursion (groups can contain groups, ie. from SVG import)
        if (recursive) {
          ungroupLoop(groupChild, true);
        } else {
          groupChild.applyMatrix = true;
          group.layer.addChild(groupChild);
          i--;
        }

      } else {
        groupChild.applyMatrix = true;
        // move items from the group to the activeLayer (ungrouping)
        group.layer.addChild(groupChild);
        i--;
      }
    }
  };

  const getItemsGroup = function (item) {
    const itemParent = item.parent;

    if (isGroup(itemParent)) {
      return itemParent;
    } else {
      return null;
    }
  };

  const isGroup = function (item) {
    return pg.item.isGroupItem(item);
  };

  const isGroupChild = function (item) {
    const rootItem = pg.item.getRootItem(item);
    return isGroup(rootItem);
  };

  return {
    groupSelection: groupSelection,
    ungroupSelection: ungroupSelection,
    groupItems: groupItems,
    ungroupItems: ungroupItems,
    getItemsGroup: getItemsGroup,
    isGroup: isGroup,
    isGroupChild: isGroupChild
  };

}();
