// functions related to guide items

pg.guides = function () {

  const guideBlue = '#009dec';
  const guideGrey = '#aaaaaa';

  const hoverItem = function (hitResult) {
    const segments = hitResult.item.segments;
    const clone = new paper.Path(segments);
    setDefaultGuideStyle(clone);
    if (hitResult.item.closed) {
      clone.closed = true;
    }
    clone.parent = pg.layer.getGuideLayer();
    clone.strokeColor = guideBlue;
    clone.fillColor = null;
    clone.data.isHelperItem = true;
    clone.bringToFront();

    return clone;
  };

  const hoverBounds = function (item) {
    const rect = new paper.Path.Rectangle(item.internalBounds);
    rect.matrix = item.matrix;
    setDefaultGuideStyle(rect);
    rect.parent = pg.layer.getGuideLayer();
    rect.strokeColor = guideBlue;
    rect.fillColor = null;
    rect.data.isHelperItem = true;
    rect.bringToFront();

    return rect;
  };

  const rectSelect = function (event, color) {
    const half = new paper.Point(0.5 / paper.view.zoom, 0.5 / paper.view.zoom);
    const start = event.downPoint.add(half);
    const end = event.point.add(half);
    const rect = new paper.Path.Rectangle(start, end);
    const zoom = 1.0 / paper.view.zoom;
    setDefaultGuideStyle(rect);
    if (!color) {
      color = guideGrey;
    }
    rect.parent = pg.layer.getGuideLayer();
    rect.strokeColor = color;
    rect.data.isRectSelect = true;
    rect.data.isHelperItem = true;
    rect.dashArray = [3.0 * zoom, 3.0 * zoom];
    return rect;
  };

  const line = function (from, to, color) {
    const line = new paper.Path.Line(from, to);
    const zoom = 1 / paper.view.zoom;
    setDefaultGuideStyle(line);
    if (!color) {
      color = guideGrey;
    }
    line.parent = pg.layer.getGuideLayer();
    line.strokeColor = color;
    line.strokeColor = color;
    line.dashArray = [5 * zoom, 5 * zoom];
    line.data.isHelperItem = true;
    return line;
  };

  const crossPivot = function (center, color) {
    const zoom = 1 / paper.view.zoom;
    const star = new paper.Path.Star(center, 4, 4 * zoom, 0.5 * zoom);
    setDefaultGuideStyle(star);
    if (!color) {
      color = guideBlue;
    }
    star.parent = pg.layer.getGuideLayer();
    star.fillColor = color;
    star.strokeColor = color;
    star.strokeWidth = 0.5 * zoom;
    star.data.isHelperItem = true;
    star.rotate(45);

    return star;
  };

  const rotPivot = function (center, color) {
    const zoom = 1 / paper.view.zoom;
    const path = new paper.Path.Circle(center, 3 * zoom);
    setDefaultGuideStyle(path);
    if (!color) {
      color = guideBlue;
    }
    path.parent = pg.layer.getGuideLayer();
    path.fillColor = color;
    path.data.isHelperItem = true;

    return path;
  };

  const label = function (pos, content, color) {
    const text = new paper.PointText(pos);
    if (!color) {
      color = guideGrey;
    }
    text.parent = pg.layer.getGuideLayer();
    text.fillColor = color;
    text.content = content;
  };

  const setDefaultGuideStyle = function (item) {
    item.strokeWidth = 1 / paper.view.zoom;
    item.opacity = 1;
    item.blendMode = 'normal';
    item.guide = true;
  };

  const getGuideColor = function (colorName) {
    if (colorName === 'blue') {
      return guideBlue;
    } else if (colorName === 'grey') {
      return guideGrey;
    }
  };

  const getAllGuides = function () {
    const allItems = [];
    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];
      for (let j = 0; j < layer.children.length; j++) {
        const child = layer.children[j];
        // only give guides
        if (!child.guide) {
          continue;
        }
        allItems.push(child);
      }
    }
    return allItems;
  };

  const getExportRectGuide = function () {
    const guides = getAllGuides();
    for (let i = 0; i < guides.length; i++) {
      if (guides[i].data && guides[i].data.isExportRect) {
        return guides[i];
      }
    }
  };

  const removeHelperItems = function () {
    pg.helper.removePaperItemsByDataTags(['isHelperItem']);
  };

  const removeAllGuides = function () {
    pg.helper.removePaperItemsByTags(['guide']);
  };

  const removeExportRectGuide = function () {
    pg.helper.removePaperItemsByDataTags(['isExportRect']);
  };

  return {
    hoverItem: hoverItem,
    hoverBounds: hoverBounds,
    rectSelect: rectSelect,
    line: line,
    crossPivot: crossPivot,
    rotPivot: rotPivot,
    label: label,
    removeAllGuides: removeAllGuides,
    removeHelperItems: removeHelperItems,
    removeExportRectGuide: removeExportRectGuide,
    getAllGuides: getAllGuides,
    getExportRectGuide: getExportRectGuide,
    getGuideColor: getGuideColor,
    setDefaultGuideStyle: setDefaultGuideStyle
  };

}();
