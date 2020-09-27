// rectangle tool
pg.tools.registerTool({
  id: 'rectangle',
  name: 'Rectangle'
});

pg.tools.rectangle = function () {
  let tool;

  let options = {
    roundedCorners: false,
    cornerRadius: 20
  };

  const components = {
    roundedCorners: {
      type: 'boolean',
      label: 'Rounded corners'
    },
    cornerRadius: {
      type: 'float',
      label: 'Corner radius',
      requirements: {roundedCorners: true},
      min: 0
    }
  };

  const activateTool = function () {
    const {Tool, Rectangle, Path} = paper;

    // get options from local storage if present
    options = pg.tools.getLocalOptions(options);

    tool = new Tool();
    let mouseDown: any;
    let path;
    let rect;

    tool.onMouseDown = function (event: any) {
      mouseDown = event.downPoint;
    };

    tool.onMouseDrag = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      rect = new Rectangle(event.downPoint, event.point);

      if (event.modifiers.shift) {
        rect.height = rect.width;
      }

      if (event.modifiers.alt) {
        rect.width *= 2;
        rect.height *= 2;
      }

      if (options.roundedCorners) {
        path = new Path.Rectangle(rect, options.cornerRadius);
      } else {
        path = new Path.Rectangle(rect);
      }

      if (event.modifiers.alt) {
        path.position = mouseDown;
      }

      path = pg.stylebar.applyActiveToolbarStyle(path);

      // Remove this path on the next drag event:
      path.removeOnDrag();
    };

    tool.onMouseUp = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      pg.undo.snapshot('rectangle');
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
