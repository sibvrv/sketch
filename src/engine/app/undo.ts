// undo functionality
// slightly modifed from https://github.com/memononen/stylii

pg.undo = function () {
  let states = [];
  let head = -1;
  const maxUndos = 80;

  const setup = function () {
    pg.undo.snapshot('init');
  };

  const snapshot = function (type) {
    const state = {
      type: type,
      json: paper.project.exportJSON({asString: false})
    };

    // remove all states after the current head
    if (head < states.length - 1) {
      states = states.slice(0, head + 1);
    }

    // add the new states
    states.push(state);

    // limit states to maxUndos by shifing states (kills first state)
    if (states.length > maxUndos) {
      states.shift();
    }

    // set the head to the states length
    head = states.length - 1;

  };

  const undo = function () {
    if (head > 0) {
      head--;
      restore(states[head]);
      jQuery(document).trigger('Undo');
    }
  };

  const redo = function () {
    if (head < states.length - 1) {
      head++;
      restore(states[head]);
      jQuery(document).trigger('Redo');
    }
  };

  const removeLastState = function () {
    states.splice(-1, 1);
  };

  const restore = function (entry) {
    const activeLayerID = paper.project.activeLayer.data.id;
    paper.project.clear();
    paper.view.update();
    paper.project.importJSON(entry.json);
    pg.layer.reinitLayers(activeLayerID);
  };

  const clear = function () {
    states = [];
    head = -1;
  };

  const getStates = function () {
    return states;
  };

  const getHead = function () {
    return head;
  };

  return {
    setup: setup,
    snapshot: snapshot,
    undo: undo,
    redo: redo,
    removeLastState: removeLastState,
    clear: clear,
    getStates: getStates,
    getHead: getHead
  };
}();
