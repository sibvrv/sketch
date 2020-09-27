pg.codeEditor = function () {

  let $codeEditor: any;
  let wasInit: any;

  const defaultScript = 'console.log(\'Hello World!\')';

  const setup = function () {
    $codeEditor = jQuery('#codeEditorContainer');

    jQuery('#runScriptButton').click(function () {
      cleanup();
      runScript();
    });

    jQuery('#closeScriptButton').click(function () {
      cleanup();
      jQuery('#codeEditorContainer').addClass('hidden');
    });

    jQuery('#clearConsoleButton').click(function () {
      jQuery('#consoleOutput').children('span').remove();
    });

    jQuery('#codeEditorArea')[0].spellcheck = false;

    setupExamplesDropdown();
  };

  const toggleVisibility = function () {

    if ($codeEditor.hasClass('hidden')) {
      if (!wasInit) {
        wasInit = true;
        loadEditorResources();
        (function () {
          const log = console.log;
          console.log = function () {
            const args = Array.prototype.slice.call(arguments);
            if (args[0] !== 'key') {
              jQuery('#consoleOutput').append('<span class="message">' + args + '</span>').scrollTop(99999);
            }
            log.apply(this, args);
          };
        }());
        $codeEditor.removeClass('hidden');

      } else {
        $codeEditor.removeClass('hidden');
      }
      paper.view.viewSize.width = jQuery('body').width() * 0.5;
      jQuery('#paperCanvas').css({'width': '50%'});
      pg.view.resetPan();

    } else {
      cleanup();
      $codeEditor.addClass('hidden');
      paper.view.viewSize.width = jQuery('body').width();
      jQuery('#paperCanvas').css({'width': '100%'});
      pg.view.resetPan();
    }
  };

  const loadEditorResources = function () {
    jQuery('<link />', {
      href: 'css/codeEditor.css',
      rel: 'stylesheet',
      id: 'codeEditorCSS'
    }).appendTo('head');

    // dynamically load stacktrace.js if not loaded yet
    try {
      printStackTrace();
    } catch (error) {
      jQuery.getScript('js/lib/stacktrace.js')
        .fail(function (jqxhr: any, settings: any, exception: any) {
          console.log(exception);
          return false;
        });
    }

    // dynamically load taboverride.min.js if not loaded yet
    try {
      tabOverride.set();
    } catch (error) {
      jQuery.getScript('js/lib/taboverride.min.js')
        .done(function () {
          jQuery('#codeEditorArea').tabOverride(true);
          jQuery.fn.tabOverride.autoIndent(true);
        })
        .fail(function (jqxhr: any, settings: any, exception: any) {
          console.log(exception);
          return false;
        });
    }

    return true;
  };

  const runScript = function () {
    const codeString = jQuery('#codeEditorArea').val();

    try {
      jQuery('body').append('<script id="userScript">with(paper) {' + codeString + '}</script>');
    } catch (error) {
      const trace = printStackTrace({e: error});
      const splitTrace = trace[0].split(':');
      const lineNumber = splitTrace[splitTrace.length - 2];
      jQuery('#consoleOutput').append('<span class="error">Line ' + lineNumber + ': ' + error.message + '</span>');
    }
    pg.undo.snapshot('codeEditor');
    paper.view.update();

  };

  const setupExamplesDropdown = function () {
    const $li = jQuery('<li class="scriptExamplesDropdown">');
    const $select = jQuery('<select title="Script examples">');
    const $defaultOption = jQuery('<option value="default-script" selected>Default script</option>');

    $select.append($defaultOption);

    jQuery.getJSON('user/scripts/scripts.json', function (data: any) {
      jQuery.each(data.scripts, function (index: any, scriptID: any) {
        const $option = jQuery('<option value="' + scriptID + '">' + scriptID + '.js</option>');
        $select.append($option);
      });
    });

    $select.on('change', function () {
      const val = jQuery(this).val();
      loadScriptByID(val);
    });

    loadScriptByID('default-script');

    $li.append($select);

    jQuery('#codeEditorContainer .topMenu').append($li);
  };

  const loadScriptByID = function (scriptID: any) {
    if (scriptID === 'default-script') {
      jQuery('#codeEditorArea').val(defaultScript);
    } else {
      jQuery.ajax({
        url: 'user/scripts/' + scriptID + '.js',
        dataType: 'text',
        success: function (data: any) {
          jQuery('#codeEditorArea').val(data);
        }
      });
    }
  };

  const cleanup = function () {
    jQuery('#userScript').remove();
  };

  return {
    setup: setup,
    toggleVisibility: toggleVisibility
  };

}();
