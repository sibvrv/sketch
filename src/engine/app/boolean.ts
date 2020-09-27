pg.boolean = function () {
  const booleanUnite = function (items: any, replaceWithResult?: any) {
    items = items || pg.selection.getSelectedItems();
    replaceWithResult = replaceWithResult || true;

    let result;
    for (let i = 0; i < items.length; i++) {
      if (i === 0) {
        result = items[0];
      }
      const temp: any = items[i].unite(result, {insert: false});
      result.remove();
      result = temp;
      items[i].remove();
    }

    if (replaceWithResult) {
      applyReplaceWithResult(items, result);
    }

    return result;
  };

  const booleanIntersect = function (items: any, replaceWithResult?: any) {
    items = items || pg.selection.getSelectedItems();
    replaceWithResult = replaceWithResult || true;

    let main;
    let result;
    for (let i = 0; i < items.length; i++) {
      if (i === 0) {
        main = items[0];
      } else {
        result = items[i].intersect(main, {insert: false});
        if (i + 1 < items.length) {
          main = result;
        }
      }
      main.remove();
      items[i].remove();
    }

    if (replaceWithResult) {
      applyReplaceWithResult(items, result);
    }
    return result;
  };

  const booleanSubtract = function (items: any, replaceWithResult?: any) {
    items = items || pg.selection.getSelectedItems();
    replaceWithResult = replaceWithResult || true;

    const main = items[0];
    const rem = [];
    for (let i = 0; i < items.length; i++) {
      if (i > 0) {
        rem.push(items[i]);
      }
    }
    const over = booleanUnite(rem);

    const result = main.subtract(over, {insert: false});
    over.remove();
    main.remove();

    if (replaceWithResult) {
      applyReplaceWithResult(items, result);
    }

    return result;
  };

  const booleanExclude = function (items: any, replaceWithResult?: any) {
    items = items || pg.selection.getSelectedItems();
    replaceWithResult = replaceWithResult || true;

    let main = items[0];
    let result;
    for (let i = 0; i < items.length; i++) {
      if (i > 0) {
        result = items[i].exclude(main, {insert: false});
        if (i + 1 < items.length) {
          main = result;
        }
      }
      main.remove();
      items[i].remove();
    }

    if (replaceWithResult) {
      applyReplaceWithResult(items, result);
    }

    return result;
  };

  const booleanDivide = function (items: any, replaceWithResult?: any) {
    items = items || pg.selection.getSelectedItems();
    replaceWithResult = replaceWithResult || true;

    const union = booleanUnite(items);
    const exclusion = booleanExclude(items);
    const subtraction = booleanSubtract([union, exclusion.clone()]);

    const group = new paper.Group();

    if (exclusion.children) {
      for (let i = 0; i < exclusion.children.length; i++) {
        const child = exclusion.children[i];
        child.strokeColor = 'black';
        group.addChild(child);
        i--;
      }
    }
    subtraction.strokeColor = 'black';
    group.addChild(subtraction);

    if (replaceWithResult) {
      applyReplaceWithResult(items, group);
    }

    return group;
  };

  const applyReplaceWithResult = function (items: any, group: any) {
    jQuery.each(items, function (index: any, item: any) {
      item.remove();
    });
    pg.layer.getActiveLayer().addChild(group);

    pg.undo.snapshot('booleanOperation');
  };

  return {
    booleanUnite: booleanUnite,
    booleanIntersect: booleanIntersect,
    booleanSubtract: booleanSubtract,
    booleanExclude: booleanExclude,
    booleanDivide: booleanDivide
  };
}();
