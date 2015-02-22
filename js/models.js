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

  /**
   * This is a WebStorage wrapper.
   * @class Storage
   * @constructor
   * @param {Number} idx
   */
  var Storage = function (idx) {
    /**
     * Storage#save is save data into WebStorage.
     * @method save
     * @param val {Object}
     */
    this.save = function (val) {
      if (!val._uid) {
        val._uid = UUID.generate();
      }
      val.name = val.name.t;
      var array = get_array();
      array[idx] = val;
      storage.setItem(storage_key, JSON.stringify(array));
    };

    /**
     * Storage#load is load data from WebStorage.
     * @method load
     * @return {Object}
     */
    this.load = function () {
      var obj = JSON.parse(storage.getItem(storage_key))[idx];
      obj.name = {t: obj.name};
      return obj;
    };

    /**
     * Storage#remove is remove data from WebStorage.
     * @method remove
     */
    this.remove = function () {
      var array = get_array();
      array.splice(idx, 1);
      storage.setItem(storage_key, JSON.stringify(array));
    };
  };

  /**
   * Storage.names return name and uid list has Storage.
   * @static
   * @method names
   * @return {Array} [{name: String, _uid: String}]
   */
  Storage.names = function () {
    var array = get_array();
    return _.map(array, function (v) {
      return {name: v.name, _uid: v._uid};
    });
  };

  /**
   * Storage.all_data return all data.
   * @return {Object}
   */
  Storage.all_data = function () {
    return get_array();
  };

  /**
   * Storage.importByJSON is replace saved value with received json.
   * @param json {String}
   */
  Storage.importByJSON = function (json) {
    storage.setItem(storage_key, json);
  };

  return Storage;
})();
