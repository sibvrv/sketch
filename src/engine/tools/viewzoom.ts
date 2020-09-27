// view zoom tool
// adapted from http://sketch.paperjs.org/

pg.tools.registerTool({
  id: 'viewzoom',
  name: 'View zoom',
  type: 'hidden'
});

pg.tools.viewzoom = function () {
  let tool;
  let ePoint: any;

  const options = {};

  const activateTool = function () {
    const {Tool} = paper;

    tool = new Tool();

    ePoint = paper.view.center;

    tool.onMouseMove = function (event: any) {
      ePoint = event.point;
    };

    tool.activate();
  };

  const updateTool = function (updateInfo: any) {

    let factor = 1.25;
    if (updateInfo.originalEvent.wheelDelta > 0 || updateInfo.originalEvent.detail < 0) {
      // scroll up / zoom in

    } else {
      // scroll down / zoom out
      factor = 1 / factor;
    }

    paper.view.center = ePoint;
    pg.view.zoomBy(factor);
  };

  return {
    options: options,
    activateTool: activateTool,
    updateTool: updateTool
  };
};
