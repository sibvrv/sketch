pg.helper = function () {

  const selectedItemsToJSONString = function () {
    const selectedItems = pg.selection.getSelectedItems();
    if (selectedItems.length > 0) {
      let jsonComp = '[["Layer",{"applyMatrix":true,"children":[';
      for (let i = 0; i < selectedItems.length; i++) {
        let itemJSON = selectedItems[i].exportJSON({asString: true});
        if (i + 1 < selectedItems.length) {
          itemJSON += ',';
        }
        jsonComp += itemJSON;
      }
      return jsonComp += ']}]]';
    } else {
      return null;
    }
  };

  const getAllPaperItems = function (includeGuides: any) {
    includeGuides = includeGuides || false;
    const allItems = [];
    for (let i = 0; i < paper.project.layers.length; i++) {
      const layer = paper.project.layers[i];
      for (let j = 0; j < layer.children.length; j++) {
        const child = layer.children[j];
        // don't give guides back
        if (!includeGuides && child.guide) {
          continue;
        }
        allItems.push(child);
      }
    }
    return allItems;
  };

  const getPaperItemsByLayerID = function (id: any) {
    const allItems = getAllPaperItems(false);
    const foundItems: any[] = [];
    jQuery.each(allItems, function (index: any, item: any) {
      if (item.layer.data.id === id) {
        foundItems.push(item);
      }
    });
    return foundItems;
  };

  const getPaperItemsByTags = function (tags: any) {
    const allItems = getAllPaperItems(true);
    const foundItems: any[] = [];
    jQuery.each(allItems, function (index: any, item: any) {
      jQuery.each(tags, function (ti: any, tag: any) {
        if (item[tag] && foundItems.indexOf(item) === -1) {
          foundItems.push(item);
        }
      });
    });
    return foundItems;
  };

  const removePaperItemsByDataTags = function (tags: any) {
    const allItems = getAllPaperItems(true);
    jQuery.each(allItems, function (index: any, item: any) {
      jQuery.each(tags, function (ti: any, tag: any) {
        if (item.data && item.data[tag]) {
          item.remove();
        }
      });
    });
  };

  const removePaperItemsByTags = function (tags: any) {
    const allItems = getAllPaperItems(true);
    jQuery.each(allItems, function (index: any, item: any) {
      jQuery.each(tags, function (ti: any, tag: any) {
        if (item[tag]) {
          item.remove();
        }
      });
    });
  };

  const processFileInput = function (dataType: any, input: any, callback: any) {
    const reader = new FileReader();

    if (dataType === 'text') {
      reader.readAsText(input.files[0]);

    } else if (dataType === 'dataURL') {
      reader.readAsDataURL(input.files[0]);
    }

    reader.onload = function () {
      callback(reader.result);
    };
  };

  const executeFunctionByName = function (functionName: any, context: any /*, args */) {
    const args = [].slice.call(arguments).splice(2);
    const namespaces = functionName.split('.');
    const func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  };

  return {
    selectedItemsToJSONString: selectedItemsToJSONString,
    getAllPaperItems: getAllPaperItems,
    getPaperItemsByLayerID: getPaperItemsByLayerID,
    getPaperItemsByTags: getPaperItemsByTags,
    removePaperItemsByDataTags: removePaperItemsByDataTags,
    removePaperItemsByTags: removePaperItemsByTags,
    processFileInput: processFileInput,
    executeFunctionByName: executeFunctionByName
  };

}();
