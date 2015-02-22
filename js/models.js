var Storage = (function () {
  "use strict";


  var storage_key = "ryotei";
  var storage     = localStorage;

  if (!storage.getItem(storage_key)) {
    storage.setItem(storage_key, JSON.stringify([]));
  }

  var get_array = function () {
    return JSON.parse(storage.getItem(storage_key));
  };

  var Storage = function (idx) {
    this.save = function (val) {
      var array = get_array();
      array[idx] = val;
      storage.setItem(storage_key, JSON.stringify(array));
    };

    this.load = function () {
      return JSON.parse(storage.getItem(storage_key))[idx];
    };

    this.remove = function () {
      var array = get_array();
      array.splice(idx, 1);
      storage.setItem(storage_key, JSON.stringify(array));
    };
  };

  Storage.names = function () {
    var array = get_array();
    return _.pluck(array, 'name');
  };

  Storage.all_data = function () {
    return get_array();
  };

  Storage.importByJSON = function (json) {
    storage.setItem(storage_key, json);
  };

  return Storage;
})();
