// functions related to tools

pg.tools = function () {
  const toolList = [];

  const registerTool = function (toolInfos) {
    toolList.push(toolInfos);
  };

  const getToolList = function () {
    return toolList;
  };

  const getToolInfoByID = function (id) {
    for (let i = 0; i < toolList.length; i++) {
      if (toolList[i].id == id) {
        return toolList[i];
      }
    }
  };

  // localstorage
  const getLocalOptions = function (options) {
    const storageJSON = localStorage.getItem('pg.tools.' + options.id);
    if (storageJSON && storageJSON.length > 0) {
      const storageOptions = JSON.parse(storageJSON);

      // only overwrite options that are stored
      // new options will use their default value
      for (const option in options) {
        if (storageOptions.hasOwnProperty(option)) {
          options[option] = storageOptions[option];
        }
      }
    }
    return options;
  };

  const setLocalOptions = function (options) {
    const optionsJSON = JSON.stringify(options, null, 2);
    localStorage.setItem('pg.tools.' + options.id, optionsJSON);
  };

  const deleteLocalOptions = function (id) {
    localStorage.removeItem('pg.tools.' + id);
  };

  return {
    registerTool: registerTool,
    getToolList: getToolList,
    getToolInfoByID: getToolInfoByID,
    getLocalOptions: getLocalOptions,
    setLocalOptions: setLocalOptions,
    deleteLocalOptions: deleteLocalOptions
  };

}();
