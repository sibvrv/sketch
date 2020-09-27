pg.text = function () {
  const importedFonts = [];

  const setup = function () {
    jQuery.getJSON('fonts/fonts.json', function (data) {
      jQuery.each(data.fonts, function (index, fontName) {
        opentype.load('fonts/' + fontName, function (err, font) {
          if (err) {
            console.error(err);

          } else {
            importFontLoaded(font);
          }
        });
      });
    });
  };

  const addImportedFont = function (fontName, fontStyle, fontToAdd) {
    // check if font with the same name already exists. if it does, just
    // add the style (or overwrite it, if the style already exists)
    for (let i = 0; i < importedFonts.length; i++) {
      const font = importedFonts[i];
      if (font.name == fontName) {
        for (let j = 0; j < font.styles.length; j++) {
          const fStyle = font.styles[j];
          if (fStyle.style == fontStyle) {
            fStyle.font = fontToAdd;
            return true;
          }
        }
        // if the style wasn't found, add it
        font.styles.push({
          'style': fontStyle,
          'font': fontToAdd
        });
        return true;
      }
    }
    // if no font with that name existed, add it as new
    importedFonts.push({
      'name': fontName,
      'styles': [{
        'style': fontStyle,
        'font': fontToAdd
      }]
    });
    return true;
  };

  const getImportedFonts = function () {
    return importedFonts;
  };

  const getImportedFont = function (fontName, fontStyle) {
    for (let i = 0; i < importedFonts.length; i++) {
      const font = importedFonts[i];
      if (font.name == fontName) {
        for (let j = 0; j < font.styles.length; j++) {
          const style = font.styles[j];
          if (style.style == fontStyle) {
            return style.font;
          }
        }
      }
    }
  };

  const readFontFilesFromInput = function (e, doneCallback) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(files[i]);

      reader.onload = function (e) {
        try {
          const font = opentype.parse(e.target.result);
          importFontLoaded(font);
          doneCallback(font);
        } catch (err) {
          console.error(err.toString());
        }
      };
      reader.onerror = function (err) {
        console.error(err.toString());
      };
    }
  };

  const importFontLoaded = function (font) {
    const info = getShortInfoFromFont(font);
    addImportedFont(info.fontFamily, info.fontStyle, font);
  };

  const getShortInfoFromFont = function (font) {
    const info = {};

    if (font.names.preferredFamily) {
      info.fontFamily = font.names.preferredFamily.en;
    } else {
      info.fontFamily = font.names.fontFamily.en;
    }

    if (font.names.preferredSubfamily) {
      info.fontStyle = font.names.preferredSubfamily.en;
    } else {
      info.fontStyle = font.names.fontSubfamily.en;
    }
    return info;
  };

  const createPGTextItem = function (text, options, pos) {
    const font = getImportedFont(options.fontFamily, options.fontStyle);
    const scaleFactor = options.fontSize / font.unitsPerEm;
    const asc = font.ascender;
    const desc = font.descender;
    const glyphs = font.stringToGlyphs(text);
    let offsetX = 0;
    const textGroup = new paper.Group();
    let lastGlyphIndex = -1;

    jQuery.each(glyphs, function (index, glyph) {
      let kerningPairValue = 0;
      if (lastGlyphIndex >= 0) {
        const kerning = font.kerningPairs[lastGlyphIndex + ',' + glyph.index];
        if (kerning != undefined) {
          kerningPairValue = kerning;
        }
      }
      const glyphGroup = new paper.Group();
      const glyphRect = new paper.Rectangle(new paper.Point(0, -asc), new paper.Point(glyph.advanceWidth, desc * -1));
      const glyphRectPaperPath = new paper.Path.Rectangle(glyphRect);
      glyphRectPaperPath.data.isPGGlyphRect = true;
      glyphRectPaperPath.fillColor = 'rgba(0,0,0,0.00001)'; // hack to make finrect fill
      glyphGroup.addChild(glyphRectPaperPath);
      glyphGroup.data.isPGGlyphGroup = true;

      const glyphPath = glyph.getPath(0, 0, font.unitsPerEm);
      const glyphPaperPath = new paper.CompoundPath(glyphPath.toPathData());
      pg.stylebar.applyActiveToolbarStyle(glyphPaperPath);
      glyphPaperPath.opacity = 1;
      glyphPaperPath.blendMode = 'normal';

      glyphGroup.addChild(glyphPaperPath);

      glyphGroup.pivot = glyphRectPaperPath.bounds.topLeft;
      glyphGroup.position.x = offsetX + kerningPairValue + options.letterSpacing * 10;
      textGroup.addChild(glyphGroup);
      offsetX += glyphRectPaperPath.bounds.width - (kerningPairValue * -1) - (options.letterSpacing * 10 * -1);
      lastGlyphIndex = glyph.index;
    });

    textGroup.scale(scaleFactor);
    textGroup.position = new paper.Point(pos.x, pos.y);
    textGroup.data.isPGTextItem = true;
    textGroup.data.text = text;
    textGroup.data.fontFamily = options.fontFamily;
    textGroup.data.fontStyle = options.fontStyle;
    textGroup.data.fontSize = options.fontSize;
    textGroup.data.letterSpacing = options.letterSpacing;

    return textGroup;
  };

  const convertSelectionToOutlines = function () {
    const items = pg.selection.getSelectedItems();
    for (let i = 0; i < items.length; i++) {
      const outlines = [];
      const item = items[i];
      const opacity = item.opacity;
      const blendMode = item.blendMode;
      if (pg.item.isPGTextItem(item)) {
        for (let j = 0; j < item.children.length; j++) {
          const child = item.children[j];
          if (child.data.isPGGlyphGroup) {
            for (let k = 0; k < child.children.length; k++) {
              if (!child.children[k].data.isPGGlyphRect) {
                outlines.push(child.children[k]);
              }
            }
          }
        }
        item.remove();
        const group = new paper.Group();
        pg.layer.getActiveLayer().addChild(group);
        group.addChildren(outlines);
        group.opacity = opacity;
        group.blendMode = blendMode;
        pg.selection.setItemSelection(group, true);
      }
    }
  };

  return {
    setup: setup,
    addImportedFont: addImportedFont,
    getImportedFonts: getImportedFonts,
    getImportedFont: getImportedFont,
    getShortInfoFromFont: getShortInfoFromFont,
    createPGTextItem: createPGTextItem,
    convertSelectionToOutlines: convertSelectionToOutlines,
    readFontFilesFromInput: readFontFilesFromInput
  };
}();
