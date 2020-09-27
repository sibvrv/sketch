// bezier tool
// adapted from the paperjs examples (Tools/BezierTool.html)

pg.tools.registerTool({
  id: 'bezier',
  name: 'Bezier',
  usedKeys: {
    toolbar: 'p'
  }
});

pg.tools.bezier = function () {
  let tool;

  const options = {};

  const activateTool = function () {
    const {Tool, Path} = paper;

    tool = new Tool();

    let path: any;

    let currentSegment: any;
    let mode: any;
    let type: any;
    let hoveredItem: any = null;

    const hitOptions = {
      segments: true,
      stroke: true,
      curves: true,
      guide: false,
      tolerance: 5 / paper.view.zoom
    };

    tool.onMouseDown = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      if (currentSegment) {
        currentSegment.selected = false;
      }
      mode = type = currentSegment = null;

      if (!path) {
        if (!hoveredItem) {
          pg.selection.clearSelection();
          path = new Path();
          path = pg.stylebar.applyActiveToolbarStyle(path);

        } else {
          if (!hoveredItem.item.closed) {
            mode = 'continue';
            path = hoveredItem.item;
            currentSegment = hoveredItem.segment;
            if (hoveredItem.item.lastSegment !== hoveredItem.segment) {
              path.reverse();
            }

          } else {
            path = hoveredItem.item;
          }
        }

      }

      if (path) {
        const result = findHandle(path, event.point);
        if (result && mode !== 'continue') {
          currentSegment = result.segment;
          type = result.type;
          if (result.type === 'point') {
            if (result.segment.index === 0 &&
              path.segments.length > 1 &&
              !path.closed) {
              mode = 'close';
              path.closed = true;
              path.firstSegment.selected = true;

            } else {
              mode = 'remove';
              result.segment.remove();

            }
          }
        }

        if (!currentSegment) {
          if (hoveredItem) {
            if (hoveredItem.type === 'segment' &&
              !hoveredItem.item.closed) {

              // joining two paths
              const hoverPath = hoveredItem.item;
              // check if the connection point is the first segment
              // reverse path if it is not because join()
              // always connects to first segment)
              if (hoverPath.firstSegment !== hoveredItem.segment) {
                hoverPath.reverse();
              }
              path.join(hoverPath);
              path = null;

            } else if (hoveredItem.type === 'curve' ||
              hoveredItem.type === 'stroke') {

              mode = 'add';
              // inserting segment on curve/stroke
              const location = hoveredItem.location;
              currentSegment = path.insert(location.index + 1, event.point);
              currentSegment.selected = true;
            }

          } else {
            mode = 'add';
            // add a new segment to the path
            currentSegment = path.add(event.point);
            currentSegment.selected = true;

          }
        }

      }
    };

    tool.onMouseMove = function (event: any) {
      const hitResult = paper.project.hitTest(event.point, hitOptions);
      if (hitResult && hitResult.item && hitResult.item.selected) {
        hoveredItem = hitResult;

      } else {
        hoveredItem = null;
      }
    };

    tool.onMouseDrag = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      let delta = event.delta.clone();
      if (type === 'handleOut' || mode === 'add') {
        delta = delta.negate();
      }
      currentSegment.handleIn = currentSegment.handleIn.add(delta);
      currentSegment.handleOut = currentSegment.handleOut.subtract(delta);
    };

    tool.onMouseUp = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      if (path && path.closed) {
        pg.undo.snapshot('bezier');
        path = null;
      }

    };

    tool.activate();
  };

  const findHandle = function (path: any, point: any) {
    const types = ['point', 'handleIn', 'handleOut'];
    for (let i = 0, l = path.segments.length; i < l; i++) {
      for (let j = 0; j < 3; j++) {
        const type = types[j];
        const segment = path.segments[i];
        const segmentPoint = type === 'point'
          ? segment.point
          : segment.point.add(segment[type]);
        const distance = point.subtract(segmentPoint).length;
        if (distance < 6) {
          return {
            type: type,
            segment: segment
          };
        }
      }
    }
    return null;
  };

  return {
    options: options,
    activateTool: activateTool
  };

};
