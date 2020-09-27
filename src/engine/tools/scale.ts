// scale tool

pg.tools.registerTool({
  id: 'scale',
  name: 'Scale',
  usedKeys: {
    toolbar: 's'
  }
});

pg.tools.scale = function () {
  let tool;

  const {Tool} = paper;

  let options = {
    scaleCenter: 'selection',
    randomScale: false
  };

  const components = {
    scaleCenter: {
      type: 'list',
      label: 'Scale center',
      options: ['individual', 'selection', 'cursor']
    },
    randomScale: {
      type: 'boolean',
      label: 'Random scale',
      requirements: {scaleCenter: 'individual'}
    }
  };

  const activateTool = function () {

    let selectedItems: any;
    let fixedGroupPivot: any;
    const pivotMarker: any[] = [];
    let randomSizes: any[] = [];
    let transformed = false;
    let mouseDown;

    // get options from local storage if present
    options = pg.tools.getLocalOptions(options);

    tool = new Tool();

    tool.onMouseDown = function (event: any) {
      transformed = false;
      mouseDown = event.point;

      selectedItems = pg.selection.getSelectedItems();
      if (selectedItems.length === 0) {
        return;
      }

      if (options.scaleCenter === 'individual') {
        for (let i = 0; i < selectedItems.length; i++) {
          pivotMarker.push(pg.guides.crossPivot(selectedItems[i].position));
        }
        if (options.randomScale) {
          randomSizes = [];
          for (let i = 0; i < selectedItems.length; i++) {
            randomSizes.push(Math.random() * 0.005);
          }
        }

      } else {
        // only set the fixedPivot once per tool activation/mode switch
        // or the center point moves based on the selection bounds
        if (!fixedGroupPivot) {
          let bounds: any = null;
          for (let i = 0; i < selectedItems.length; i++) {
            const item = selectedItems[i];
            if (i === 0) {
              bounds = item.bounds;
            } else {
              bounds = bounds.unite(item.bounds);
            }
          }
          fixedGroupPivot = bounds.center;
        }

        if (options.scaleCenter === 'cursor') {
          fixedGroupPivot = event.point;
        }

        // paint pivot guide
        pivotMarker[0] = pg.guides.crossPivot(fixedGroupPivot);

      }
    };

    tool.onMouseDrag = function (event: any) {
      if (selectedItems.length === 0) {
        return;
      }
      const amount = event.delta.normalize(0.01);
      amount.x += 1;
      amount.y += 1;

      if (!event.modifiers.shift) {
        amount.set(amount.x * amount.y);
      }

      if (options.scaleCenter === 'individual') {

        for (let i = 0; i < selectedItems.length; i++) {
          if (options.randomScale) {
            selectedItems[i].scale(amount + randomSizes[i], selectedItems[i].position);

          } else {
            selectedItems[i].scale(amount, selectedItems[i].position);

          }
          if (selectedItems[i].data.isPGTextItem) {
            selectedItems[i].data.wasScaled = true;
          }
        }

      } else {
        for (let i = 0; i < selectedItems.length; i++) {
          selectedItems[i].scale(amount, fixedGroupPivot);
          if (selectedItems[i].data.isPGTextItem) {
            selectedItems[i].data.wasScaled = true;
          }
        }
      }

      transformed = true;
    };

    tool.onMouseUp = function (event: any) {
      if (selectedItems.length === 0) {
        return;
      }

      for (let i = 0; i < pivotMarker.length; i++) {
        pivotMarker[i].remove();
      }

      if (transformed) {
        pg.undo.snapshot('scale');
        transformed = false;
      }
    };

    // setup floating tool options panel in the editor
    pg.toolOptionPanel.setup(options, components, function () {
      fixedGroupPivot = null;
    });

    tool.activate();
  };

  return {
    options: options,
    activateTool: activateTool
  };
};
