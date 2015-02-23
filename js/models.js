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

  var encode = function (obj) {
    return obj.t;
  };

  var decode = function (text) {
    return {t: text};
  };

  /**
   * This is a WebStorage wrapper.
   * @class Storage
   * @constructor
   * @param {Number} idx
   */
  var Storage = function (idx) {
    /**
     * Storage#save is encode and save data into WebStorage.
     * @method save
     * @param val {Object}
     */
    this.save = function (val) {
      val.name   = encode(val.name);
      val.places = _.map(val.places, encode);
      val.times  = _.map(val.times,  encode);
      val.routes = _.map(val.routes, encode);

      var array = get_array();
      array[idx] = val;
      storage.setItem(storage_key, JSON.stringify(array));
    };

    /**
     * Storage#load is load and decode data from WebStorage.
     * @method load
     * @return {Object}
     */
    this.load = function () {
      var obj = JSON.parse(storage.getItem(storage_key))[idx];
      obj.name   = decode(obj.name);
      obj.places = _.map(obj.places, decode);
      obj.times  = _.map(obj.times,  decode);
      obj.routes = _.map(obj.routes, decode);
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
   * Storage.names return name list has Storage.
   * @static
   * @method names
   * @return {Array} [name, name, name, ...]
   */
  Storage.names = function () {
    var array = get_array();
    return _.pluck(array, 'name');
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
