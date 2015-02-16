(function () {
  "use strict";

  var Storage = function (name) {
    var storage = localStorage;

    this.save = function (val) {
      storage.setItem(name, val);
    };

    this.load = function () {
      return storage.getItem(name);
    };
  };

  Vue.component('edit-in-place', {
    template: '#edit-in-place-template',
    methods: {
      toggle_edit: function () {
        this.editing = !this.editing;
      },
    },
    compiled: function () {
      this.$set('editing', false);
    },
  });


  Vue.component('ryotei-table', {
    template: '#ryotei-table-template',
    methods: {
      enabled_place: function (idx) {
        return idx % 2 === 0;
      },
      enabled_route: function (idx) {
        return idx % 2 === 1;
      },
      add: function () {
        this.places.push('Place');
        this.times.push('0000');
        this.times.push('0000');
        this.routes.push('Route');
      },
      save: function () {
        var s = new Storage(this.key);
        s.save(this.json);
      },
      load: function () {
        var s = new Storage(this.key);
        var obj = JSON.parse(s.load());
        this.name   = obj.name;
        this.places = obj.places;
        this.times  = obj.times;
        this.routes = obj.routes;
      },
    },
    computed: {
      table: function () {
        var res = [];
        var self = this;

        var n = _.max([
          self.places.length * 2,
          self.routes.length * 2 + 1,
          self.times.length + 1,
        ]);
        _.times(n, function (idx) {
          var obj = {};

          if (self.enabled_place(idx)) {
            obj.place = self.places[idx/2];
          }

          if (idx!==0) {
            obj.time = self.times[idx-1];
          }

          if (self.enabled_route(idx)) {
            obj.route = self.routes[(idx-1)/2];
          }
          res.push(obj);
        });

        return res;
      },
      json: function () {
        return JSON.stringify({
          name:   this.name,
          places: this.places,
          times:  this.times,
          routes: this.routes,
        });
      },
    },
    created: function () {
      this.$set('places', []);
      this.$set('times', []);
      this.$set('routes', []);
      this.$set('name', '');
    },
    ready: function () {
      this.load();

      this.$dispatch("tab-name", this.index, this.name);
    },
  });

  var app = new Vue({
    el: '#vue-main',
    data: {
      current_tab: 0,
    },
    methods: {
      show_tab: function (idx) {
        this.current_tab = idx;
      },
      active_tab: function (idx) {
        return this.current_tab === idx;
      },
      tab_name: function (idx) {
        return this.tab_names[idx];
      },
    },
    created: function () {
      var self = this;
      this.$set('tab_names', []);
      this.$on('tab-name', function (idx, name) {
        self.tab_names.$set(idx, name);
      });

      var tabs = [];
      _.times(localStorage.length, function (idx) {
        tabs.push(localStorage.key(idx));
      });

      this.$set('tabs', tabs);
    },
  });

  console.log(app);

})();
