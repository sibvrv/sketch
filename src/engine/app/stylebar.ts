pg.stylebar = function () {
  let colorsAreDefault = true;

  const setup = function () {
    setupColorPicker();
    setupOpacitySelect();
    setupBlendSelect();
    setupStrokeSelect();
  };

  const setupColorPicker = function () {
    jQuery('#fillColorInput').spectrum({
      color: null,
      allowEmpty: true,
      replacerClassName: 'fillColorSpec',
      containerClassName: 'fillSpecContainer',
      clickoutFiresChange: true,
      showInput: true,
      showPalette: true,
      hideAfterPaletteSelect: true,
      chooseText: 'OK',
      cancelText: 'Cancel',
      preferredFormat: 'rgb',
      palette: [
        ['black', 'white']
      ],
      beforeShow: function () {
        showInputBlocker(true);
      },
      change: function (color) {
        if (jQuery('.fillSpecContainer:visible')) {
          const stringColor = color ? color.toRgbString() : '';
          applyFillColorToSelection(stringColor);
          showInputBlocker(false);
        }
        setColorsAreDefault(false);
      },
      hide: function () {
        showInputBlocker(false);
        setColorsAreDefault(false);
      }
    });

    jQuery('.fillSpecContainer .sp-choose').click(function () {
      applyFillColorToSelection(getFillColor());
      showInputBlocker(false);
    });

    jQuery('.fillColorSpec').attr('title', 'Fill color');

    jQuery('#strokeColorInput').spectrum({
      color: '#000',
      allowEmpty: true,
      replacerClassName: 'strokeColorSpec',
      containerClassName: 'strokeSpecContainer',
      clickoutFiresChange: true,
      showInput: true,
      showPalette: true,
      hideAfterPaletteSelect: true,
      chooseText: 'OK',
      cancelText: 'Cancel',
      preferredFormat: 'rgb',
      palette: [
        ['black', 'white']
      ],
      beforeShow: function () {
        showInputBlocker(true);
      },
      change: function (color) {
        if (jQuery('.strokeSpecContainer:visible')) {
          const stringColor = color ? color.toRgbString() : '';
          applyStrokeColorToSelection(stringColor);
          showInputBlocker(false);
        }
        setColorsAreDefault(false);
      },
      hide: function () {
        showInputBlocker(false);
        setColorsAreDefault(false);
      }
    });

    jQuery('.strokeColorSpec').append('<div class="inner"></div>');

    jQuery('.strokeSpecContainer .sp-choose').click(function () {
      applyStrokeColorToSelection(getStrokeColor());
      showInputBlocker(false);
    });

    jQuery('.strokeColorSpec').attr('title', 'Stroke color');

    jQuery('#colorSwitchButton').click(function () {
      switchColors();
    });
  };

  const setupOpacitySelect = function () {
    jQuery('#opacityInput').on('input change propertychange paste', function () {
      const opacity = getOpacity();
      // check against null because opacity can be 0 and 0 is somehow
      // converted to null...
      if (opacity !== null) {
        applyOpacityToSelection(opacity);
      }
    });

    jQuery('#opacitySelect').on('change', function () {
      setOpacity(this.value / 100, true);
      this.value = '';
    });
  };

  const setupBlendSelect = function () {
    jQuery('#blendModeSelect').on('change', function () {
      const mode = this.value;
      applyBlendModeToSelection(mode);
    });
  };

  const setupStrokeSelect = function () {
    jQuery('#strokeInput').on('input change propertychange paste', function () {
      applyStrokeWidthToSelection(this.value);
      paper.view.update();
    }).blur();

    jQuery('#increaseStrokeWidthButton').click(function (event) {
      const currentStrokeWidth = parseFloat(getStrokeWidth());
      let bonus = 0;
      if (event.shiftKey) {
        bonus = 10;
      }
      if (isNaN(currentStrokeWidth)) {
        setStrokeWidth(1, true);
      } else {
        setStrokeWidth(currentStrokeWidth + 1 + bonus, true);
      }
    });

    jQuery('#decreaseStrokeWidthButton').click(function (event) {
      const currentStrokeWidth = parseFloat(getStrokeWidth());
      let bonus = 0;
      if (event.shiftKey) {
        bonus = 10;
      }
      if (isNaN(currentStrokeWidth)) {
        setStrokeWidth(1, true);
      } else {
        if (currentStrokeWidth - (1 + bonus) < 0) {
          setStrokeWidth(0, true);

        } else {
          setStrokeWidth(currentStrokeWidth - (1 + bonus), true);
        }
      }
    });
  };

  const showInputBlocker = function (state) {
    if (state) {
      jQuery('#colorInputBlocker').show();
    } else {
      jQuery('#colorInputBlocker').hide();
    }
  };

  const getFillColor = function () {
    const value = jQuery('#fillColorInput').spectrum('get');
    return value ? value.toRgbString() : null;
  };

  const getStrokeColor = function () {
    const value = jQuery('#strokeColorInput').spectrum('get');
    return value ? value.toRgbString() : null;
  };

  const getOpacity = function () {
    const value = jQuery('#opacityInput').val();
    return value ? value / 100 : null;
  };

  const getBlendMode = function () {
    const value = jQuery('#blendModeSelect').val();
    return value ? value : null;
  };

  const getStrokeWidth = function () {
    const value = jQuery('#strokeInput').val();
    return value ? parseFloat(value) : null;
  };

  const areColorsDefault = function () {
    return colorsAreDefault;
  };

  const setColorsAreDefault = function (state) {
    colorsAreDefault = state;
  };

  const setFillColor = function (color) {
    jQuery('#fillColorInput').spectrum('set', color);
  };

  const setStrokeColor = function (color) {
    jQuery('#strokeColorInput').spectrum('set', color);
  };

  const setOpacity = function (value, triggerChange) {
    const $input = jQuery('#opacityInput');
    if (value !== null) {
      $input.val(value * 100);
    } else {
      $input.val('');
    }
    if (triggerChange) {
      $input.trigger('change').blur();
    } else {
      $input.blur();
    }
  };

  const setBlendMode = function (mode) {
    const $select = jQuery('#blendModeSelect');

    if (mode !== null) {
      $select.val(mode);
    } else {
      $select.val('');
    }

  };

  const setStrokeWidth = function (value, triggerChange) {
    const $input = jQuery('#strokeInput');
    $input.val(value);

    if (triggerChange) {
      $input.trigger('change').blur();
    }
  };

  const applyFillColorToSelection = function (colorString) {
    const items = pg.selection.getSelectedItems();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (pg.item.isPGTextItem(item)) {
        for (let j = 0; j < item.children.length; j++) {
          const child = item.children[j];
          for (let k = 0; k < child.children.length; k++) {
            const path = child.children[k];
            if (!path.data.isPGGlyphRect) {
              path.fillColor = colorString;
            }
          }
        }
      } else {
        if (pg.item.isPointTextItem(item) && !colorString) {
          colorString = 'rgba(0,0,0,0)';
        }
        item.fillColor = colorString;
      }
    }
    pg.undo.snapshot('applyFillColorToSelection');
  };

  const applyStrokeColorToSelection = function (colorString) {
    const items = pg.selection.getSelectedItems();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (pg.item.isPGTextItem(item)) {
        for (let j = 0; j < item.children.length; j++) {
          const child = item.children[j];
          for (let k = 0; k < child.children.length; k++) {
            const path = child.children[k];
            if (!path.data.isPGGlyphRect) {
              path.strokeColor = colorString;
            }
          }
        }
      } else {
        item.strokeColor = colorString;
      }
    }
    pg.undo.snapshot('applyStrokeColorToSelection');
  };

  const applyOpacityToSelection = function (alpha) {
    const items = pg.selection.getSelectedItems();

    for (let i = 0; i < items.length; i++) {
      items[i].opacity = alpha;
    }
    pg.undo.snapshot('setOpacity');
  };

  const applyBlendModeToSelection = function (mode) {
    const items = pg.selection.getSelectedItems();

    for (let i = 0; i < items.length; i++) {
      items[i].blendMode = mode;
    }
    pg.undo.snapshot('setBlendMode');
  };

  const applyStrokeWidthToSelection = function (value) {
    const items = pg.selection.getSelectedItems();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (pg.group.isGroup(item)) {
        for (let j = 0; j < item.children.length; j++) {
          const child = item.children[j];
          child.strokeWidth = value;
        }
        continue;

      } else {
        item.strokeWidth = value;
      }
    }
    pg.undo.snapshot('setStrokeWidth');
  };

  const updateFromItem = function (item) {
    if (item.fillColor) {
      setFillColor(item.fillColor.toCSS());
    } else {
      setFillColor(null);
    }
    if (item.strokeColor) {
      setStrokeColor(item.strokeColor.toCSS());
    } else {
      setStrokeColor(null);
    }

    setStrokeWidth(item.strokeWidth);
    setOpacity(item.opacity);

    if (item.blendMode) {
      setBlendMode(item.blendMode);
    } else {
      setBlendMode(null);
    }

  };

  const updateFromSelection = function () {
    const selectedItems = pg.selection.getSelectedItems();
    let selectionFillColorString = null;
    let selectionStrokeColorString = null;
    let selectionOpacity = null;
    let selectionStrokeWidth = null;
    let selectionBlendMode = null;

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];

      let itemFillColorString = null;
      let itemStrokeColorString = null;

      // handle pgTextItems differently by going through their children
      if (pg.item.isPGTextItem(item)) {
        const pgItem = item;

        for (let j = 0; j < item.children.length; j++) {
          const child = item.children[j];
          for (let k = 0; k < child.children.length; k++) {
            const path = child.children[k];
            if (!path.data.isPGGlyphRect) {
              if (path.fillColor) {
                itemFillColorString = path.fillColor.toCSS();
              }
              if (path.strokeColor) {
                itemStrokeColorString = path.strokeColor.toCSS();
              }
              // check every style against the first of the items
              if (i === 0) {
                selectionFillColorString = itemFillColorString;
                selectionStrokeColorString = itemStrokeColorString;
                selectionOpacity = pgItem.opacity;
                selectionStrokeWidth = path.strokeWidth;
                selectionBlendMode = pgItem.blendMode;
              }

              if (itemFillColorString !== selectionFillColorString) {
                selectionFillColorString = null;
              }

              if (itemStrokeColorString !== selectionStrokeColorString) {
                selectionStrokeColorString = null;
              }

              if (selectionOpacity !== pgItem.opacity) {
                selectionOpacity = null;
              }

              if (selectionBlendMode !== pgItem.blendMode) {
                selectionBlendMode = null;
              }

              if (selectionStrokeWidth !== path.strokeWidth) {
                selectionStrokeWidth = null;
              }
            }
          }
        }

      } else {

        if (item.fillColor) {
          // hack bc text items with null fill can't be detected by fill-hitTest anymore
          if (pg.item.isPointTextItem(item) && item.fillColor.toCSS() === 'rgba(0,0,0,0)') {
            itemFillColorString = null;
          } else {
            itemFillColorString = item.fillColor.toCSS();
          }
        }
        if (item.strokeColor) {
          itemStrokeColorString = item.strokeColor.toCSS();
        }

        // check every style against the first of the items
        if (i === 0) {
          selectionFillColorString = itemFillColorString;
          selectionStrokeColorString = itemStrokeColorString;
          selectionOpacity = item.opacity;
          selectionStrokeWidth = item.strokeWidth;
          selectionBlendMode = item.blendMode;
        }

        if (itemFillColorString !== selectionFillColorString) {
          selectionFillColorString = null;
        }

        if (itemStrokeColorString !== selectionStrokeColorString) {
          selectionStrokeColorString = null;
        }

        if (selectionOpacity !== item.opacity) {
          selectionOpacity = null;
        }

        if (selectionBlendMode !== item.blendMode) {
          selectionBlendMode = null;
        }

        if (selectionStrokeWidth !== item.strokeWidth) {
          selectionStrokeWidth = null;
        }
      }

    }

    setFillColor(selectionFillColorString);
    setStrokeColor(selectionStrokeColorString);

    setStrokeWidth(selectionStrokeWidth);

    if (selectionOpacity) {
      setOpacity(selectionOpacity);
    } else {
      setOpacity(null);
    }

    if (selectionBlendMode) {
      setBlendMode(selectionBlendMode);
    } else {
      setBlendMode(null);
    }
  };

  // sets all the selectable styles from the toolbar to the path and returns it
  // usually called from the tools when a new path is created
  const applyActiveToolbarStyle = function (item) {
    if (pg.group.isGroup(item)) {
      item.opacity = getOpacity();
      item.blendMode = getBlendMode();

    } else {
      item.fillColor = getFillColor();
      item.strokeColor = getStrokeColor();
      item.opacity = getOpacity();
      item.strokeWidth = getStrokeWidth();
      item.blendMode = getBlendMode();
    }
    return item;
  };

  const switchColors = function () {
    colorsAreDefault = false;

    const currFillColor = getFillColor();
    const currStrokeColor = getStrokeColor();

    const currFillColorString = getFillColor(true);
    const currStrokeColorString = getStrokeColor(true);

    jQuery('#strokeColorInput').spectrum('set', currFillColorString);
    jQuery('#fillColorInput').spectrum('set', currStrokeColorString);

    applyFillColorToSelection(currStrokeColor);
    applyStrokeColorToSelection(currFillColor);
  };

  // mainly makes sure the user doesn't accidentally draw with no color or
  // no opacity
  const sanitizeSettings = function () {
    // if a tool is selected and the opacity value is empty, set it to 1
    // otherwise the user draws something with opacity 0 and sees nothing
    const opacity = jQuery('#opacityInput').val();
    if (opacity === '') {
      setOpacity(1);
    }
    const blendMode = jQuery('#blendModeSelect').val();
    if (blendMode === '') {
      setBlendMode('normal');
    }

    if (!getFillColor() && !getStrokeColor()) {
      setFillColor('rgb(0,0,0)');
    }

    if (getStrokeWidth() === null) {
      setStrokeWidth(1);
    }

  };

  const blurInputs = function () {
    jQuery('input, select, textarea, button').blur();
  };

  return {
    setup: setup,
    getFillColor: getFillColor,
    getStrokeColor: getStrokeColor,
    getOpacity: getOpacity,
    getBlendMode: getBlendMode,
    getStrokeWidth: getStrokeWidth,
    areColorsDefault: areColorsDefault,
    setColorsAreDefault: setColorsAreDefault,
    setFillColor: setFillColor,
    setStrokeColor: setStrokeColor,
    setOpacity: setOpacity,
    setStrokeWidth: setStrokeWidth,
    applyFillColorToSelection: applyFillColorToSelection,
    applyStrokeColorToSelection: applyStrokeColorToSelection,
    applyOpacityToSelection: applyOpacityToSelection,
    applyBlendModeToSelection: applyBlendModeToSelection,
    applyStrokeWidthToSelection: applyStrokeWidthToSelection,
    updateFromSelection: updateFromSelection,
    updateFromItem: updateFromItem,
    applyActiveToolbarStyle: applyActiveToolbarStyle,
    switchColors: switchColors,
    sanitizeSettings: sanitizeSettings,
    blurInputs: blurInputs

  };

}();
