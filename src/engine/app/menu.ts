// function related to the main menu

pg.menu = function () {

  const setup = function () {
    setupNavigationLogic();
    setupFileSection();
  };

  const setupNavigationLogic = function () {

    // click on $topMenuButton sets active state on button and shows/hides
    // submenu. also shows/hides inputblocker in the background (transparent)
    jQuery('#appNav .topMenu>li').off('click').on('click', function (e) {
      e.stopPropagation();
      const $button = jQuery(this);
      jQuery('#appNav .topMenu>li').not($button).removeClass('active');
      jQuery('#appNav .subMenu').hide();

      if (!$button.hasClass('empty')) {
        $button.parent().addClass('active');

        if ($button.hasClass('active')) {
          closeMainMenu();

        } else {
          $button.addClass('active').children('ul').show();
          $button.find('.subSubMenu').removeClass('active');
          jQuery('#menuInputBlocker').show();
        }
      }
    });

    jQuery('#appNav .subMenu .hasSubSubMenu').off('click').on('click', function (e) {
      e.stopPropagation();
      const $subSubMenu = jQuery(this).children('ul');
      $subSubMenu.toggleClass('active');
    });

    jQuery('.subSubMenu>li').on('click', function (e) {
      e.stopPropagation();
      closeMainMenu();
    });

    jQuery('#menuInputBlocker').off('click').on('click', function (e) {
      hideMenus();
    });

  };

  const closeMainMenu = function () {
    jQuery('.topMenuButton').removeClass('active');
    jQuery('.subMenu').hide();
    jQuery('.subSubMenu').removeClass('active');
    jQuery('#menuInputBlocker').hide();
  };

  const setupFileSection = function () {

    jQuery('.clearDocument_button').click(function () {
      if (confirm('Clear the document permanently?')) {
        pg.document.clear();
      }
    });

    jQuery('.resetSettings_button').click(function () {
      if (confirm('Clear all document and tool settings?')) {
        pg.settings.clearSettings();
      }
    });

    // handle change on hidden file input in menu item
    jQuery('#fileUploadSVG').on('change', function (event) {
      pg.helper.processFileInput('text', event.target, function (data) {
        pg.import.importAndAddSVG(data);
      });
    });

    // handle change on hidden file input in menu item
    jQuery('#fileUploadJSON').on('change', function (event) {
      pg.helper.processFileInput('text', event.target, function (data) {
        pg.document.loadJSONDocument(data);
      });
    });

    jQuery('.undo_button').click(function () {
      pg.undo.undo();
    });

    jQuery('.redo_button').click(function () {
      pg.undo.redo();
    });

    // handle change on hidden file input in menu item
    jQuery('#fileUploadImage').on('change', function (event) {
      pg.helper.processFileInput('dataURL', event.target, function (dataURL) {
        pg.import.importAndAddImage(dataURL);
      });
    });

    jQuery('.importImageFromURL_button').click(function () {
      const url = prompt('Paste URL to Image (jpg, png, gif)', 'http://');
      if (url) {
        pg.import.importAndAddExternalImage(url);
      }
    });

    jQuery('.importSVGFromURL_button').click(function () {
      const url = prompt('Paste URL to SVG', 'http://');
      if (url) {
        pg.import.importAndAddSVG(url);
      }
    });

    jQuery('.exportJSON_button').click(function () {
      pg.document.saveJSONDocument();
    });

    // export click handler in menu
    jQuery('.exportSVG_button').click(function () {
      pg.export.exportAndPromptSVG();
    });

    jQuery('.exportImage_button').click(function () {
      pg.export.exportAndPromptImage();
    });

    jQuery('.zoomIn_button').click(function () {
      pg.view.zoomBy(1.25);
    });

    jQuery('.zoomOut_button').click(function () {
      pg.view.zoomBy(1 / 1.25);
    });

    jQuery('.resetZoom_button').click(function () {
      pg.view.resetZoom();
    });

    jQuery('.resetPan_button').click(function () {
      pg.view.resetPan();
    });

    jQuery('.scriptEditorButton').click(function () {
      pg.codeEditor.toggleVisibility();
    });

    jQuery('.layerPanelButton').click(function () {
      pg.layerPanel.toggleVisibility();
    });

    jQuery('.aboutButton').click(function () {
      showAboutModal();
    });

  };

  const setupToolEntries = function (entries) {
    const $toolMenu = jQuery('#toolSubMenu');
    $toolMenu.empty().parent().removeClass('empty');
    let $subMenuAttachParent = null;
    jQuery.each(entries, function (index, entry) {
      if (entry.type === 'title') {
        $toolMenu.append(jQuery('<li class="space"></li>'));
        const $subSubMenuButton = jQuery('<li class="hasSubSubMenu">' + entry.text + '</li>');
        $subMenuAttachParent = jQuery('<ul class="subSubMenu">');
        $subSubMenuButton.append($subMenuAttachParent);
        $toolMenu.append($subSubMenuButton);

      } else if (entry.type === 'button') {
        const classString = entry.class ? ' ' + entry.class : '';
        const $toolButton = jQuery('<li class="button' + classString + '" data-click="' + entry.click + '">' + entry.label + '</li>');

        $toolButton.click(function () {
          const func = jQuery(this).attr('data-click');
          pg.helper.executeFunctionByName(func, window);
          setTimeout(function () {
            hideMenus();
          }, 100);
        });
        if ($subMenuAttachParent === undefined) {
          $toolMenu.append($toolButton);
        } else {
          $subMenuAttachParent.append($toolButton);
        }
      }

    });
    setupNavigationLogic();
  };

  const clearToolEntries = function () {
    jQuery('#toolSubMenu').empty().parent().addClass('empty');
  };

  const showContextMenu = function (event) {

    // check for selected items, so the right context menu can be opened
    if (pg.selection.getSelectedItems().length > 0) {
      if (jQuery('#appNavContextMenu').length > 0) {
        return;
      }
      // create, append and position context menu for object context
      jQuery('body').append('<nav class=\'appNav\' id=\'appNavContextMenu\'></nav>');

      const $menu = jQuery('#toolSubMenu')
        .clone(true)
        .appendTo('#appNavContextMenu')
        .show();

      let menuPosY = event.pageY;
      const diff = (jQuery(document).height() - event.pageY) - $menu.outerHeight();
      if (diff < 0) {
        menuPosY += diff - 10;
      }
      $menu.css({'position': 'absolute', 'top': menuPosY, 'left': event.pageX});

      jQuery('#menuInputBlocker').show();

    } else {
      // todo: create context menu for document context
    }

  };

  const hideMenus = function () {
    jQuery('#appNav .topMenu>li').removeClass('active');
    jQuery('#appNav .topMenu').removeClass('active');
    jQuery('#appNav .subMenu').hide();
    jQuery('#menuInputBlocker').hide();
    hideContextMenu();
  };

  const hideContextMenu = function () {

    jQuery('body').off('click.contextMenu');
    jQuery('body>#appNavContextMenu').remove();
    jQuery('#menuInputBlocker').hide();

  };

  const showAboutModal = function () {
    const html = '<h2 class="appTitle">Papergrapher</h2><span class="versionNumber">' + pg.settings.getVersionNumber() + '</span><p>A vector editor for your browser, based on <a href="http://paperjs.org/" target="_blank">Paper.js</a> and <a href="https://github.com/memononen/stylii" target="_blank">stylii</a>. Check it out on <a href="https://github.com/w00dn/papergrapher" target="_blank">GitHub</a>.</p><p>Developed by <a href="https://twitter.com/w00dn" target="_blank">Rolf Fleischmann</a><br>Published under the <a href="https://github.com/w00dn/papergrapher/blob/master/LICENSE" target="_blank">MIT License</a></p>';
    new pg.modal.floater('appInfoWindow', 'Info', html, 300, 100);
  };

  return {
    setup: setup,
    setupToolEntries: setupToolEntries,
    clearToolEntries: clearToolEntries,
    showContextMenu: showContextMenu,
    hideContextMenu: hideContextMenu,
    showAboutModal: showAboutModal
  };

}();
