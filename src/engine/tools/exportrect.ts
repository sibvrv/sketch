// a tool for defining a rectangle to export svg or images from because by
// default, paper.js exports the whole viewport rect

pg.tools.registerTool({
  id: 'exportrect',
  name: 'Export area'
});

pg.tools.exportrect = function () {
  let tool;
  let rect: any;
  let outerRect: any;

  let compoundPath;

  let options = {
    posX: -100,
    posY: -100,
    width: 200,
    height: 200
  };

  const components = {
    posX: {
      type: 'int',
      label: 'Pos X'
    },
    posY: {
      type: 'int',
      label: 'Pos Y'
    },
    width: {
      type: 'int',
      label: 'Width',
      min: 1
    },
    height: {
      type: 'int',
      label: 'Height',
      min: 1
    }
  };

  const {Tool, Rectangle, Path} = paper;

  const activateTool = function () {
    tool = new Tool();

    // if no options are set, try to get the current rect
    if (pg.export.getExportRect()) {
      options.posX = pg.export.getExportRect().x;
      options.posY = pg.export.getExportRect().y;
      options.width = pg.export.getExportRect().width;
      options.height = pg.export.getExportRect().height;
    } else {
      // get options from local storage if present
      options = pg.tools.getLocalOptions(options);
    }

    outerRect = new Rectangle(-500000, -500000, 1000000, 1000000);
    rect = new Rectangle(options.posX, options.posY, options.width, options.height);
    drawRect();
    pg.export.setExportRect(rect);

    tool.onMouseDrag = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      if (event.modifiers.shift) {
        const width = event.point.x - event.downPoint.x;
        rect = new Rectangle(event.downPoint.x, event.downPoint.y, width, width);
      } else {
        rect = new Rectangle(event.downPoint, event.point);
      }
      drawRect();

      options.posX = parseInt(event.downPoint.x);
      options.posY = parseInt(event.downPoint.y);
      options.width = parseInt(event.point.x - event.downPoint.x);
      options.height = parseInt(event.point.y - event.downPoint.y);

      pg.toolOptionPanel.update(options);

    };

    tool.onMouseUp = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      pg.export.setExportRect(rect);

      pg.layer.activateDefaultLayer();

      pg.tools.setLocalOptions(options);

      pg.undo.snapshot('exportrectangle');
    };

    // setup floating tool options panel in the editor
    pg.toolOptionPanel.setup(options, components, function () {
      rect = new Rectangle(options.posX, options.posY, options.width, options.height);
      pg.export.setExportRect(rect);
      drawRect();
    });

    // override reset button... hacky...
    jQuery('.toolOptionResetButton').unbind('click').click(function () {
      if (confirm('Reset tool options to default?')) {
        pg.tools.deleteLocalOptions(options.id);
        pg.export.clearExportRect();
        pg.toolbar.switchTool(options.id, true);
      }
    });

    // this removes the export area from the document as if it never existed
    const $optionSection = jQuery('<div class="option-section" data-id="remove">');
    const $removeButton = jQuery('<button title="Remove Export Area">Remove</button>');
    $removeButton.click(function () {
      if (confirm('Remove export area?')) {
        pg.export.clearExportRect();
        pg.guides.removeExportRectGuide();
        pg.tools.deleteLocalOptions(options.id);
        pg.toolbar.setDefaultTool();
      }
    });
    $optionSection.append($removeButton);
    jQuery('.toolOptionPanel .options').append($optionSection);

    tool.activate();
  };

  const drawRect = function () {
    pg.guides.removeExportRectGuide();
    compoundPath = new paper.CompoundPath({
      children: [new Path.Rectangle(rect), new Path.Rectangle(outerRect)],
      fillRule: 'evenodd',
      fillColor: 'black',
      opacity: 0.2,
      guide: true,
      data: {
        isExportRect: true,
        exportRectBounds: rect
      },
      parent: pg.layer.getGuideLayer()
    });
  };

  const deactivateTool = function () {

  };

  return {
    options: options,
    activateTool: activateTool,
    deactivateTool: deactivateTool
  };
};
