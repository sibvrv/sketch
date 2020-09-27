// cloud tool
// adapted from the paperjs examples (Tools/Cloud.html)

pg.tools.registerTool({
  id: 'cloud',
  name: 'Cloud'
});

pg.tools.cloud = function () {
  let tool: any;

  let options = {
    pointDistance: 30,
    randomizeDistance: false,
    randomDistMin: 15,
    randomDistMax: 40,
    closePath: 'near start'
  };

  const components = {
    pointDistance: {
      type: 'int',
      label: 'Point distance',
      requirements: {randomizeDistance: false},
      min: 1
    },
    randomizeDistance: {
      type: 'boolean',
      label: 'Randomize'
    },
    randomDistMin: {
      type: 'float',
      label: 'Random min',
      requirements: {randomizeDistance: true},
      min: 0
    },
    randomDistMax: {
      type: 'float',
      label: 'Random max',
      requirements: {randomizeDistance: true},
      min: 0
    },
    closePath: {
      type: 'list',
      label: 'Close path',
      options: ['near start', 'always', 'never']
    }
  };

  const activateTool = function () {
    const {Tool, Path} = paper;

    let path: any;
    let startPos: any;

    // get options from local storage if present
    options = pg.tools.getLocalOptions(options);

    tool = new Tool();

    tool.onMouseDown = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      tool.fixedDistance = options.pointDistance;

      startPos = event.point;
      path = new Path();
      path = pg.stylebar.applyActiveToolbarStyle(path);
      path.strokeCap = 'round';
      path.strokeJoin = 'round';
      path.add(event.point);
    };

    tool.onMouseDrag = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button
      if (options.randomizeDistance) {
        tool.fixedDistance =
          pg.math.getRandomInt(parseInt(options.randomDistMin), parseInt(options.randomDistMax));
      } else {
        tool.fixedDistance = options.pointDistance;
      }
      path.arcTo(event.point);
    };

    tool.onMouseUp = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      // path.add(event.point);
      const checkDist = tool.fixedDistance + (tool.fixedDistance / 10);
      if (options.closePath === 'near start' &&
        pg.math.checkPointsClose(startPos, event.point, checkDist)) {
        path.arcTo(path.segments[0].point);
        path.closePath(true);

      } else if (options.closePath === 'always') {
        path.arcTo(path.segments[0].point);
        path.closePath(true);
      }

      pg.undo.snapshot('cloud');
    };

    // setup floating tool options panel in the editor
    pg.toolOptionPanel.setup(options, components, function () {
    });

    tool.activate();
  };

  return {
    options: options,
    activateTool: activateTool
  };
};
