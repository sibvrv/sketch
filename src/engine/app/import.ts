// functions related to importing

pg.import = function () {

  const importAndAddExternalImage = function (url) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        importAndAddImage(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

  const importAndAddImage = function (src) {
    new paper.Raster({
      source: src,
      position: paper.view.center
    });
    pg.undo.snapshot('importImage');
  };

  const importAndAddSVG = function (svgString) {
    paper.project.importSVG(svgString, {expandShapes: true});
    pg.undo.snapshot('importAndAddSVG');
    paper.project.view.update();
  };

  return {
    importAndAddImage: importAndAddImage,
    importAndAddExternalImage: importAndAddExternalImage,
    importAndAddSVG: importAndAddSVG
  };
}();
