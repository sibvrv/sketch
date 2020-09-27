pg.statusbar = function () {

  const setup = function () {
    setupZoomSelect();
  };

  const setupZoomSelect = function () {
    jQuery('#zoomSelect').change(function () {
      paper.view.zoom = this.value;
      update();
      this.value = '';
      this.blur();
    });
  };

  const update = function () {
    jQuery('#zoomInput').val(Math.round(paper.view.zoom * 100));

    const selectionType = pg.selection.getSelectionType();
    if (selectionType) {
      jQuery('#selectionTypeLabel').html(selectionType).removeClass('none');
    } else {
      jQuery('#selectionTypeLabel').html('No selection').addClass('none');
    }
  };

  return {
    setup: setup,
    update: update
  };

}();
