// zoom tool
// adapted from http://sketch.paperjs.org/

pg.tools.registerTool({
  id: 'zoom',
  name: 'Zoom',
  usedKeys: {
    toolbar: 'z'
  }
});

pg.tools.zoom = function () {
  let tool;
  let doRectZoom;

  const options = {};

  const activateTool = function () {
    const {Tool, Rectangle, Path, Size, Point} = paper;

    tool = new Tool();

    setCursor('zoom-in');

    tool.onMouseDown = function (event: any) {
      if (event.event.button > 0) {
        return;
      } // only first mouse button

      doRectZoom = true;

    };

    tool.onMouseUp = function (event: any) {
      if (event.event.button > 0) {
        return;
      } // only first mouse button

      let factor = 1.5;
      if (event.modifiers.option) {
        factor = 1 / factor;
      }
      pg.view.zoomBy(factor);
      paper.view.center = event.point;
    };

    let keyDownFired = false;
    tool.onKeyDown = function (event: any) {
      if (keyDownFired) {
        return;
      }
      keyDownFired = true;
      if (event.key === 'option') {
        setCursor('zoom-out');
      }
    };

    tool.onKeyUp = function (event: any) {
      keyDownFired = false;
      doRectZoom = false;

      if (event.key === 'option') {
        setCursor('zoom-in');
      }
    };

    tool.activate();

  };

  const setCursor = function (cursorString?: any) {
    const $body = jQuery('body');

    $body.removeClass('zoom-in');
    $body.removeClass('zoom-out');

    if (cursorString && cursorString.length > 0) {
      $body.addClass(cursorString);
    }
  };

  const deactivateTool = function () {
    setCursor();
  };

  return {
    options: options,
    activateTool: activateTool,
    deactivateTool: deactivateTool
  };

};
