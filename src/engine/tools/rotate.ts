// rotation tool

pg.tools.registerTool({
  id: 'rotate',
  name: 'Rotate',
  usedKeys: {
    toolbar: 'r'
  }
});

pg.tools.rotate = function () {
  let tool;
  const {Tool, Size} = paper;

  let options = {
    rotationCenter: 'selection',
    randomSpeed: false,
    lookAt: false
  };

  const components = {
    rotationCenter: {
      type: 'list',
      label: 'Center',
      options: ['individual', 'selection', 'cursor']
    },
    randomSpeed: {
      type: 'boolean',
      label: 'Random speed',
      requirements: {rotationCenter: 'individual'}
    },
    lookAt: {
      type: 'boolean',
      label: 'Lookat',
      requirements: {rotationCenter: 'individual'}
    }
  };

  const activateTool = function () {

    let selectedItems: any;
    let fixedGroupPivot: any;
    const pivotMarker: any[] = [];
    let rotGuideMarker: any;
    let rotGuideLine: any;
    const rand: any[] = [];
    let initAngles: any = [];
    let transformed = false;
    const prevRot: any[] = [];
    let mouseDown;

    // get options from local storage if present
    options = pg.tools.getLocalOptions(options);

    tool = new Tool();

    // on click, we first need the angle difference between where the user
    // clicked relative to the items/groups initial angle
    tool.onMouseDown = function (event: any) {
      transformed = false;
      selectedItems = pg.selection.getSelectedItems();
      mouseDown = event.point;

      if (selectedItems.length === 0) {
        return;
      }

      if (options.rotationCenter === 'individual') {
        for (let i = 0; i < selectedItems.length; i++) {
          const item = selectedItems[i];
          item.applyMatrix = false;
          pivotMarker.push(pg.guides.crossPivot(item.position));
          if (options.randomSpeed) {
            rand.push((Size.random().width));
          }
          initAngles[i] = item.rotation;
        }

        // paint rotation guide line
        rotGuideLine = pg.guides.line(event.downPoint, event.point);
        rotGuideMarker = pg.guides.rotPivot(event.downPoint, 'grey');

      } else {

        for (let i = 0; i < selectedItems.length; i++) {
          const item = selectedItems[i];
          item.applyMatrix = true;
        }

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

        if (options.rotationCenter === 'cursor') {
          fixedGroupPivot = event.point.clone();
        }

        for (let i = 0; i < selectedItems.length; i++) {
          const item = selectedItems[i];
          pg.item.setPivot(item, fixedGroupPivot.clone());
          prevRot[i] = (event.point.subtract(fixedGroupPivot)).angle;
        }

        // paint pivot guide
        pivotMarker[0] = pg.guides.rotPivot(fixedGroupPivot, 'grey');

        // paint rotation guide line
        rotGuideLine = pg.guides.line(fixedGroupPivot, event.point);
      }
    };

    tool.onMouseDrag = function (event: any) {
      if (selectedItems.length === 0) {
        return;
      }

      if (options.rotationCenter === 'individual') {

        let rotAngle = (event.point.subtract(event.downPoint)).angle;

        for (let i = 0; i < selectedItems.length; i++) {
          const item = selectedItems[i];
          item.applyMatrix = false;

          if ((event.point.subtract(event.downPoint)).length < 20) {
            // the initial drag angle is determined by the first 20 units
            // of drag (used for initial rotation fix)
            initAngles[i] = (event.point.subtract(event.downPoint)).angle - item.rotation;
          }
          // shift snaps the rotation in 45 degree steps
          if (event.modifiers.shift) {
            rotAngle = Math.round(rotAngle / 45) * 45;
            item.rotation = rotAngle;

          } else if (options.lookAt) {
            item.applyMatrix = false;
            const ang = (event.point.subtract(item.position)).angle;
            item.rotation = ang;

          } else {
            // rotations with random speed use item.rotate instead of
            // item.rotation for smoother handling and better vis. feedback
            if (options.randomSpeed) {
              const currentAngle = (event.point.subtract(event.downPoint)).angle;
              const lastAngle = (event.lastPoint.subtract(event.downPoint)).angle;
              let angleDiff = currentAngle - lastAngle;

              // nullify the rotation until the user dragged 20 units
              // prevents irratic behaviour since event.point and
              // event.downPoint start in the same location
              if ((event.point.subtract(event.downPoint)).length < 20) {
                angleDiff = 0;
              }

              const randomSpeed = angleDiff < 0 ? -rand[i] : rand[i];
              item.rotate(angleDiff + randomSpeed, item.position);

            } else {
              item.rotation = rotAngle - initAngles[i];
            }
          }
        }

      } else {
        let rotAngle = (event.point.subtract(fixedGroupPivot)).angle;

        for (let i = 0; i < selectedItems.length; i++) {
          const item = selectedItems[i];
          // shift snaps the rotation in 45 degree steps

          if (event.modifiers.shift) {
            rotAngle = Math.round(rotAngle / 45) * 45;
            item.applyMatrix = false;
            item.rotation = rotAngle;

          } else {
            item.rotate(rotAngle - prevRot[i]);

          }
          prevRot[i] = rotAngle;
        }
      }
      transformed = true;
      rotGuideLine.lastSegment.point = event.point;

    };

    tool.onMouseUp = function (event: any) {
      if (selectedItems.length === 0) {
        return;
      }

      // cleaning up!

      for (let i = 0; i < pivotMarker.length; i++) {
        pivotMarker[i].remove();
      }
      if (rotGuideLine) {
        rotGuideLine.remove();
      }
      if (rotGuideMarker) {
        rotGuideMarker.remove();
      }

      // resetting pivots to item centers
      for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];

        pg.item.setPivot(item, item.bounds.center);

      }

      initAngles = [];
      if (transformed) {
        pg.undo.snapshot('rotate');
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
