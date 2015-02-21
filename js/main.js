(function () {
  "use strict";

  var Storage = (function () {
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

    return Storage;
  })();


  Vue.component('edit-in-place', {
    template: '#edit-in-place-template',
    methods: {
      edit: function () {
        this.editing = true;
        var self = this;
        Vue.nextTick(function () {
          self.$el.querySelector("input").focus();
        });
      },
      unedit: function () {
        this.editing = false;
      },
      jump: function () {
        this.$event.preventDefault();
        this.unedit();
        var idx = this.jump_idx;
        if (this.$event.shiftKey) {
          idx--;
        } else {
          idx++;
        }
        this.$dispatch('jump-cel', idx);
      },
    },
    compiled: function () {
      this.$set('editing', false);

      var self = this;
      this.$on('edit-cel', function (idx) {
        if (self.jump_idx === idx) {
          self.edit();
        }
      });
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
        var s = new Storage(this.index);
        s.save(this.obj);
        this.$dispatch('tab-save', this.index);
      },
      load: function () {
        var s = new Storage(this.index);
        var obj = s.load();
        this.name   = obj.name;
        this.places = obj.places;
        this.times  = obj.times;
        this.routes = obj.routes;
      },
      exportAsJSON: function () {
        // XXX: Not beautiful
        var st = new Storage(this.index);
        alert(JSON.stringify(st.load()));
      },
    },
    computed: {
      table_size: function () {
        var self = this;
        return _.max([
          self.places.length * 2,
          self.routes.length * 2 + 1,
          self.times.length + 1,
        ]);
      },
      obj: function () {
        return {
          name:   this.name,
          places: this.places,
          times:  this.times,
          routes: this.routes,
        };
      },
    },
    created: function () {
      this.$set('places', []);
      this.$set('times', []);
      this.$set('routes', []);
      this.$set('name', '');
    },
    ready: function () {
      var self = this;
      this.load();

      this.$on('jump-cel', function (idx) {
        var l = self.places.length + self.times.length + self.routes.length;
        if (l === idx) {
          self.add();
        }
        Vue.nextTick(function () {
          self.$broadcast('edit-cel', idx);
        });
      });

      var f = function () {
        self.$dispatch('tab-change', self.index);
      };
      this.$watch('name', f);
      // doesn't work
      this.$watch('places', f, true);
      this.$watch('times',  f, true);
      this.$watch('routes', f, true);
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
      add: function (data) {
        var st = new Storage(this.tab_names.length);
        var v = data || {
          name: 'New Ryotei',
          places: ['Place', 'Place'],
          times: ['0000', '0000'],
          routes: ['Route'],
        };
        st.save(v);
        this.tab_names.push(v.name);
      },
      del: function () {
        var idx = this.current_tab;
        this.tab_names.splice(idx, 1);
        var st = new Storage(idx);
        st.remove();
      },
      fork: function () {
        var idx = this.current_tab;
        var st = new Storage(idx);
        var data = st.load();
        data.name += ' new';
        this.add(data);
      },
    },
    created: function () {
      var self = this;
      var names = Storage.names();
      this.$set('tab_names', names);

      this.$on('tab-change', function (idx) {
        self.tab_changes.$set(idx, true);
      });

      this.$on('tab-save', function (idx) {
        self.tab_changes.$set(idx, false);
      });

      var tab_changes = [];
      _.times(names.length, function (idx) {
        tab_changes.push(false);
      });

      this.$set('tab_changes', tab_changes);
    },
  });

  console.log(app);

})();
