// text tool

pg.tools.registerTool({
  id: 'text',
  name: 'Text',
  usedKeys: {
    toolbar: 't'
  }
});

pg.tools.text = function () {
  const {Tool, Size} = paper;

  let tool;

  let options = {
    fontFamily: '',
    fontStyle: '',
    fontSize: 80,
    letterSpacing: 0
  };

  const components = {
    fontFamily: {
      type: 'list',
      label: 'Font',
      options: [''],
      maxWidth: 80
    },
    fontStyle: {
      type: 'list',
      label: 'Style',
      options: [''],
      maxWidth: 80
    },
    fontSize: {
      type: 'float',
      label: 'Size',
      min: 0
    },
    letterSpacing: {
      type: 'int',
      label: 'Spacing'
    },
    fontTextInput: {
      type: 'text',
      label: 'Text'
    }
  };

  let textItem: any;
  let toolMode = 'create';
  let creationPoint: any;
  let $textInput: any;

  let textSize = -1;
  let textAngle = 0;

  const activateTool = function () {

    let hitItem: any = null;

    const hitOptions = {
      fill: true,
      curves: true,
      tolerance: 5 / paper.view.zoom
    };

    // get options from local storage if present
    options = pg.tools.getLocalOptions(options);

    tool = new Tool();
    creationPoint = paper.view.center;

    // if the user hasn't changed the colors yet, switching to the text
    // tool will set the fillColor to black and the strokeColor to null
    if (pg.stylebar.areColorsDefault()) {
      pg.stylebar.setFillColor('rgb(0, 0, 0)');
      pg.stylebar.setStrokeColor(null);
    }

    tool.onMouseMove = function (event: any) {
      const hitResult = paper.project.hitTest(event.point, hitOptions);
      if (hitResult && hitResult.item) {
        const root = pg.item.getRootItem(hitResult.item);
        if (root.data.isPGTextItem) {
          hitItem = root;
        } else {
          hitItem = null;
        }
      } else {
        hitItem = null;
      }
    };

    tool.onMouseDown = function (event: any) {
      if (toolMode === 'edit') {
        finalizeInput();
      }

      if (toolMode === 'create') {
        toolMode = 'edit';
        if (hitItem) {
          pg.selection.clearSelection();
          pg.selection.setItemSelection(hitItem, true);
          handleSelectedItem(hitItem);
          rebuildFamilySelect();
          rebuildFontStyleSelect();
          rebuildFontSizeInput();
          $textInput.focus();

        } else {
          pg.selection.clearSelection();
          createItem('', event.point);
          $textInput.focus();
        }
        pg.undo.snapshot('texteditstarted');
      }
    };

    // setup floating tool options panel in the editor
    pg.toolOptionPanel.setup(options, components, function () {
      rebuildFontStyleSelect();
      createItem(jQuery('#textToolInput').val(), creationPoint);
      rebuildFontSizeInput();

    });

    // if there is a selected item, load its value to the options
    const selectedItems = pg.selection.getSelectedItems();
    if (selectedItems.length > 0 && selectedItems[0].data.isPGTextItem) {
      handleSelectedItem(selectedItems[0]);
      toolMode = 'edit';
    }

    rebuildFamilySelect();
    rebuildFontStyleSelect();
    rebuildFontSizeInput();
    setupFontImportSection();
    setupInputField();

    tool.activate();
  };

  const handleSelectedItem = function (selectedItem: any) {
    options.fontFamily = selectedItem.data.fontFamily;
    options.fontStyle = selectedItem.data.fontStyle;
    options.fontSize = selectedItem.data.fontSize;
    options.letterSpacing = selectedItem.data.letterSpacing;
    jQuery('.toolOptionPanel input[name="fontSize"]').val(selectedItem.data.fontSize);
    jQuery('.toolOptionPanel input[name="letterSpacing"]').val(selectedItem.data.letterSpacing);
    jQuery('#textToolInput').val(selectedItem.data.text);
    creationPoint = selectedItem.position;
    textItem = selectedItem;

    // save original scale and size (kinda...)
    if (textItem) {
      const helperCurve = getFirstCurve(textItem);
      if (helperCurve) {
        textSize = helperCurve.length;
        textAngle = helperCurve.line.vector.angle;
      }
    }
  };

  const createItem = function (text: any, pos: any) {
    let wasScaled = false;
    if (textItem) {
      wasScaled = textItem.data.wasScaled;
      textItem.remove();
    }
    toolMode = 'edit';
    creationPoint = pos;
    textItem = pg.text.createPGTextItem(text, options, pos);
    textItem.data.wasScaled = wasScaled;
    pg.stylebar.applyActiveToolbarStyle(textItem);

    // apply original rotation and scale to the new item
    if (textItem) {
      const helperCurve = getFirstCurve(textItem);
      if (helperCurve) {
        if (textSize > -1 && textItem.data.wasScaled) {
          const glyphHeight = helperCurve.length;
          textItem.scaling = textSize / glyphHeight;
        }

        const angle = helperCurve.line.vector.angle;
        if (textAngle !== 0) {
          textItem.rotation = textAngle - angle;
        }
      }
    }
  };

  const getFirstCurve = function (item: any) {
    for (let i = 0; i < item.children.length; i++) {
      for (let j = 0; j < item.children[i].children.length; j++) {
        const child = item.children[i].children[j];
        if (child.data.isPGGlyphRect) {
          return child.curves[0];
        }
      }
    }
  };

  const setupFontImportSection = function () {
    const $fontImportLabel = jQuery('<label>Import</label>');
    const $fontImportButton = jQuery('<input id="fontImportInput" type="file" multiple accept=".ttf, .otf, .woff" >');
    const $fontImportSection = jQuery('<div class="option-section" data-id="fontImport">');
    const $fontImportFakeButton = jQuery('<button class="fontImportFakeButton">Choose</button>');
    $fontImportSection.append($fontImportLabel, $fontImportButton, $fontImportFakeButton);
    jQuery('.toolOptionPanel .options').prepend($fontImportSection);
    $fontImportButton.on('change', function (e: any) {
      pg.text.readFontFilesFromInput(e, function (font: any) {
        const info = pg.text.getShortInfoFromFont(font);
        options.fontFamily = info.fontFamily;
        options.fontStyle = info.fontStyle;
        rebuildFamilySelect();
        rebuildFontStyleSelect();
        rebuildFontSizeInput();
        createItem(jQuery('#textToolInput').val(), creationPoint);
        $fontImportButton.val('');
      });
    });
  };

  const rebuildFamilySelect = function () {
    const importedFonts = pg.text.getImportedFonts();
    const $familySelect = jQuery('.toolOptionPanel select[name="fontFamily"]');
    $familySelect.empty();
    for (let i = 0; i < importedFonts.length; i++) {
      const font = importedFonts[i];
      const $familyOption = jQuery('<option value="' + font.name + '">' + font.name + '</option>');
      if (options.fontFamily === font.name) {
        $familyOption.attr('selected', true);
      }
      $familySelect.append($familyOption);
    }

    // use fallback font if the one in the options isn't available anymore
    if ($familySelect.children('option[selected="selected"]').length <= 0) {
      $familySelect.children('option').removeAttr('selected');
      $familySelect.children('option').first().attr('selected', true);
      options.fontFamily = $familySelect.children('option').first().val();
    }
  };

  const rebuildFontStyleSelect = function () {
    const importedFonts = pg.text.getImportedFonts();
    const $familySelect = jQuery('.toolOptionPanel select[name="fontFamily"]');
    const $styleSelect = jQuery('.toolOptionPanel select[name="fontStyle"]');
    const selectedFamily = $familySelect.val();
    $styleSelect.empty();
    for (let i = 0; i < importedFonts.length; i++) {
      const font = importedFonts[i];
      if (font.name === selectedFamily) {
        for (let j = 0; j < font.styles.length; j++) {
          const fStyle = font.styles[j];
          const $option = jQuery('<option value="' + fStyle.style + '">' + fStyle.style + '</option>');
          if (options.fontStyle === fStyle.style) {
            $option.attr('selected', true);
          }
          $styleSelect.append($option);
        }
      }
    }

    // use fallback style if the one in the options isn't available anymore
    if ($styleSelect.children('option[selected="selected"]').length <= 0) {
      $styleSelect.children('option').removeAttr('selected');
      $styleSelect.children('option').first().attr('selected', true);
      options.fontStyle = $styleSelect.children('option').first().val();
    }
  };

  const rebuildFontSizeInput = function () {
    if (textItem) {
      const $sizeInput = jQuery('.toolOptionPanel input[name="fontSize"]');
      const $sizeLabel = jQuery('.toolOptionPanel label[for="fontSize"]');
      if (textItem.data.wasScaled) {
        $sizeInput.attr('disabled', true);
        $sizeInput.val('0');
        $sizeLabel.text('Size (scaled)');
      } else {
        $sizeInput.removeAttr('disabled');
        $sizeInput.val(textItem.data.fontSize);
        $sizeLabel.text('Size');
      }
    }
  };

  const setupInputField = function () {
    $textInput = jQuery('#textToolInput');
    $textInput.focus();
    $textInput.keyup(function (event: any) {
      createItem(jQuery(this).val(), creationPoint);
      rebuildFontSizeInput();
      if (event.keyCode === 13) {
        finalizeInput();
      }
    });
  };

  const finalizeInput = function () {
    const $textInput = jQuery('#textToolInput');
    if ($textInput.val() === '') {
      textItem.remove();

    } else {
      creationPoint = paper.view.center;
      textItem = null;
      $textInput.val('');
      pg.undo.snapshot('textcreated');
    }
    toolMode = 'create';
  };

  const deactivateTool = function () {
    finalizeInput();
  };

  return {
    options: options,
    activateTool: activateTool,
    deactivateTool: deactivateTool
  };
};
