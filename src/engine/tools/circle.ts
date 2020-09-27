// circle tool
// adapted from the paperjs examples (Tools/Circles.html)

pg.tools.registerTool({
  id: 'circle',
  name: 'Circle'
});

pg.tools.circle = function () {
  let tool: any;

  const options = {};

  const activateTool = function () {
    const {Tool, Shape, Point} = paper;

    tool = new Tool();

    let shape: any;
    let mouseDown: any;

    tool.onMouseDown = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      mouseDown = event.downPoint;

      shape = new Shape.Ellipse({
        point: event.downPoint,
        size: 0
      });

      shape = pg.stylebar.applyActiveToolbarStyle(shape);
    };

    tool.onMouseDrag = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      const ex = event.point.x;
      const ey = event.point.y;

      if (event.modifiers.shift) {
        shape.size = new Point(mouseDown.x - ex, mouseDown.x - ex);
      } else {
        shape.size = new Point(mouseDown.x - ex, mouseDown.y - ey);
      }

      if (event.modifiers.alt) {
        shape.position = mouseDown;
        shape.size = shape.size.multiply(2);
        /*const l = 2 * Math.sqrt(shape.size.width * shape.size.width + shape.size.height * shape.size.height);
        const aspect = shape.size.width / shape.size.height;
        shape.size.width = l * aspect;
        shape.size.height = l / aspect;*/
      } else {
        shape.position = mouseDown.subtract(shape.size.multiply(0.5));
      }
    };

    tool.onMouseUp = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      // convert shape to path
      shape.toPath(true);
      shape.remove();

      pg.undo.snapshot('circle');
    };

    tool.activate();
  };

  const deactivateTool = function () {
    tool.remove();
  };

  return {
    options: options,
    activateTool: activateTool,
    deactivateTool: deactivateTool
  };

};
