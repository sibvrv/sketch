pg.layer = function () {

  const layerNames = ['coasts', 'sisters', 'buttons', 'spaces', 'teeth', 'arguments', 'clubs', 'thrills', 'vegetables', 'sausages', 'locks', 'kicks', 'insects', 'cars', 'trays', 'clams', 'legs', 'humor', 'levels', 'jelly', 'competition', 'cubs', 'quivers', 'flags', 'pins', 'floors', 'suits', 'actors', 'queens', 'appliances', 'dogs', 'plates', 'donkeys', 'coughing', 'tops', 'covers', 'dads', 'breath', 'sacks', 'thumbs', 'impulse', 'linens', 'industry', 'cobwebs', 'babies', 'volcanoes', 'beef', 'values', 'reason', 'birds', 'rays', 'stages', 'wrenches', 'uncles', 'water', 'bits', 'knees', 'jails', 'jellyfish', 'treatment', 'scissors', 'cars', 'vacation', 'lips', 'ovens', 'language', 'money', 'soup', 'knowledge', 'eggs', 'sponges', 'basins', 'coats', 'chalk', 'scarfs', 'letters', 'rooms', 'horses', 'touch', 'carpentry', 'honey', 'effects', 'flight', 'debt', 'boards', 'advice', 'brakes', 'fish', 'camps', 'the north', 'trains', 'balance', 'wounds', 'routes', 'guitars', 'receipts', 'cracks', 'sex', 'chance', 'looks', 'windows', 'girls', 'partners', 'stars', 'yam', 'smashing', 'existence', 'keys', 'flowers', 'talk', 'sons', 'wood', 'fuel', 'cakes', 'wealth', 'sofas', 'homes', 'desks', 'screws', 'bells', 'ears', 'juice', 'dogs', 'force', 'crooks', 'attraction', 'knots', 'lumber', 'activity', 'moons', 'creators', 'apparel', 'iron', 'crayons', 'tanks', 'twigs', 'condition', 'songs', 'snails', 'driving', 'cheese', 'rails', 'rings', 'shows', 'vans', 'love', 'moms', 'schools', 'pets', 'dust', 'experience', 'cellars', 'questions', 'rolls', 'power', 'scale', 'connection', 'grades', 'magic', 'maids', 'ships', 'leather', 'exchange', 'pigs', 'sticks', 'rhythm', 'distribution', 'harmony', 'dinosaurs', 'towns', 'rings', 'cribs', 'toes', 'heat', 'buckets', 'cables', 'books', 'drinks', 'grass', 'aunts', 'turkey', 'laborer', 'oil', 'discussion', 'drawers', 'oceans', 'machines', 'loafs', 'curtains', 'hours', 'taste', 'shaking', 'protest', 'needles', 'quicksand', 'battle', 'distance', 'bombs', 'hairs', 'smell'];

  const setup = function () {
    const defaultLayer = addNewLayer('Default layer');
    defaultLayer.data.isDefaultLayer = true;
    defaultLayer.data.id = getUniqueLayerID();

    ensureGuideLayer();

    defaultLayer.activate();
    pg.layerPanel.updateLayerList();
  };

  const isLayer = function (item) {
    return item.className === 'Layer';
  };

  const isActiveLayer = function (layer) {
    return paper.project.activeLayer.data.id == layer.data.id;
  };

  const getUniqueLayerID = function () {
    let biggestID = 0;
    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];
      if (layer.data.id > biggestID) {
        biggestID = layer.data.id;
      }
    }
    return biggestID + 1;
  };

  const ensureGuideLayer = function () {
    if (!getGuideLayer()) {
      const guideLayer = addNewLayer('pg.internalGuideLayer');
      guideLayer.data.isGuideLayer = true;
      guideLayer.data.id = getUniqueLayerID();
      guideLayer.bringToFront();
    }
  };

  const addNewLayer = function (layerName, setActive, elementsToAdd) {
    layerName = layerName || null;
    setActive = setActive || true;
    elementsToAdd = elementsToAdd || null;

    const newLayer = new paper.Layer();

    newLayer.data.id = getUniqueLayerID();

    if (layerName) {
      newLayer.name = layerName;
    } else {
      newLayer.name = 'Layer of ' + layerNames[Math.floor(Math.random() * layerNames.length)];
    }

    if (setActive) {
      newLayer.activate();
    }

    if (elementsToAdd) {
      newLayer.addChildren(elementsToAdd);
    }

    const guideLayer = getGuideLayer();
    if (guideLayer) {
      guideLayer.bringToFront();
    }
    return newLayer;
  };

  const deleteLayer = function (id) {
    const layer = getLayerByID(id);
    if (layer) {
      layer.remove();
    }
    const defaultLayer = getDefaultLayer();
    if (defaultLayer) {
      defaultLayer.activate();
    }
  };

  const addItemsToLayer = function (items, layer) {
    layer.addChildren(items);
  };

  const addSelectedItemsToActiveLayer = function () {
    addItemsToLayer(pg.selection.getSelectedItems(), paper.project.activeLayer);
  };

  const getActiveLayer = function () {
    return paper.project.activeLayer;
  };

  const setActiveLayer = function (activeLayer) {
    activeLayer.activate();
  };

  const getLayerByID = function (id) {
    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];
      if (layer.data.id == id) {
        return layer;
      }
    }
    return false;
  };

  const getDefaultLayer = function () {
    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];
      if (layer.data && layer.data.isDefaultLayer) {
        return layer;
      }
    }
    return false;
  };

  const activateDefaultLayer = function () {
    const defaultLayer = getDefaultLayer();
    defaultLayer.activate();
  };

  const getGuideLayer = function () {
    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];
      if (layer.data && layer.data.isGuideLayer) {
        return layer;
      }
    }
    return false;
  };

  const getAllUserLayers = function () {
    const layers = [];
    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];
      if (layer.data && layer.data.isGuideLayer) {
        continue;
      }
      layers.push(layer);
    }
    return layers;
  };

  const changeLayerOrderByIDArray = function (order) {
    order.reverse();
    for (let i = 0; i < order.length; i++) {
      getLayerByID(order[i]).bringToFront();
    }
    // guide layer is always top
    const guideLayer = getGuideLayer();
    if (guideLayer) {
      guideLayer.bringToFront();
    }
  };

  const reinitLayers = function (activeLayerID) {
    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];
      if (layer.data.id == activeLayerID) {
        pg.layer.setActiveLayer(layer);
        break;
      }
    }
    pg.layerPanel.updateLayerList();
  };

  return {
    setup: setup,
    isLayer: isLayer,
    isActiveLayer: isActiveLayer,
    ensureGuideLayer: ensureGuideLayer,
    addNewLayer: addNewLayer,
    deleteLayer: deleteLayer,
    addItemsToLayer: addItemsToLayer,
    addSelectedItemsToActiveLayer: addSelectedItemsToActiveLayer,
    getActiveLayer: getActiveLayer,
    setActiveLayer: setActiveLayer,
    getLayerByID: getLayerByID,
    getDefaultLayer: getDefaultLayer,
    activateDefaultLayer: activateDefaultLayer,
    getGuideLayer: getGuideLayer,
    getAllUserLayers: getAllUserLayers,
    changeLayerOrderByIDArray: changeLayerOrderByIDArray,
    reinitLayers: reinitLayers
  };

}();
