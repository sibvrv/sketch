// functions related to settings / localstorage

pg.settings = function () {
  let config = {
    appVersion: '1.0'
  };

  const setup = function () {

  };

  const getVersionNumber = function () {
    return config.appVersion;
  };

  const setVersionNumber = function () {
    // save version number in localStorage
    localStorage.setItem('pg.version', config.appVersion);
  };

  const clearSettings = function () {
    localStorage.clear();
    setVersionNumber();
  };

  return {
    getVersionNumber: getVersionNumber,
    setup: setup,
    clearSettings: clearSettings
  };

}();
