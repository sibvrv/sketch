// view pan tool
// adapted from http://sketch.paperjs.org/

pg.tools.registerTool({
  id: 'viewgrab',
  name: 'View grab',
//  type: 'hidden'
});

pg.tools.viewgrab = function () {
  let tool;
  let lastPoint: any;

  const options = {};

  const activateTool = function () {
    const {Tool} = paper;

    tool = new Tool();

    setCursor('grab');

    tool.onMouseDown = function (event: any) {
      if (event.event.button > 0) {
        return;
      } // only first mouse button
      lastPoint = paper.view.projectToView(event.point);
      setCursor('grabbing');
    };

    tool.onMouseDrag = function (event: any) {
      if (event.event.button > 0) {
        return;
      } // only first mouse button
      setCursor('grabbing');

      // In order to have coordinate changes not mess up the
      // dragging, we need to convert coordinates to view space,
      // and then back to project space after the view space has
      // changed.
      const point = paper.view.projectToView(event.point);
      const last = paper.view.viewToProject(lastPoint);
      paper.view.scrollBy(last.subtract(event.point));
      lastPoint = point;
    };

    tool.onMouseUp = function (event: any) {
      setCursor('grab');
    };

    let keyDownFired = false;
    tool.onKeyDown = function (event: any) {
      if (keyDownFired) {
        return;
      }
      keyDownFired = true;

      if (event.key === 'space') {
        setCursor('grab');
      }
    };

    tool.onKeyUp = function (event: any) {
      keyDownFired = false;

      if (event.key === 'space') {
        setCursor();
      }
    };

    tool.activate();

  };

  const setCursor = function (cursorString?: string) {
    const $body = jQuery('body');
    $body.removeClass('grab');
    $body.removeClass('grabbing');

    if (cursorString && cursorString.length > 0) {
      $body.addClass(cursorString);
    }
  };

  return {
    options: options,
    activateTool: activateTool
  };
};
