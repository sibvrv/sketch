// cool brush from
// http://paperjs.org/tutorials/interaction/working-with-mouse-vectors/
// improved with additional options

pg.tools.registerTool({
  id: 'broadbrush',
  name: 'Broad brush'
});

pg.tools.broadbrush = function () {
  let tool: any;
  let path: any;

  let options = {
    pointDistance: 20,
    brushWidth: 60,
    strokeEnds: 6,
    endLength: 7,
    endVariation: 2,
    endType: 'slime'
  };

  const components = {
    pointDistance: {
      type: 'int',
      label: 'Point distance',
      min: 1
    },
    brushWidth: {
      type: 'float',
      label: 'Brush width',
      min: 0
    },
    strokeEnds: {
      type: 'int',
      label: 'Stroke ends',
      min: 0
    },
    endLength: {
      type: 'float',
      label: 'Ends length',
      min: 0
    },
    endVariation: {
      type: 'float',
      label: 'Ends variation',
      min: 0
    },
    endType: {
      type: 'list',
      label: 'Ends',
      options: ['linear', 'smooth', 'slime']
    }
  };

  const activateTool = function () {
    const {Tool, Path} = paper;

    // get options from local storage if present
    options = pg.tools.getLocalOptions(options);
    tool = new Tool();

    tool.fixedDistance = options.pointDistance;

    let lastPoint: any;

    tool.onMouseDown = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      path = new Path();
      path = pg.stylebar.applyActiveToolbarStyle(path);
    };

    tool.onMouseDrag = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      // If this is the first drag event,
      // add the strokes at the start:
      if (event.count === 0) {
        addStrokes(event.middlePoint, event.delta.negate());
      } else {
        const step = (event.delta).normalize(options.brushWidth / 2);
        step.angle += 90;

        const top = event.middlePoint.add(step);
        const bottom = event.middlePoint.subtract(step);

        path.add(top);
        path.insert(0, bottom);
      }

      lastPoint = event.middlePoint;
    };

    tool.onMouseUp = function (event: any) {
      if (event.event.button > 0) {
        return;
      }  // only first mouse button

      const delta = event.point.subtract(lastPoint);
      delta.length = tool.maxDistance;
      addStrokes(event.point, delta);
      path.closed = true;
      path.smooth();

      // postprocessing the stroke end segments
      if (options.endType !== 'smooth') {
        for (let i = 0; i < path.segments.length; i++) {
          const seg = path.segments[i];
          for (let j = 0; j < strokeIndices.length; j++) {
            const ind = strokeIndices[j];
            if (ind.index === seg.index) {
              if (options.endType === 'slime') {
                pg.geometry.switchHandle(seg, 'smooth');

              } else if (options.endType === 'linear') {
                pg.geometry.switchHandle(seg, 'linear');
              }
            }
          }
        }
      }
      // resettin
      strokeIndices = [];

      pg.undo.snapshot('broadbrush');

    };

    // setup floating tool options panel in the editor
    pg.toolOptionPanel.setup(options, components, function () {
      tool.fixedDistance = options.pointDistance;
    });

    tool.activate();
  };

  let strokeIndices: any[] = [];

  const addStrokes = function (point: any, delta: any) {
    let step = delta.normalize(options.brushWidth).rotate(90);
    const strokePoints = options.strokeEnds > 0 ? options.strokeEnds * 2 + 1 : 2;
    point = point.subtract(step.multiply(0.5));
    step = step.divide(strokePoints - 1);
    for (let i = 0; i < strokePoints; i++) {
      let strokePoint = point.add(step.multiply(i));
      let offset;
      if (options.endVariation > 0) {
        offset = delta.normalize(options.endLength).multiply(Math.random() * options.endVariation + 0.1);
      } else {
        offset = delta.normalize(options.endLength);
      }
      if (i % 2) {
        offset = offset.negate();
      }
      strokePoint = strokePoint.add(offset);
      path.insert(0, strokePoint);

      // collect segment indices for post processing
      if (options.endType === 'slime' || options.endType === 'linear') {
        strokeIndices.push(path.firstSegment);
      }
    }
  };

  return {
    options: options,
    activateTool: activateTool
  };

};
