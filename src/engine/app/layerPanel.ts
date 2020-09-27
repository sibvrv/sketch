pg.layerPanel = function () {

  const toggleVisibility = function () {
    const $panel = jQuery('.layerPanel');
    if (!$panel || $panel.length <= 0) {
      setup();

    } else {
      if ($panel.hasClass('hidden')) {
        $panel.removeClass('hidden');
      } else {
        $panel.addClass('hidden');
      }
    }
  };

  const setup = function () {
    loadResources();

    const $panel = jQuery('<div class="layerPanel">');
    const baseTopOffset = jQuery('.appNav').height() + jQuery('.settingsBarContainer').height();
    $panel.css({
      'top': baseTopOffset + 'px',
      'max-height': jQuery(window).height() - baseTopOffset + 'px'
    });
    const $header = jQuery('<header class="layerPanelHeader"><h2>Layers</h2></header>');
    const $newLayerButton = jQuery('<button class="newLayerButton">Add</button>');

    $newLayerButton.click(function () {
      const newLayer = pg.layer.addNewLayer();
      newLayer.activate();
      updateLayerList();
    });

    $header.append($newLayerButton);

    const $layerEntries = jQuery('<div class="layerEntries">');
    $layerEntries.sortable({
      containment: 'parent',
      forcePlaceholderSize: true,
      tolerance: 'pointer',
      delay: 300,
      stop: function (event, ui) {
        handleLayerOrderChange();
      }
    });

    $panel.append($header, $layerEntries);
    jQuery('body').append($panel);

    $layerEntries.css({
      'max-height': jQuery('body').height() - baseTopOffset - $header.height() + 'px'
    });

    updateLayerList();

    updateLayerValues();

    jQuery(document).on('LayerAdded LayerRemoved', function () {
      updateLayerList();
    });

    jQuery(document).on('DocumentUpdate', function () {
      updateLayerValues();
    });
  };

  const setupLayerEntry = function (layer) {
    if (!(layer.data && layer.data.isGuideLayer)) {
      let $activeClass = '';
      if (pg.layer.isActiveLayer(layer)) {
        $activeClass = ' active';
      }
      const $layerEntry = jQuery('<ul class="layerEntry' + $activeClass + '" data-layer-id="' + layer.data.id + '">');
      const $layerVisSection = jQuery('<li class="layerVisSection">');
      const $layerVisButton = jQuery('<input type="checkbox" class="layerVisibilityToggle" title="Layer visibility">').attr('checked', layer.visible);
      const $layerNameSection = jQuery('<li class="layerName" title="">');
      const $layerNameInput = jQuery('<input type="text">').val(layer.name);
      const $layerActionSection = jQuery('<li class="layerActions">');
      const $layerDeleteButton = jQuery('<button class="layerDeleteButton" data-layer-id="' + layer.data.id + '" title="Delete layer">&times;</button>');
      const $layerInfo = jQuery('<li class="layerInfo" title="Selected 0/0 Total">i</li>');
      const $layerSelectSection = jQuery('<li class="layerSelectSection">');
      const $layerSelectButton = jQuery('<input type="radio" class="layerSelectToggle" title="Select all/none">');

      $layerEntry.click(function () {
        setActiveLayerEntry(layer);
      });

      $layerVisButton.click(function () {
        layer.visible = !layer.visible;
      });

      if (layer.data.isDefaultLayer) {
        $layerNameInput.attr('disabled', true);
      }

      $layerNameInput.on('change', function () {
        layer.name = jQuery(this).val();
      });

      $layerDeleteButton.click(function () {
        if (confirm('Delete this layer and all its children?')) {
          pg.layer.deleteLayer(jQuery(this).attr('data-layer-id'));
          updateLayerList();
        }

      });

      $layerSelectButton.click(function () {
        if (jQuery(this).attr('checked')) {
          pg.selection.clearSelection();
          jQuery(this).removeAttr('checked');

        } else {
          pg.selection.clearSelection();

          const items = pg.helper.getPaperItemsByLayerID(layer.data.id);
          jQuery.each(items, function (index, item) {
            pg.selection.setItemSelection(item, true);
          });
          jQuery(this).attr('checked', items.length > 0);
        }
      });

      $layerVisSection.append($layerVisButton);
      $layerNameSection.append($layerNameInput);
      if (!layer.data.isDefaultLayer) {
        $layerActionSection.append($layerDeleteButton);
      }
      $layerSelectSection.append($layerSelectButton);
      $layerEntry.append($layerVisSection, $layerNameSection, $layerActionSection, $layerInfo, $layerSelectSection);
      jQuery('.layerEntries').prepend($layerEntry);
    }
  };

  const setActiveLayerEntry = function (layer) {
    jQuery('.layerEntry').removeClass('active');
    pg.layer.setActiveLayer(layer);
    jQuery('.layerEntry[data-layer-id="' + layer.data.id + '"]').addClass('active');
  };

  const handleLayerOrderChange = function () {
    const order = [];
    jQuery('.layerEntries').children().each(function () {
      order.push(jQuery(this).attr('data-layer-id'));
    });
    pg.layer.changeLayerOrderByIDArray(order);
  };

  const updateLayerList = function () {
    jQuery('.layerEntries').empty();
    jQuery.each(paper.project.layers, function (index, layer) {
      setupLayerEntry(layer);
    });

  };

  const updateLayerValues = function () {
    jQuery('.layerEntry').each(function () {
      const id = parseInt(jQuery(this).attr('data-layer-id'));
      const layer = pg.layer.getLayerByID(id);
      if (layer) {

        let selectedItems = 0;
        jQuery.each(layer.children, function (index, child) {
          if (child.selected || child.fullySelected) {
            selectedItems++;
          }
        });

        const $entry = jQuery(this);
        $entry.find('.layerInfo').attr('title', 'Selected ' + selectedItems + '/' + layer.children.length + ' Total');

        if (layer.children.length > 0 && selectedItems === layer.children.length) {
          $entry.find('.layerSelectToggle').prop('checked', true);
        } else {
          $entry.find('.layerSelectToggle').prop('checked', false);
        }
      }
    });
  };

  const loadResources = function () {
    if (!jQuery('#layerPanelCSS').exists()) {
      jQuery('<link />', {
        href: 'css/layerPanel.css',
        rel: 'stylesheet',
        id: 'layerPanelCSS'
      }).appendTo('head', function () {
        return true;
      });
    }

  };

  return {
    toggleVisibility: toggleVisibility,
    updateLayerList: updateLayerList
  };

}();
